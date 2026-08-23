# Archive: Event log

Removed from production. The HUD no longer shows a live event ring.

This folder keeps the lab log so the history is not lost.

## What it did

A 12-line in-memory ring in Zustand. Timestamps local. Not persisted.

Typical lines:

- `Desk ready. Idle timer armed.`
- `Idle — HUD on` / `Idle — MFS Lab HUD` / `Idle — battery black`
- `Wake`
- `Power → battery` / `Power → AC`
- `Hold desk on` / `Hold desk off`
- `Surface → Stay Dark Stay On` / `Surface → MFS Lab`
- `Laptop → {id}`
- `MFS sim → {id}`
- `Saved {name}`
- `Deleted MFS sim`
- `Workload → {id}`

## Restore

See `event-log.ts`. Wire `pushEvent` back into the store and mount the `<EventLog />` snippet at the bottom of Stay Dark and MFS Lab.
