import type { ReactNode } from "react";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FrogMark } from "@/components/nearblack/frog-mark";
import { LabStrip } from "@/components/nearblack/lab-strip";
import { SurfaceSwitch } from "@/components/nearblack/surface-switch";
import { SwampLab } from "@/components/nearblack/swamp-lab";
import { useClock } from "@/lib/nearblack/use-clock";
import { useIdleMachine } from "@/lib/nearblack/use-idle-machine";
import { usePlan } from "@/lib/nearblack/use-plan";
import { useNearblack } from "@/lib/nearblack/store";
import { InstallButton } from "@/components/nearblack/install-button";
import { HardwareSelects } from "@/components/nearblack/hardware-selects";

export function Desk() {
  const { remaining } = useIdleMachine();
  const parts = useClock(true);
  const surface = useNearblack((s) => s.surface);
  const power = useNearblack((s) => s.power);
  const holdDesk = useNearblack((s) => s.holdDesk);
  const goIdle = useNearblack((s) => s.goIdle);
  const idleTimeoutSec = useNearblack((s) => s.idleTimeoutSec);
  const swamp = surface === "swamp";
  const progress = holdDesk ? 1 : Math.min(1, remaining / idleTimeoutSec);

  return (
    <div className="desk-field relative flex min-h-dvh flex-col pb-16 text-fg">
      <header className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-display text-sm font-medium tracking-[0.22em] uppercase text-muted">
          Nearblack
        </p>
        <SurfaceSwitch />
        <div className="flex flex-wrap items-center gap-2">
          <InstallButton />
          <StatusChip>
            {power === "battery" ? "Battery · black" : swamp ? "AC · MFS" : "AC · HUD"}
          </StatusChip>
          <StatusChip>
            {holdDesk ? "Held" : `Idle in ${Math.ceil(remaining)}s`}
          </StatusChip>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-start gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_22rem] lg:gap-12 lg:py-10">
        {swamp ? <SwampHero remaining={remaining} progress={progress} /> : <KissHero remaining={remaining} progress={progress} />}
        {swamp ? <SwampLab /> : <LabStrip />}
      </main>

      <footer className="mt-auto flex items-center justify-between gap-4 border-t border-border px-5 py-3 sm:px-8">
        <p className="text-[0.7rem] text-subtle">
          {swamp ? "Simulated watts · not a sensor" : "Sparse updates · CSS drift · no WebGL"}
        </p>
        <p className="font-display text-sm tabular-nums tracking-tight text-muted">
          {parts.time}
        </p>
      </footer>
    </div>
  );
}

function KissHero({ remaining, progress }: { remaining: number; progress: number }) {
  const holdDesk = useNearblack((s) => s.holdDesk);
  const goIdle = useNearblack((s) => s.goIdle);

  return (
    <section className="pt-2 sm:pt-8">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-subtle">
        KISS · locked
      </p>
      <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-balance text-fg sm:text-5xl lg:text-6xl">
        Stay dark.
        <br />
        Stay on.
      </h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-pretty text-muted sm:text-base">
        The simple HUD is frozen. Black field, sparse clock, slow drift. Toys
        and hardware sims live in MFS Lab.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button size="lg" onClick={() => goIdle("Idle — manual")}>
          <Moon className="size-4" />
          Go idle now
        </Button>
        <p className="text-xs text-subtle">Any click or key wakes.</p>
      </div>

      <IdleMeter remaining={remaining} progress={progress} holdDesk={holdDesk} />
      <MiniPreview />
    </section>
  );
}

function SwampHero({ remaining, progress }: { remaining: number; progress: number }) {
  const holdDesk = useNearblack((s) => s.holdDesk);
  const goIdle = useNearblack((s) => s.goIdle);
  const plan = usePlan();

  return (
    <section className="pt-2 sm:pt-8">
      <p className="flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-subtle">
        <FrogMark className="size-4" />
        For MFSHacks
      </p>
      <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-balance text-fg sm:text-5xl lg:text-6xl">
        Break the HUD
        <br />
        on purpose.
      </h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-pretty text-muted sm:text-base">
        Pick a real laptop, or an MFS sim you saved. Crank the load. Watch the
        HUD shed so the GPU can eat.
      </p>

      <div className="mt-6">
        <HardwareSelects />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button size="lg" onClick={() => goIdle("Idle — MFS Lab")}>
          <Moon className="size-4" />
          Go idle now
        </Button>
        <p className="text-xs text-subtle">{plan.verdict}</p>
      </div>

      <IdleMeter remaining={remaining} progress={progress} holdDesk={holdDesk} />
      <SwampPreview />
    </section>
  );
}

function IdleMeter({
  remaining,
  progress,
  holdDesk,
}: {
  remaining: number;
  progress: number;
  holdDesk: boolean;
}) {
  return (
    <div className="mt-10 max-w-sm">
      <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.2em] text-subtle">
        <span>Until idle</span>
        <span className="font-mono tabular-nums text-muted">
          {holdDesk ? "paused" : `${Math.ceil(remaining)}s`}
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-bg-subtle">
        <div
          className="h-full rounded-full bg-accent/70 transition-[width] duration-200 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

function StatusChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-bg-elevated px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-muted">
      {children}
    </span>
  );
}

function MiniPreview() {
  const parts = useClock(true);
  const hudOpacity = useNearblack((s) => s.hudOpacity);

  return (
    <div className="mt-12 max-w-sm overflow-hidden rounded-2xl border border-border bg-void">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-subtle">
          HUD preview
        </span>
        <span className="text-[0.65rem] text-subtle">KISS</span>
      </div>
      <div className="flex h-36 items-center justify-center">
        <div className="text-center" style={{ opacity: hudOpacity }}>
          <p className="font-display text-4xl font-light tabular-nums tracking-tight text-hud">
            {parts.time}
          </p>
          <p className="mt-2 text-[0.6rem] tracking-[0.28em] text-hud/70">
            {parts.date}
          </p>
        </div>
      </div>
    </div>
  );
}

function SwampPreview() {
  const parts = useClock(true);
  const hudOpacity = useNearblack((s) => s.hudOpacity);
  const plan = usePlan();

  return (
    <div className="mt-12 max-w-sm overflow-hidden rounded-2xl border border-border bg-void">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-subtle">
          Swamp preview
        </span>
        <span className="text-[0.65rem] text-subtle">
          {plan.forceBlack ? "black" : `${plan.allowed.length} mods`}
        </span>
      </div>
      <div className="flex h-36 flex-col items-center justify-center gap-2 px-4">
        {plan.forceBlack ? (
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-hud/40">
            Field black
          </p>
        ) : (
          <div className="text-center" style={{ opacity: hudOpacity + 0.08 }}>
            <FrogMark className="mx-auto mb-2 size-5 opacity-70" />
            <p className="font-display text-3xl font-light tabular-nums tracking-tight text-hud">
              {parts.time}
            </p>
            <p className="mt-1 font-mono text-[0.6rem] text-accent/80">
              {plan.machine.label}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
