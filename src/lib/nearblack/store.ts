import { create } from "zustand";
import type {
  Density,
  DisplayKind,
  DriftStyle,
  HardwareSource,
  ModuleId,
  WorkloadId,
} from "./hardware";
import { WORKLOADS } from "./hardware";
import { DEFAULT_LAPTOP_ID } from "./laptops";
import { DEFAULT_SIMS, newSimId, type CustomSim } from "./sims";

export type PowerMode = "ac" | "battery";
export type Surface = "kiss" | "swamp";

export type LabEvent = {
  id: number;
  at: string;
  msg: string;
};

export type Settings = {
  power: PowerMode;
  idleTimeoutSec: number;
  hudOpacity: number;
  driftIntervalSec: number;
  holdDesk: boolean;
  surface: Surface;
};

export type SwampSettings = {
  source: HardwareSource;
  laptopId: string;
  simId: string;
  sims: CustomSim[];
  loadPct: number;
  workload: WorkloadId;
  modules: Record<ModuleId, boolean>;
  driftStyle: DriftStyle;
  density: Density;
  humor: "dry" | "swamp";
};

const KISS_KEY = "nearblack-v2";
const SWAMP_KEY = "nearblack-swamp-v3";

export const DEFAULT_SETTINGS: Settings = {
  power: "ac",
  idleTimeoutSec: 45,
  hudOpacity: 0.32,
  driftIntervalSec: 10,
  holdDesk: false,
  surface: "kiss",
};

export const DEFAULT_SWAMP: SwampSettings = {
  source: "laptop",
  laptopId: DEFAULT_LAPTOP_ID,
  simId: DEFAULT_SIMS[0]!.id,
  sims: DEFAULT_SIMS.map((s) => ({ ...s })),
  loadPct: 16,
  workload: "chat",
  modules: {
    clock: true,
    date: true,
    quip: true,
    aiTicker: true,
    gpuMeter: true,
    vram: true,
    jobs: true,
  },
  driftStyle: "lily",
  density: "medium",
  humor: "swamp",
};

