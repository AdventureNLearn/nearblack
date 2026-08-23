import type { HardwarePlan } from "@/lib/nearblack/hardware";

export function BudgetBar({ plan }: { plan: HardwarePlan }) {
  const total = Math.max(plan.machine.tdpW, 1);
  const segs = [
    { key: "gpu", w: plan.gpuW, cls: "bg-fg/55" },
    { key: "display", w: plan.displayW, cls: "bg-muted/80" },
    { key: "hud", w: plan.costW, cls: "bg-accent" },
    { key: "free", w: plan.headroomW, cls: "bg-bg-subtle" },
  ];

  return (
    <div>
      <div className="flex h-2 overflow-hidden rounded-full bg-bg-subtle">
        {segs.map((s) => (
          <div
            key={s.key}
            className={s.cls}
            style={{ width: `${Math.max(0, (s.w / total) * 100)}%` }}
          />
        ))}
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[0.7rem] tabular-nums text-muted">
        <Row k="GPU" v={`${plan.gpuW.toFixed(1)} W`} />
        <Row k="Display" v={`${plan.displayW.toFixed(1)} W`} />
        <Row k="HUD budget" v={`${plan.budgetW.toFixed(2)} W`} />
        <Row k="HUD cost" v={`${plan.costW.toFixed(2)} W`} />
        <Row k="Package TDP" v={`${plan.machine.tdpW} W`} />
        <Row k="VRAM" v={plan.machine.vramGb ? `${plan.machine.vramGb} GB` : "shared"} />
      </dl>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-subtle">{k}</dt>
      <dd className="text-fg">{v}</dd>
    </div>
  );
}
