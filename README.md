# Moonify — Spec & Implementation Notes

**Moonify** is a browser-based moon planner with a subtle psychedelic vibe. It shows:
- A main view that renders the Moon **only when above your horizon** for the selected minute.
- A **24h timeline scrollbar** with **ivory** highlights where the Moon is visible; scrub or play it forward/backward.
- A **lunar cycle bar chart** showing total visible hours per day (with rise–set labels) and a CSS moon icon per day.
- A **location control** that auto-detects your position/timezone and lets you search or set lat/long (draggable pin).

## Stack
- **React + TypeScript** (Vite)
- **TailwindCSS** for styling (all colors in `src/constants/colors.ts`)
- **Recharts** for the cycle bar chart
- **SunCalc** for positions, illumination, and rise/set (fast and permissive)
- **Astronomy Engine** (optional) for precise new-moon boundaries
- **Luxon** for timezones/formatting
- **Leaflet + leaflet-geosearch (Nominatim)** for map + place search

## Key UI Pieces
### 1) Date Picker + Hotkeys
- Calendar date with quick buttons: **Today** (`t`) and **Tomorrow** (`y`).
- Changing the date adjusts both the disc and the timeline’s visible-interval highlights.

### 2) Timeline Scrollbar (24h)
- Shows local time 00:00–24:00. Ivory segments denote minutes where altitude>0.
- Scrub with mouse/trackpad; **Space** to play/pause, **Shift+Space** to flip direction; **←/→** ±5m, **Shift+←/→** ±30m.
- **Home/End** jump to next rise/set (or first/last visible interval).

### 3) Moon Disc
- Always draw a dark navy disc background. Overlay the **ivory** lit shape via CSS mask/clip based on `illum.phase` (0=new, 0.5=full, 1=new).
- Hide the disc entirely if altitude ≤ 0 for the selected minute.

### 4) Psychedelic Sky Backdrop
- Interpolate gradients across the day: **night → dawn (lavender/rose)** → **noon (blue)** → **sunset (crimson/orange)** → **night**.
- Compute transition windows using sunrise/sunset from SunCalc for better realism; fallback to fixed windows by clock time.

### 5) Lunar Cycle Chart
- Range: previous **New Moon** to next **New Moon**.
- For each day (local), compute total minutes with altitude>0 and render as a bar. Label with rise–set times (or em-dash if none/allday).
- Left of each bar, render a small moon icon using the same CSS masking technique.

## Algorithms
- **Moon visibility**: `SunCalc.getMoonPosition(dt, lat, lon)` → `altitudeRad`. Visible if `altitude>0` (approx; ignores refraction/terrain).
- **Rise/Set**: `SunCalc.getMoonTimes(localMidnight, lat, lon, inUTC=false)`. If `alwaysUp` or `alwaysDown`, handle specially.
- **Visible intervals**: Sample every 1–5 minutes; group contiguous visible minutes, then refine first/last minute by binary search for cleaner edges.
- **Cycle bounds**: Prefer `astronomy-engine` `SearchMoonPhase(0)` on both sides of the selected date; otherwise scan ±20 days minimizing illumination fraction.
- **Timezone**: Use `Intl.DateTimeFormat().resolvedOptions().timeZone`; Luxon for formatting.
- **Location names**: Leaflet GeoSearch (Nominatim) for forward geocoding; store display name in state.

## Colors (single source of truth)
Create `src/constants/colors.ts`:
```ts
export const colors = {
  ivory: "#FFFFF0",
  navy00: "#04050f",
  navy10: "#0B1020",
  psychedelicPink: "#f6a6c1",
  psychedelicPurple: "#9b5de5",
  psychedelicTeal: "#00f5d4",
  noonBlue: "#7ec8e3",
  sunsetCrimson: "#e63946",
  sunsetOrange: "#ff8c42",
  dawnLavender: "#b8a1ff",
  dawnRose: "#ffc0cb",
  highlightIvory: "#fffae5",
  gridLine: "rgba(255, 255, 240, 0.2)",
  textPrimary: "#F1F5F9",
  textMuted: "#B6C2CF"
};
