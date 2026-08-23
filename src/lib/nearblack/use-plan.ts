import { planHardware, type HardwarePlan } from "./hardware";
import { useNearblack } from "./store";

export function usePlan(): HardwarePlan {
  const power = useNearblack((s) => s.power);
  const swamp = useNearblack((s) => s.swamp);
  const sim = swamp.sims.find((x) => x.id === swamp.simId) ?? swamp.sims[0] ?? null;
  return planHardware({
    source: swamp.source,
    laptopId: swamp.laptopId,
    sim,
    loadPct: swamp.loadPct,
    modules: swamp.modules,
    density: swamp.density,
    driftStyle: swamp.driftStyle,
    battery: power === "battery",
  });
}
