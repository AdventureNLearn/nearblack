import type { DisplayKind } from "./laptops";

export type CustomSim = {
  id: string;
  name: string;
  tdpW: number;
  gpuMaxW: number;
  vramGb: number;
  displayKind: DisplayKind;
};

export const DEFAULT_SIMS: CustomSim[] = [
  {
    id: "mfs-heavy",
    name: "MFS Heavy · dual GPU",
    tdpW: 550,
    gpuMaxW: 450,
    vramGb: 48,
    displayKind: "oled",
  },
  {
    id: "mfs-infer",
    name: "MFS Infer · 24GB",
    tdpW: 320,
    gpuMaxW: 280,
    vramGb: 24,
    displayKind: "oled",
  },
  {
    id: "mfs-squeeze",
    name: "MFS Squeeze · 65W",
    tdpW: 65,
    gpuMaxW: 55,
    vramGb: 8,
    displayKind: "ips",
  },
];

export function simToMachine(sim: CustomSim) {
  const gpuMax = Math.min(800, Math.max(8, sim.gpuMaxW));
  return {
    id: sim.id,
    label: sim.name,
    tdpW: Math.min(1200, Math.max(12, sim.tdpW)),
    gpuIdleW: Math.max(2, gpuMax * 0.07),
    gpuMaxW: gpuMax,
    vramGb: Math.min(192, Math.max(0, sim.vramGb)),
    sharedMemory: sim.vramGb < 8,
    displayOnW: sim.displayKind === "oled" ? 6.2 : 11,
    oled: sim.displayKind === "oled",
    note: "MFS simulation. Your numbers. Not a sensor.",
  };
}

export function newSimId() {
  return `mfs-${Date.now().toString(36)}`;
}
