# Live Thermometer

A simple, free, ad-free live thermometer for classrooms. Search a city, see its current outdoor temperature on a glass thermometer (or as a big number), and toggle between °C and °F.

Built by the [EdTech-a-thon](https://edtechathon.com) community. Weather data and city lookups come from [Open-Meteo](https://open-meteo.com).

## What it does

- Search any city worldwide via Open-Meteo's geocoding API.
- Show the current temperature on an interactive SVG thermometer with a fixed −40…50 °C scale, or as a large numeric readout.
- Click the magnifier to zoom the thermometer fullscreen with denser tick marks — useful for projecting to a class.
- Remembers your last city, unit, and view across reloads (everything stays in `localStorage`).
- Auto-refreshes if the cached reading is more than an hour old, with a manual refresh button for everything in between.

No accounts, no ads, no paywalls, no tracking of personal data.

## Development

Requires Node 20+.

```bash
npm install
npm run dev        # start the Vite dev server
npm run build      # typecheck + production build into dist/
npm run lint       # ESLint
npm run typecheck  # tsc -b, no emit
npm run preview    # serve the built dist/ locally
```

## Stack

Vite + React 19 + TypeScript + Tailwind v4 + react-router-dom. Deployed as a static SPA on Vercel.

## Feedback

Email [directors@edtechathon.com](mailto:directors@edtechathon.com?subject=live%20thermometer%20feedback) — we'd love to hear what's working and what's not.

## License

See [LICENSE](./LICENSE).
