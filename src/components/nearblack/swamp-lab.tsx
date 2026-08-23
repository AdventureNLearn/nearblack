import type { ReactNode } from "react";
import { Cpu, Gauge, Battery, Plug } from "lucide-react";
import { BudgetBar } from "@/components/nearblack/budget-bar";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { MODULES, WORKLOADS, type Density, type DriftStyle } from "@/lib/nearblack/hardware";
import { MODULE_HINT, DRIFT_LABEL } from "@/lib/nearblack/swamp-copy";
import { usePlan } from "@/lib/nearblack/use-plan";
import { useNearblack } from "@/lib/nearblack/store";
import { cn } from "@/lib/utils";

export function SwampLab() {
  const swamp = useNearblack((s) => s.swamp);
  const events = useNearblack((s) => s.events);
  const power = useNearblack((s) => s.power);
  const holdDesk = useNearblack((s) => s.holdDesk);
  const setPower = useNearblack((s) => s.setPower);
  const setHoldDesk = useNearblack((s) => s.setHoldDesk);
  const renameSim = useNearblack((s) => s.renameSim);
  const setSimTdpW = useNearblack((s) => s.setSimTdpW);
  const setSimGpuMaxW = useNearblack((s) => s.setSimGpuMaxW);
  const setSimVramGb = useNearblack((s) => s.setSimVramGb);
  const setSimDisplayKind = useNearblack((s) => s.setSimDisplayKind);
  const setWorkload = useNearblack((s) => s.setWorkload);
  const setLoadPct = useNearblack((s) => s.setLoadPct);
  const toggleModule = useNearblack((s) => s.toggleModule);
  const setDriftStyle = useNearblack((s) => s.setDriftStyle);
  const setDensity = useNearblack((s) => s.setDensity);
  const setHumor = useNearblack((s) => s.setHumor);
  const plan = usePlan();
  const shedIds = new Set(plan.shed.map((s) => s.id));
  const sim = swamp.sims.find((s) => s.id === swamp.simId) ?? swamp.sims[0];
  const mfsActive = swamp.source === "mfs";

  return (
    <aside className="rounded-3xl border border-border bg-bg-elevated p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-sans text-sm font-medium text-fg">MFS Lab</h2>
          <p className="mt-1 text-xs text-muted text-pretty">
            Merciless on watts. Stay Dark stays frozen on the other tab.
          </p>
        </div>
        <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
          savage
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <Label htmlFor="swamp-power" className="flex items-center gap-2 text-fg">
          {power === "battery" ? (
            <Battery className="size-4 text-muted" />
          ) : (
            <Plug className="size-4 text-muted" />
          )}
          Battery mode
        </Label>
        <Switch
          id="swamp-power"
          checked={power === "battery"}
          onCheckedChange={(on) => setPower(on ? "battery" : "ac")}
          aria-label="Battery mode"
        />
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <Label htmlFor="swamp-hold" className="text-fg">
          Hold desk
        </Label>
        <Switch
          id="swamp-hold"
          checked={holdDesk}
          onCheckedChange={setHoldDesk}
          aria-label="Hold desk, pause idle timer"
        />
      </div>

      <p className="mt-5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-subtle">
        Active machine
      </p>
      <p className="mt-1 text-sm text-fg">{plan.machine.label}</p>
      <p className="mt-1 text-[0.7rem] leading-relaxed text-subtle">{plan.machine.note}</p>

      {mfsActive && sim ? (
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="sim-name">Name</Label>
            <input
              id="sim-name"
              className="field-select mt-1.5"
              value={sim.name}
              maxLength={48}
              onChange={(e) => renameSim(e.target.value)}
            />
          </div>
          <Field label="Package TDP" value={`${sim.tdpW} W`}>
            <Slider
              min={12}
              max={800}
              step={4}
              value={[sim.tdpW]}
              onValueChange={([n]) => n != null && setSimTdpW(n)}
              aria-label="Custom package TDP"
            />
          </Field>
          <Field label="GPU max" value={`${sim.gpuMaxW} W`}>
            <Slider
              min={8}
              max={600}
              step={4}
              value={[sim.gpuMaxW]}
              onValueChange={([n]) => n != null && setSimGpuMaxW(n)}
              aria-label="Custom GPU max watts"
            />
          </Field>
          <Field label="VRAM" value={`${sim.vramGb} GB`}>
            <Slider
              min={0}
              max={96}
              step={2}
              value={[sim.vramGb]}
              onValueChange={([n]) => n != null && setSimVramGb(n)}
              aria-label="Custom VRAM gigabytes"
            />
          </Field>
          <div className="flex gap-2">
            {(["oled", "ips"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setSimDisplayKind(k)}
                className={cn(
                  "h-9 flex-1 rounded-lg border text-xs uppercase tracking-wide",
                  sim.displayKind === k
                    ? "border-accent bg-accent/15 text-fg"
                    : "border-border text-muted",
                )}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-6 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-subtle">
        AI load
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {WORKLOADS.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => setWorkload(w.id)}
            className={cn(
              "h-9 rounded-lg border px-3 text-xs",
              swamp.workload === w.id
                ? "border-accent bg-accent/15 text-fg"
                : "border-border text-muted hover:text-fg",
            )}
          >
            {w.label}
          </button>
        ))}
      </div>
      <Field
        label="Load"
        value={`${Math.round(swamp.loadPct)}%`}
        icon={<Gauge className="size-3.5" />}
      >
        <Slider
          min={0}
          max={100}
          step={1}
          value={[swamp.loadPct]}
          onValueChange={([n]) => n != null && setLoadPct(n)}
          aria-label="Simulated AI load"
        />
      </Field>

      <div className="mt-5 rounded-2xl border border-border bg-bg p-4">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted">
          <Cpu className="size-3.5" />
          Capacity
        </div>
        <BudgetBar plan={plan} />
        <p className="mt-3 text-xs leading-relaxed text-pretty text-fg">{plan.verdict}</p>
      </div>

      <p className="mt-6 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-subtle">
        HUD modules
      </p>
      <ul className="mt-2 space-y-2">
        {MODULES.map((m) => {
          const shed = shedIds.has(m.id);
          const on = swamp.modules[m.id];
          return (
            <li
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-xs text-fg">
                  {m.label}
                  {shed ? (
                    <span className="ml-2 font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
                      shed
                    </span>
                  ) : null}
                </p>
                <p className="text-[0.65rem] text-subtle">{MODULE_HINT[m.id]}</p>
              </div>
              <Switch
                checked={on}
                disabled={m.id === "clock"}
                onCheckedChange={() => toggleModule(m.id)}
                aria-label={m.label}
              />
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-subtle">
        Motion
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {(["glide", "lily", "orbit"] as DriftStyle[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDriftStyle(d)}
            className={cn(
              "h-9 rounded-lg border px-3 text-xs capitalize",
              swamp.driftStyle === d
                ? "border-accent bg-accent/15 text-fg"
                : "border-border text-muted",
            )}
          >
            {DRIFT_LABEL[d]}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {(["sparse", "medium", "loud"] as Density[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDensity(d)}
            className={cn(
              "h-9 rounded-lg border px-3 text-xs capitalize",
              swamp.density === d
                ? "border-accent bg-accent/15 text-fg"
                : "border-border text-muted",
            )}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5">
        {(["dry", "swamp"] as const).map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => setHumor(h)}
            className={cn(
              "h-9 flex-1 rounded-lg border px-3 text-xs capitalize",
              swamp.humor === h
                ? "border-accent bg-accent/15 text-fg"
                : "border-border text-muted",
            )}
          >
            {h === "swamp" ? "savage" : "dry"}
          </button>
        ))}
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-subtle">
          Event log
        </p>
        <ul className="mt-3 space-y-1.5 font-mono text-[0.7rem] text-muted">
          {events.map((e) => (
            <li key={e.id} className="flex gap-3">
              <span className="shrink-0 tabular-nums text-subtle">{e.at}</span>
              <span className="min-w-0 text-pretty">{e.msg}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function Field({
  label,
  value,
  icon,
  children,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <Label className="flex items-center gap-1.5">
          {icon}
          {label}
        </Label>
        <span className="font-mono text-xs tabular-nums text-fg">{value}</span>
      </div>
      {children}
    </div>
  );
}
