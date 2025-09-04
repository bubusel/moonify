# Moonify

Psychedelic moon planner built with React, TypeScript, and TailwindCSS. The app shows the current moon phase and visibility for your location with a 24‑hour timeline and lunar cycle chart.

## Development

```bash
npm install
npm run dev
```

Local dev uses Vite on [http://localhost:5173](http://localhost:5173).

## Tests

This project has no automated tests yet.

## Production build

```bash
npm run build
npm run preview
```

## Docker

### Development

`docker-compose -f docker-compose.dev.yml up --build`

### Production

Build the multi-stage image:

```bash
docker build -t moonify .
```

Run:

```bash
docker run -p 8080:80 moonify
```

## Keyboard shortcuts

| Keys | Action |
| --- | --- |
| `t` | Jump to today |
| `y` | Jump to tomorrow |
| `space` | Play/pause timeline |
| `shift+space` | Toggle play direction |
| `←/→` | ±5 minutes |
| `shift+←/→` | ±30 minutes |
| `home` | Jump to next rise/start |
| `end` | Jump to next set/end |
| `mod+k` | Open location search |
