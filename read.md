# Yanidoro - Feature Notes

## Overview
Yanidoro is a Pomodoro-focused productivity dashboard with draggable widgets for timer, tasks, music, and quotes.

## Nadagdag na Features
- Draggable Quote widget
  - Daily quote fetch via ZenQuotes (through AllOrigins proxy)
  - LocalStorage cache (`daily_quote`, `quote_date`)
  - Fallback static quotes kapag fetch failed
- Pomodoro enhancements
  - Editable durations for Focus / Short Break / Long Break
  - Settings panel with save/cancel controls
  - Animated settings reveal using `AnimatePresence`
- Todo widget layout improvements
  - Taller fixed panel (`h-[90vh]`)
  - Internal scroll area for list items
  - Better flex layout for header/input/footer pinning
- Music player position update (top-left)
- SessionHistory z-index adjustment
- Sidebar updates
  - Added `Quote` toggle
  - Removed extra items (Progress, History, Mood, Theme, Setting) from dock menu

## Current Widget Toggles
- `dashboard` -> Pomodoro
- `task` -> Todo List
- `quote` -> Quote Widget
- `music` -> Music Player

## Dev Commands
```bash
npm run dev
npm run lint
npm run build
```

## Notes
- `npm run lint` passes.
- `npm run build` can fail in restricted network environments because `next/font` fetches Geist fonts from Google Fonts.
