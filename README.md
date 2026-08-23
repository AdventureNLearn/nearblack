# Nearblack

Sparse idle HUD. KISS clock on one tab. MFS Lab (frog hardware sim) on the other.

Private repo for **MFSHacks** testing. Specs are typical SKUs, not a wattmeter.

## Install on any machine (Windows, Mac, Linux)

### A. Install as an app (no terminal)

1. Open the app in **Chrome** or **Edge**.
2. Click **Install** in the header, or use the browser menu: **Install app** / **Cast, save, and share → Install page as app**.
3. **Safari (Mac):** Share → Add to Dock. **iPhone/iPad:** Share → Add to Home Screen.

That gives a standalone window. Works on whatever laptop is in front of you.

### B. Run from this repo

Needs [Node.js 22](https://nodejs.org/).

```bash
git clone git@github.com:AdventureNLearn/nearblack.git
cd nearblack
npm install
npm run dev
```

Then open the URL it prints and hit **Install**.

```bash
npm run build
npm run preview
```

## MFS Lab

- **Standard laptop** dropdown: 25 stock machines (Pavilion Iris Xe through Gram 17).
- **MFS simulation** dropdown: save as many custom boxes as you want (TDP, GPU watts, VRAM, OLED/IPS).
- Crank Pond → Maxed. Modules shed when the HUD would fight the GPU.

KISS stays frozen. Toys live in MFS Lab.

## Honest limits

This is a web HUD lab. It does not yet hook Windows `SetThreadExecutionState` or a real sensor. Watts are simulated so you can test the policy on any machine before measuring a Pavilion.
