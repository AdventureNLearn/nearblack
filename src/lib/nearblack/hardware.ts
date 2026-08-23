import { DEFAULT_LAPTOP_ID, LAPTOP_BY_ID, type Laptop } from "./laptops";
import { simToMachine, type CustomSim } from "./sims";

export type { Laptop } from "./laptops";
export type { CustomSim } from "./sims";
export type DisplayKind = "oled" | "ips";
export type WorkloadId = "pond" | "chat" | "infer" | "train" | "maxed";
export type ModuleId =
  | "clock"
  | "date"
  | "aiTicker"
  | "gpuMeter"
  | "vram"
  | "quip"
  | "jobs";
export type DriftStyle = "glide" | "lily" | "orbit";
export type Density = "sparse" | "medium" | "loud";
export type HardwareSource = "laptop" | "mfs";

export type Machine = {
  id: string;
  label: string;
  tdpW: number;
  gpuIdleW: number;
  gpuMaxW: number;
  vramGb: number;
  sharedMemory: boolean;
  displayOnW: number;
  oled: boolean;
  note: string;
};

export const WORKLOADS: { id: WorkloadId; label: string; loadPct: number }[] = [
  { id: "pond", label: "Pond", loadPct: 4 },
  { id: "chat", label: "Chat", loadPct: 16 },
  { id: "infer", label: "Infer", loadPct: 52 },
  { id: "train", label: "Train", loadPct: 84 },
  { id: "maxed", label: "Maxed", loadPct: 97 },
];

export const MODULES: { id: ModuleId; label: string; costW: number }[] = [
  { id: "clock", label: "Clock", costW: 0.35 },
  { id: "date", label: "Date", costW: 0.08 },
  { id: "quip", label: "Frog line", costW: 0.16 },
  { id: "aiTicker", label: "AI ticker", costW: 0.55 },
  { id: "gpuMeter", label: "GPU meter", costW: 0.42 },
  { id: "vram", label: "VRAM", costW: 0.28 },
  { id: "jobs", label: "Job queue", costW: 0.9 },
];

const SHED_ORDER: ModuleId[] = [
  "jobs",
  "gpuMeter",
  "vram",
  "aiTicker",
  "quip",
  "date",
];

const DENSITY_MULT: Record<Density, number> = {
  sparse: 1,
  medium: 1.28,
  loud: 1.72,
};

const DRIFT_MULT: Record<DriftStyle, number> = {
  glide: 1,
  lily: 1.18,
  orbit: 1.35,
};

export type HardwareInputs = {
  source: HardwareSource;
  laptopId: string;
  sim: CustomSim | null;
  loadPct: number;
  modules: Record<ModuleId, boolean>;
  density: Density;
  driftStyle: DriftStyle;
  battery: boolean;
};

export type Shed = { id: ModuleId; reason: string };

export type HardwarePlan = {
  machine: Machine;
  gpuW: number;
  displayW: number;
  budgetW: number;
  costW: number;
  headroomW: number;
  allowed: ModuleId[];
  shed: Shed[];
  forceBlack: boolean;
  verdict: string;
};

export function laptopToMachine(l: Laptop): Machine {
  return { ...l };
}

export function resolveMachine(input: HardwareInputs): Machine {
  if (input.source === "mfs" && input.sim) return simToMachine(input.sim);
  const laptop = LAPTOP_BY_ID[input.laptopId] ?? LAPTOP_BY_ID[DEFAULT_LAPTOP_ID]!;
  return laptopToMachine(laptop);
}

export function gpuDrawW(machine: Machine, loadPct: number) {
  const t = clamp(loadPct, 0, 100) / 100;
  return machine.gpuIdleW + (machine.gpuMaxW - machine.gpuIdleW) * t;
}

export function planHardware(input: HardwareInputs): HardwarePlan {
  const machine = resolveMachine(input);
  const gpuW = gpuDrawW(machine, input.loadPct);
  const displayW = input.battery ? 0 : machine.displayOnW;
  const leftover = machine.tdpW - gpuW - (input.battery ? 0 : machine.displayOnW);
  const igpuTax = machine.sharedMemory ? Math.max(0, input.loadPct - 18) * 0.018 : 0;
  let budgetW = Math.max(0, leftover * 0.09 - igpuTax);
  if (input.battery) {
    budgetW = input.loadPct > 22 ? 0 : Math.min(budgetW, 0.4);
  }

  const forceBlack = input.battery && input.loadPct > 22;

  const requested = MODULES.filter((m) => input.modules[m.id]).map((m) => m.id);
  const mult = DENSITY_MULT[input.density] * DRIFT_MULT[input.driftStyle];

  const shed: Shed[] = [];
  let allowed = [...requested];

  if (forceBlack) {
    for (const id of allowed) {
      shed.push({ id, reason: "Battery + AI load. Display goes black." });
    }
    allowed = [];
  } else {
    const costOf = (ids: ModuleId[]) =>
      ids.reduce((sum, id) => {
        const m = MODULES.find((x) => x.id === id);
        return sum + (m ? m.costW : 0);
      }, 0) * mult;

    for (const id of SHED_ORDER) {
      if (!allowed.includes(id)) continue;
      if (costOf(allowed) <= budgetW + 0.02) break;
      allowed = allowed.filter((x) => x !== id);
      const why =
        machine.sharedMemory && input.loadPct > 40
          ? "Shared GPU is busy. Module shed."
          : "Over HUD watt budget. Module shed.";
      shed.push({ id, reason: why });
    }
    if (!allowed.includes("clock") && requested.includes("clock") && budgetW >= 0.2) {
      allowed = ["clock", ...allowed.filter((x) => x !== "clock")];
    }
  }

  const costW =
    allowed.reduce((sum, id) => {
      const m = MODULES.find((x) => x.id === id);
      return sum + (m ? m.costW : 0);
    }, 0) * (forceBlack ? 0 : DENSITY_MULT[input.density] * DRIFT_MULT[input.driftStyle]);

  const headroomW = Math.max(0, machine.tdpW - gpuW - displayW - costW);

  let verdict = "HUD fits. Pond is calm.";
  if (forceBlack) verdict = "Battery + load. Black field only.";
  else if (shed.length) verdict = `Shed ${shed.length} module${shed.length > 1 ? "s" : ""} to keep clocks down.`;
  else if (!machine.sharedMemory && input.loadPct > 80)
    verdict = "Training hard. HUD still has a lily pad.";
  else if (machine.sharedMemory && input.loadPct > 50)
    verdict = "Shared GPU is the bottleneck, not the wall wattage.";

  return {
    machine,
    gpuW,
    displayW,
    budgetW,
    costW,
    headroomW,
    allowed,
    shed,
    forceBlack,
    verdict,
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
