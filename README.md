# 🚌 Anavandi Travels — KSRTC Journey Experience

Travel through Kerala like you're sitting inside a KSRTC Anavandi bus. Share your journeys, and let co-travelers see the world through the bus windows.

## Features

- 🎨 **KSRTC-themed UI** — Vintage bus aesthetic with Kerala KSRTC red/cream/brown palette
- 🚌 **Bus Window Experience** — View travel photos through animated bus window frames with parallax scenery
- 📍 **14 Kerala Destinations** — Pick boarding and destination points from real KSRTC routes
- 📸 **Photo Sharing** — Post journey photos that co-travelers browse through window-style galleries
- 🎵 **Vintage Malayalam Music** — Ambient Web Audio API player with Kerala-inspired soundscapes
- ✨ **World-class Animations** — Framer Motion powered bus ride effects, scenery scrolling, and transitions
- 👤 **Guest + Auth** — Guests can browse all travels; accounts are needed to post
- 🌙 **Fullscreen Mode** — Immersive bus window experience with keyboard navigation

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (dev server + build)
- **Tailwind CSS 3** + **Framer Motion**
- **Lucide React** icons
- **Web Audio API** for ambient music

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) to explore.

## Pages

| Route | Description |
|-------|-------------|
| `/` (Landing) | Animated hero with parallax scenery, moving bus SVG, feature cards, travel showcase |
| Auth | Sign in / sign up with guest browsing option |
| Dashboard | Travel feed with search, filters, and destination quick-picks |
| Post Travel | 4-step wizard: route selection → photos → details/vibe → preview & publish |
| Travel View | Immersive bus interior with scrolling photo viewer, auto-advance, fullscreen, keyboard nav |

## Music

The ambient music player uses the Web Audio API to generate warm, vintage Kerala-inspired ambient sounds — no copyrighted audio files needed. Click the play button in the bottom-right corner.

## Keyboard Shortcuts (Travel View)

- `Space` — Play / Pause auto-advance
- `←` / `→` — Previous / Next photo
- `F` — Toggle fullscreen
- `Esc` — Exit fullscreen or go back
