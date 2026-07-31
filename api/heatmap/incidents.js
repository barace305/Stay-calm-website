const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';
const LIVE_INCIDENT_WINDOW_MS = 90 * 60 * 1000;

const SUBTYPE_DISPLAY = {
  incident: {
    type: 'Accident',
    classification: 'Possible Accident',
    severity: 'Medium',
  },
  accident: {
    type: 'Accident',
    classification: 'Accident',
    severity: 'Medium',
  },
  'disabled vehicle': {
    type: 'Disabled Vehicle',
    classification: 'Disabled Vehicle',
    severity: 'Low',
  },
  'disabled semi trailer': {
    type: 'Disabled Semi-Trailer',
    classification: 'Disabled Semi-Trailer',
    severity: 'Medium',
  },
  'vehicle on fire': {
    type: 'Vehicle Fire',
    classification: 'Vehicle Fire',
    severity: 'High',
  },
  crash: {
    type: 'Crash',
    classification: 'Confirmed Crash',
    severity: 'High',
  },
};

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function requireEnv(name) {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : '';
}

function parseGpsCoordinates(value) {
  const raw = String(value || '').trim();
  const commaMatch = raw.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  const joinedMatch = raw.match(/^(-?\d+(?:\.\d+)?)-(-?\d+(?:\.\d+)?)$/);
  const match = commaMatch || joinedMatch;
  if (!match) return null;

  const latitude = Number(match[1]);
  const longitude = commaMatch
    ? Number(match[2])
    : -Math.abs(Number(match[2]));

  if (
    !Number.isFinite(latitude)
    || !Number.isFinite(longitude)
    || latitude < -90
    || latitude > 90
    || longitude < -180
    || longitude > 180
  ) {
    return null;
  }

  return { latitude, longitude };
}

function normalizeSubtype(value) {
  const normalized = String(value || '')
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();

  return normalized.replace(/\s/g, '') === 'disabledvehicle'
    ? 'disabled vehicle'
    : normalized;
}

function readFirstField(fields, names) {
  for (const name of names) {
    const value = fields[name];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return '';
}

function identifySource(fields, eventId) {
  const explicitSource = String(
    readFirstField(fields, ['Provider', 'provider', 'Source', 'source', 'Data Source', 'API Source'])
  ).trim().toLowerCase();
  const normalizedEventId = String(eventId || '').trim().toLowerCase();

  if (explicitSource.includes('here') || normalizedEventId.includes('here')) {
    return 'here';
  }

  if (
    explicitSource.includes('511')
    || explicitSource.includes('georgia')
    || explicitSource.includes('gdot')
    || fields['511 event ID']
  ) {
    return 'georgia-511';
  }

  return explicitSource.replace(/[^a-z0-9]+/g, '-') || 'airtable';
}

function normalizeDetectedTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeIncidentSeverity(value) {
  const normalized = String(value || '').trim().toLowerCase();
  const supported = new Set(['low', 'minor', 'major', 'critical']);

  if (!supported.has(normalized)) return 'Low';
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function normalizeRecord(record) {
  const fields = record.fields || {};
  const subtype = normalizeSubtype(fields.Subtype);
  const subtypeMeta = SUBTYPE_DISPLAY[subtype];
  const gps = parseGpsCoordinates(fields['GPS Coordinates']);
  const detectedAt = normalizeDetectedTime(fields['detected time'] || fields['Detected Time']);
  const eventId = readFirstField(fields, ['HERE event ID', 'Here event ID', 'Event ID', '511 event ID', 'Accident ID']) || record.id;
  const source = identifySource(fields, eventId);
  const incidentId = source === 'airtable'
    ? `airtable:${record.id}`
    : `${source}:${eventId}`;

  if (!eventId || !gps || !detectedAt || !subtypeMeta) {
    return {
      incident: null,
      detectedAt: null,
      reason: !gps ? 'malformed_gps' : !detectedAt ? 'malformed_timestamps' : !subtypeMeta ? 'unsupported_subtype' : 'missing_id',
    };
  }

  return {
    incident: {
      id: String(incidentId),
      type: subtypeMeta.type,
      subtype,
      description: String(fields.Description || ''),
      location: String(fields.Location || 'Unknown Location'),
      latitude: gps.latitude,
      longitude: gps.longitude,
      createdAt: detectedAt.toISOString(),
      source,
      status: 'Active',
      severity: normalizeIncidentSeverity(
        readFirstField(fields, ['Incident Severity', 'incident severity', 'Severity', 'severity'])
      ),
      classification: subtypeMeta.classification,
      airtableRecordId: record.id,
      providerEventId: String(eventId),
      accidentId: fields['Accident ID'] ? String(fields['Accident ID']) : '',
    },
    detectedAt,
    reason: '',
  };
}

async function fetchAirtableRecords({ token, baseId, tableName }) {
  const records = [];
  let offset = '';

  do {
    const params = new URLSearchParams({ pageSize: '100' });
    if (offset) params.set('offset', offset);

    const url = `${AIRTABLE_API_BASE}/${encodeURIComponent(baseId)}/${encodeURIComponent(tableName)}?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Airtable heat-map upstream error:', { status: response.status });
      throw new Error(`Airtable returned ${response.status}`);
    }

    const payload = await response.json();
    records.push(...(payload.records || []));
    offset = payload.offset || '';
  } while (offset);

  return records;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const token = requireEnv('AIRTABLE_ACCESS_TOKEN');
  const baseId = requireEnv('AIRTABLE_BASE_ID');
  const tableName = requireEnv('AIRTABLE_TABLE_NAME');

  if (!token || !baseId || !tableName) {
    return sendJson(res, 500, {
      error: 'Missing Airtable credentials',
      required: ['AIRTABLE_ACCESS_TOKEN', 'AIRTABLE_BASE_ID', 'AIRTABLE_TABLE_NAME'],
    });
  }

  try {
    const records = await fetchAirtableRecords({ token, baseId, tableName });
    const now = new Date();
    const nowMs = now.getTime();
    const seenEventIds = new Set();
    const skipped = {
      duplicate_511_event_id: 0,
      malformed_gps: 0,
      malformed_timestamps: 0,
      future_timestamps: 0,
      stale_records: 0,
      unsupported_subtype: 0,
      missing_id: 0,
    };

    const incidents = [];

    for (const record of records) {
      const { incident, detectedAt, reason } = normalizeRecord(record);
      if (!incident) {
        skipped[reason] += 1;
        continue;
      }

      const detectedAtMs = detectedAt.getTime();
      if (detectedAtMs > nowMs) {
        skipped.future_timestamps += 1;
        continue;
      }

      if (nowMs - detectedAtMs > LIVE_INCIDENT_WINDOW_MS) {
        skipped.stale_records += 1;
        continue;
      }

      if (seenEventIds.has(incident.id)) {
        skipped.duplicate_511_event_id += 1;
        continue;
      }

      seenEventIds.add(incident.id);
      incidents.push(incident);
    }

    incidents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return sendJson(res, 200, {
      incidents,
      meta: {
        totalRecords: records.length,
        returnedRecords: incidents.length,
        skipped,
      },
    });
  } catch (error) {
    console.error('Airtable heat-map request failed:', error);
    return sendJson(res, 502, {
      error: 'Airtable request failed',
    });
  }
}
