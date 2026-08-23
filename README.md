# Nearblack

Sparse idle HUD. **Stay Dark Stay On** on one tab. **MFS Lab** on the other.

Private repo. Specs are typical SKUs, not a wattmeter.

## Install on any machine (Windows, Mac, Linux)

### A. Install as an app (no terminal)

1. Open the app in **Chrome** or **Edge**.
2. Click **Install** in the header, or use the browser menu: **Install app**.
3. **Safari (Mac):** Share → Add to Dock. **iPhone/iPad:** Share → Add to Home Screen.

### B. Run from this repo

Needs [Node.js 22](https://nodejs.org/).

```bash
git clone git@github.com:AdventureNLearn/nearblack.git
cd nearblack
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Surfaces

**Stay Dark Stay On** — frozen HUD. Black field, sparse clock, slow drift.

**MFS Lab** — Merciless · Fearless · Savage. 25 stock laptops (A–Z), plus saveable custom simulations. Crank Idle → Maxed. Modules shed when the HUD would fight the GPU.

## Honest limits

This is a web HUD lab. It does not yet hook Windows `SetThreadExecutionState` or a real sensor. Watts are simulated so you can test the policy on any machine.

The lab event log was stripped from production. Snapshot lives in [`archive/event-log.md`](archive/event-log.md).