function stamp(): string {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function currentSim(swamp: SwampSettings): CustomSim | null {
  return swamp.sims.find((s) => s.id === swamp.simId) ?? swamp.sims[0] ?? null;
}

function patchSim(swamp: SwampSettings, patch: Partial<CustomSim>): SwampSettings {
  return {
    ...swamp,
    sims: swamp.sims.map((s) => (s.id === swamp.simId ? { ...s, ...patch } : s)),
  };
}

type NearblackState = Settings & {
  swamp: SwampSettings;
  isIdle: boolean;
  idleArmedAt: number;
  clock: { time: string; date: string };
  events: LabEvent[];
  eventSeq: number;
  goIdle: (reason?: string) => void;
  wake: () => void;
  setPower: (power: PowerMode) => void;
  setIdleTimeoutSec: (n: number) => void;
  setHudOpacity: (n: number) => void;
  setDriftIntervalSec: (n: number) => void;
  setHoldDesk: (v: boolean) => void;
  setSurface: (surface: Surface) => void;
  setLaptop: (id: string) => void;
  setSim: (id: string) => void;
  createSim: (name?: string) => void;
  renameSim: (name: string) => void;
  deleteSim: () => void;
  setSimTdpW: (n: number) => void;
  setSimGpuMaxW: (n: number) => void;
  setSimVramGb: (n: number) => void;
  setSimDisplayKind: (k: DisplayKind) => void;
  setWorkload: (id: WorkloadId) => void;
  setLoadPct: (n: number) => void;
  toggleModule: (id: ModuleId) => void;
  setDriftStyle: (s: DriftStyle) => void;
  setDensity: (d: Density) => void;
  setHumor: (h: "dry" | "swamp") => void;
  hydrate: (partial: Partial<Settings>, swamp?: Partial<SwampSettings>) => void;
  pushEvent: (msg: string) => void;
  tickClock: () => void;
  tryWake: () => void;
};

export const useNearblack = create<NearblackState>((set, get) => ({
  ...DEFAULT_SETTINGS,
  swamp: {
    ...DEFAULT_SWAMP,
    modules: { ...DEFAULT_SWAMP.modules },
    sims: DEFAULT_SIMS.map((s) => ({ ...s })),
  },
  isIdle: false,
  idleArmedAt: 0,
  clock: { time: "–:––", date: "—" },
  events: [],
  eventSeq: 1,
  pushEvent: (msg) => {
    const id = get().eventSeq;
    set({
      eventSeq: id + 1,
      events: [{ id, at: stamp(), msg }, ...get().events].slice(0, 12),
    });
  },
  goIdle: (reason) => {
    if (get().isIdle) return;
    set({ isIdle: true, idleArmedAt: Date.now() });
    const batt = get().power === "battery";
    const swamp = get().surface === "swamp";
    get().pushEvent(
      reason ??
        (batt
          ? "Idle — battery black"
          : swamp
            ? "Idle — MFS Lab HUD"
            : "Idle — HUD on"),
    );
  },
  wake: () => {
    if (!get().isIdle) return;
    set({ isIdle: false, idleArmedAt: 0 });
    get().pushEvent("Wake");
  },
  tryWake: () => {
    if (!get().isIdle) return;
    if (Date.now() - get().idleArmedAt < 800) return;
    get().wake();
  },
  tickClock: () => {
    const d = new Date();
    set({
      clock: {
        time: d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        date: d
          .toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
          .toUpperCase(),
      },
    });
  },
  setPower: (power) => {
    if (get().power === power) return;
    set({ power });
    get().pushEvent(power === "battery" ? "Power → battery" : "Power → AC");
  },
  setIdleTimeoutSec: (n) => set({ idleTimeoutSec: n }),
  setHudOpacity: (n) => set({ hudOpacity: n }),
  setDriftIntervalSec: (n) => set({ driftIntervalSec: n }),
  setHoldDesk: (v) => {
    set({ holdDesk: v });
    get().pushEvent(v ? "Hold desk on" : "Hold desk off");
  },
  setSurface: (surface) => {
    if (get().surface === surface) return;
    set({ surface });
    get().pushEvent(surface === "swamp" ? "Surface → MFS Lab" : "Surface → Stay Dark Stay On");
  },
  setLaptop: (laptopId) => {
    set({ swamp: { ...get().swamp, source: "laptop", laptopId } });
    get().pushEvent(`Laptop → ${laptopId}`);
  },
  setSim: (simId) => {
    const swamp = get().swamp;
    const exists = swamp.sims.some((s) => s.id === simId);
    if (!exists) return;
    set({ swamp: { ...swamp, source: "mfs", simId } });
    get().pushEvent(`MFS sim → ${simId}`);
  },
  createSim: (name) => {
    const swamp = get().swamp;
    const base = currentSim(swamp);
    const sim: CustomSim = {
      id: newSimId(),
      name: name?.trim() || `MFS Sim ${swamp.sims.length + 1}`,
      tdpW: base?.tdpW ?? 220,
      gpuMaxW: base?.gpuMaxW ?? 180,
      vramGb: base?.vramGb ?? 16,
      displayKind: base?.displayKind ?? "oled",
    };
    set({
      swamp: {
        ...swamp,
        source: "mfs",
        simId: sim.id,
        sims: [...swamp.sims, sim],
      },
    });
    get().pushEvent(`Saved ${sim.name}`);
  },
  renameSim: (name) => {
    const trimmed = name.slice(0, 48);
    set({ swamp: patchSim(get().swamp, { name: trimmed || "Untitled sim" }) });
  },
  deleteSim: () => {
    const swamp = get().swamp;
    if (swamp.sims.length <= 1) return;
    const next = swamp.sims.filter((s) => s.id !== swamp.simId);
    set({
      swamp: {
        ...swamp,
        sims: next,
        simId: next[0]!.id,
        source: "mfs",
      },
    });
    get().pushEvent("Deleted MFS sim");
  },
  setSimTdpW: (tdpW) => set({ swamp: patchSim({ ...get().swamp, source: "mfs" }, { tdpW }) }),
  setSimGpuMaxW: (gpuMaxW) => set({ swamp: patchSim({ ...get().swamp, source: "mfs" }, { gpuMaxW }) }),
  setSimVramGb: (vramGb) => set({ swamp: patchSim({ ...get().swamp, source: "mfs" }, { vramGb }) }),
  setSimDisplayKind: (displayKind) =>
    set({ swamp: patchSim({ ...get().swamp, source: "mfs" }, { displayKind }) }),
  setWorkload: (workload) => {
    const preset = WORKLOADS.find((w) => w.id === workload);
    set({
      swamp: {
        ...get().swamp,
        workload,
        loadPct: preset?.loadPct ?? get().swamp.loadPct,
      },
    });
    get().pushEvent(`Workload → ${workload}`);
  },
  setLoadPct: (loadPct) => {
    set({ swamp: { ...get().swamp, loadPct, workload: closestWorkload(loadPct) } });
  },
  toggleModule: (id) => {
    const modules = { ...get().swamp.modules, [id]: !get().swamp.modules[id] };
    if (id === "clock") modules.clock = true;
    set({ swamp: { ...get().swamp, modules } });
  },
  setDriftStyle: (driftStyle) => set({ swamp: { ...get().swamp, driftStyle } }),
  setDensity: (density) => set({ swamp: { ...get().swamp, density } }),
  setHumor: (humor) => set({ swamp: { ...get().swamp, humor } }),
  hydrate: (partial, swamp) =>
    set({
      ...partial,
      swamp: swamp
        ? {
            ...get().swamp,
            ...swamp,
            modules: { ...DEFAULT_SWAMP.modules, ...swamp.modules },
            sims: swamp.sims?.length ? swamp.sims : get().swamp.sims,
          }
        : get().swamp,
    }),
}));

function closestWorkload(loadPct: number): WorkloadId {
  let best: WorkloadId = "chat";
  let dist = 999;
  for (const w of WORKLOADS) {
    const d = Math.abs(w.loadPct - loadPct);
    if (d < dist) {
      dist = d;
      best = w.id;
    }
  }
  return best;
}

export function loadSettings(): { kiss: Partial<Settings>; swamp?: Partial<SwampSettings> } {
  try {
    const raw = localStorage.getItem(KISS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Settings>) : {};
    const kiss: Partial<Settings> = {
      power: parsed.power === "battery" ? "battery" : "ac",
      idleTimeoutSec: clamp(parsed.idleTimeoutSec, 5, 90, DEFAULT_SETTINGS.idleTimeoutSec),
      hudOpacity: clamp(parsed.hudOpacity, 0.12, 0.5, DEFAULT_SETTINGS.hudOpacity),
      driftIntervalSec: clamp(parsed.driftIntervalSec, 8, 16, DEFAULT_SETTINGS.driftIntervalSec),
      holdDesk: Boolean(parsed.holdDesk),
      surface: parsed.surface === "swamp" ? "swamp" : "kiss",
    };
    let swamp: Partial<SwampSettings> | undefined;
    const sraw = localStorage.getItem(SWAMP_KEY);
    if (sraw) {
      const s = JSON.parse(sraw) as Partial<SwampSettings>;
      const sims = Array.isArray(s.sims) && s.sims.length ? sanitizeSims(s.sims) : DEFAULT_SIMS.map((x) => ({ ...x }));
      swamp = {
        source: s.source === "mfs" ? "mfs" : "laptop",
        laptopId: typeof s.laptopId === "string" ? s.laptopId : DEFAULT_LAPTOP_ID,
        simId: sims.some((x) => x.id === s.simId) ? s.simId : sims[0]!.id,
        sims,
        loadPct: clamp(s.loadPct, 0, 100, DEFAULT_SWAMP.loadPct),
        workload: s.workload ?? DEFAULT_SWAMP.workload,
        modules: { ...DEFAULT_SWAMP.modules, ...(s.modules ?? {}) },
        driftStyle: s.driftStyle === "glide" || s.driftStyle === "orbit" ? s.driftStyle : "lily",
        density: s.density === "sparse" || s.density === "loud" ? s.density : "medium",
        humor: s.humor === "dry" ? "dry" : "swamp",
      };
    }
    return { kiss, swamp };
  } catch {
    return { kiss: {} };
  }
}

function sanitizeSims(raw: CustomSim[]): CustomSim[] {
  return raw
    .filter((s) => s && typeof s.id === "string" && typeof s.name === "string")
    .map((s) => ({
      id: s.id,
      name: s.name.slice(0, 48),
      tdpW: clamp(s.tdpW, 12, 1200, 220),
      gpuMaxW: clamp(s.gpuMaxW, 8, 800, 180),
      vramGb: clamp(s.vramGb, 0, 192, 16),
      displayKind: s.displayKind === "ips" ? "ips" : "oled",
    }));
}

export function saveKiss(s: Settings) {
  try {
    localStorage.setItem(
      KISS_KEY,
      JSON.stringify({
        power: s.power,
        idleTimeoutSec: s.idleTimeoutSec,
        hudOpacity: s.hudOpacity,
        driftIntervalSec: s.driftIntervalSec,
        holdDesk: s.holdDesk,
        surface: s.surface,
      }),
    );
  } catch {
    /* ignore */
  }
}

export function saveSwamp(s: SwampSettings) {
  try {
    localStorage.setItem(SWAMP_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

function clamp(n: unknown, min: number, max: number, fallback: number) {
  return typeof n === "number" && Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}
