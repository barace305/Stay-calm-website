# Stay Calm — StayCalm.Today

A premium referral network website connecting people with trusted professionals after car accidents. Currently serving Georgia, Florida, and Texas.

## Tech Stack

- **React 19** — UI framework
- **Vite 8** — Build tool & dev server
- **Tailwind CSS 4** — Utility-first styling
- **Google Fonts** — Inter + Playfair Display

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173/`

## Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder.

## Deploy on Vercel

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Vercel auto-detects Vite — no config needed
4. Deploy

## Project Structure

```
stay-calm-website/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── ContactForm.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── ServiceAreas.jsx
│   │   ├── About.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Heat Map Routes

- `/heatmap-demo` preserves the current sample-data partner heat map experience.
- `/heatmap` is the live partner heat map shell. It uses the same UI and map design, but it does not invent incidents or expose Airtable secrets.

Set `VITE_HEATMAP_INCIDENTS_ENDPOINT` to a browser-safe JSON endpoint when the live feed is ready. That endpoint should be backed by Make.com, a serverless function, or another server-side bridge that owns the Airtable PAT. Do not put Airtable personal access tokens in `VITE_` variables.

### Live Incident JSON Shape

The live endpoint may return either an array, `{ "records": [...] }`, or `{ "incidents": [...] }`. Airtable-style records with a `fields` object are supported.

Required Airtable fields:

- `Incident ID`
- `Event type`
- `Subtype`
- `Description`
- `Roadway or location`
- `Latitude`
- `Longitude`
- `Reported time`

Optional fields currently recognized by the map:

- `Severity` (`Low`, `Medium`, or `High`; defaults to `Medium`)
- `Status` (`Active` records are shown)
- `City`
- `Source`

## License

Private — © 2026 StayCalm.Today
