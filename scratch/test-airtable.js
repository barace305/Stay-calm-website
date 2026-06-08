const baseId = process.env.VITE_AIRTABLE_BASE_ID;
const accessToken = process.env.VITE_AIRTABLE_ACCESS_TOKEN;
const tableName = "Traffic Accidents";

async function testFetch() {
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?maxRecords=100`;
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Total records found:", data.records ? data.records.length : 0);
    
    // Collect all unique field keys across all records
    const allKeys = new Set();
    if (data.records) {
      data.records.forEach(r => {
        Object.keys(r.fields).forEach(k => allKeys.add(k));
      });
      console.log("All unique field names found in table:", Array.from(allKeys));
      
      // Let's find the record with ID 67
      const record67 = data.records.find(r => r.fields["Accident ID"] === 67 || r.fields["Accident ID"] === "67");
      if (record67) {
        console.log("Record 67 raw fields:", JSON.stringify(record67.fields, null, 2));
      } else {
        console.log("Record 67 not found. Here are fields of the last 3 records:");
        data.records.slice(-3).forEach(r => {
          console.log(`Record (ID: ${r.fields["Accident ID"]}):`, JSON.stringify(r.fields, null, 2));
        });
      }
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testFetch();
