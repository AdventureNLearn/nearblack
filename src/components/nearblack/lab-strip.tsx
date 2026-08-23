import type { ReactNode } from "react";
import { Battery, Plug, Timer } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useNearblack } from "@/lib/nearblack/store";

export function LabStrip() {
  const power = useNearblack((s) => s.power);
  const idleTimeoutSec = useNearblack((s) => s.idleTimeoutSec);
  const hudOpacity = useNearblack((s) => s.hudOpacity);
  const driftIntervalSec = useNearblack((s) => s.driftIntervalSec);
  const holdDesk = useNearblack((s) => s.holdDesk);
  const events = useNearblack((s) => s.events);
  const setPower = useNearblack((s) => s.setPower);
  const setIdleTimeoutSec = useNearblack((s) => s.setIdleTimeoutSec);
  const setHudOpacity = useNearblack((s) => s.setHudOpacity);
  const setDriftIntervalSec = useNearblack((s) => s.setDriftIntervalSec);
  const setHoldDesk = useNearblack((s) => s.setHoldDesk);

  return (
    <aside className="rounded-3xl border border-border bg-bg-elevated p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-sans text-sm font-medium text-fg">KISS Lab</h2>
          <p className="mt-1 text-xs text-muted text-pretty">
            Feel first. This side is frozen. Wattage unproven on the Pavilion.
          </p>
        </div>
        <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
          v0.1 kiss
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <Label htmlFor="power-mode" className="flex items-center gap-2 text-fg">
          {power === "battery" ? (
            <Battery className="size-4 text-muted" />
          ) : (
            <Plug className="size-4 text-muted" />
          )}
          Battery mode
        </Label>
        <Switch
          id="power-mode"
          checked={power === "battery"}
          onCheckedChange={(on) => setPower(on ? "battery" : "ac")}
          aria-label="Battery mode"
        />
      </div>
      <p className="mt-2 text-[0.7rem] leading-relaxed text-subtle">
        {power === "battery"
          ? "Idle hides the HUD. Pure black until you touch."
          : "Idle shows the drifting clock HUD."}
      </p>

      <div className="mt-5 flex items-center justify-between gap-4">
        <Label htmlFor="hold-desk" className="text-fg">
          Hold desk
        </Label>
        <Switch
          id="hold-desk"
          checked={holdDesk}
          onCheckedChange={setHoldDesk}
          aria-label="Hold desk, pause idle timer"
        />
      </div>

      <Field
        label="Idle after"
        value={`${idleTimeoutSec}s`}
        icon={<Timer className="size-3.5" />}
      >
        <Slider
          min={5}
          max={90}
          step={1}
          value={[idleTimeoutSec]}
          onValueChange={([n]) => n != null && setIdleTimeoutSec(n)}
          aria-label="Idle timeout in seconds"
        />
      </Field>

      <Field label="HUD opacity" value={`${Math.round(hudOpacity * 100)}%`}>
        <Slider
          min={0.12}
          max={0.5}
          step={0.01}
          value={[hudOpacity]}
          onValueChange={([n]) => n != null && setHudOpacity(n)}
          aria-label="HUD opacity"
        />
      </Field>

      <Field label="Drift interval" value={`${driftIntervalSec}s`}>
        <Slider
          min={8}
          max={16}
          step={1}
          value={[driftIntervalSec]}
          onValueChange={([n]) => n != null && setDriftIntervalSec(n)}
          aria-label="Drift interval in seconds"
        />
      </Field>

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
    <div className="mt-5">
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
