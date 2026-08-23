import { useEffect, useMemo, useState } from "react";
import { ClockFace } from "@/components/nearblack/clock-face";
import { MfsMark } from "@/components/nearblack/mfs-mark";
import { useClock } from "@/lib/nearblack/use-clock";
import { usePlan } from "@/lib/nearblack/use-plan";
import { pickJob, pickQuip } from "@/lib/nearblack/swamp-copy";
import { usePrefersReducedMotion } from "@/lib/nearblack/use-reduced-motion";
import { useNearblack } from "@/lib/nearblack/store";
import { gpuDrawW } from "@/lib/nearblack/hardware";
import { cn } from "@/lib/utils";

function nextOffset(style: "glide" | "lily" | "orbit", t: number) {
  const maxX = Math.min(110, window.innerWidth * 0.12);
  const maxY = Math.min(70, window.innerHeight * 0.1);
  if (style === "orbit") {
    const a = t * 0.7;
    return { x: Math.cos(a) * maxX, y: Math.sin(a) * maxY * 0.7 };
  }
  const spread = style === "lily" ? 1 : 0.7;
  return {
    x: (Math.random() * 2 - 1) * maxX * spread,
    y: (Math.random() * 2 - 1) * maxY * spread,
  };
}

export function SwampIdle() {
  const swamp = useNearblack((s) => s.swamp);
  const hudOpacity = useNearblack((s) => s.hudOpacity);
  const driftIntervalSec = useNearblack((s) => s.driftIntervalSec);
  const tryWake = useNearblack((s) => s.tryWake);
  const plan = usePlan();
  const reduced = usePrefersReducedMotion();
  const show = !plan.forceBlack;
  const parts = useClock(show && plan.allowed.includes("clock"));
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [tick, setTick] = useState(0);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    setHint(true);
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault();
      tryWake();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tryWake]);

  useEffect(() => {
    if (!show || reduced) return;
    let n = 0;
    setOffset(nextOffset(swamp.driftStyle, 0));
    const id = window.setInterval(() => {
      n += 1;
      setOffset(nextOffset(swamp.driftStyle, n));
    }, (swamp.driftStyle === "lily" ? Math.max(5, driftIntervalSec - 3) : driftIntervalSec) * 1000);
    return () => window.clearInterval(id);
  }, [show, reduced, swamp.driftStyle, driftIntervalSec]);

  useEffect(() => {
    if (!show) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 3500);
    return () => window.clearInterval(id);
  }, [show]);

  const quip = useMemo(
    () => pickQuip(swamp.humor, swamp.loadPct, plan.forceBlack, tick),
    [swamp.humor, swamp.loadPct, plan.forceBlack, tick],
  );
  const job = useMemo(
    () => pickJob(swamp.loadPct, tick),
    [swamp.loadPct, tick],
  );
  const gpuNow = gpuDrawW(plan.machine, swamp.loadPct);
  const loud = swamp.density === "loud";
  const ms = swamp.driftStyle === "lily" ? 1.15 : swamp.driftStyle === "orbit" ? 5.5 : 6.5;

  const allowed = (id: (typeof plan.allowed)[number]) => plan.allowed.includes(id);

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-void"
      role="dialog"
      aria-modal="true"
      aria-label={plan.forceBlack ? "Battery idle. Touch to wake." : "MFS Lab idle display"}
      onPointerUp={tryWake}
    >
      {show ? (
        <div
          className={cn("max-w-lg px-6 text-center will-change-transform", loud && "max-w-xl")}
          style={{
            opacity: hudOpacity + 0.06,
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
            transition: reduced ? "none" : `transform ${ms}s cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        >
          <MfsMark className="mx-auto mb-5 size-7 opacity-70" />
          {allowed("clock") ? (
            <ClockFace
              parts={parts}
              opacity={1}
              offset={{ x: 0, y: 0 }}
              drifting={false}
              reduced
              showDate={allowed("date")}
            />
          ) : null}

          {allowed("quip") ? (
            <p className="mt-6 font-sans text-sm text-pretty text-hud/80">{quip}</p>
          ) : null}

          {allowed("aiTicker") ? (
            <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-accent">
              {job}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {allowed("gpuMeter") ? (
              <Meter label="GPU" value={`${gpuNow.toFixed(0)}W`} fill={swamp.loadPct} />
            ) : null}
            {allowed("vram") ? (
              <Meter
                label="VRAM"
                value={plan.machine.vramGb ? `${Math.round(plan.machine.vramGb * (0.2 + swamp.loadPct / 140))}G` : "shared"}
                fill={plan.machine.vramGb ? Math.min(100, 18 + swamp.loadPct * 0.7) : swamp.loadPct}
              />
            ) : null}
          </div>

          {allowed("jobs") ? (
            <p className="mt-5 font-mono text-[0.65rem] text-muted">
              {plan.machine.label} · {Math.round(swamp.loadPct)}% load · HUD {plan.costW.toFixed(2)}W
            </p>
          ) : null}
        </div>
      ) : null}

      <p
        className="pointer-events-none absolute bottom-8 left-0 right-0 text-center font-sans text-[0.65rem] tracking-[0.28em] uppercase transition-opacity duration-500"
        style={{ opacity: hint ? 0.2 : 0, color: "var(--color-hud)" }}
      >
        Touch to wake
      </p>
    </div>
  );
}

function Meter({ label, value, fill }: { label: string; value: string; fill: number }) {
  return (
    <div className="w-36 text-left">
      <div className="flex justify-between font-mono text-[0.65rem] tabular-nums text-hud/70">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-hud/15">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${Math.min(100, Math.max(4, fill))}%` }}
        />
      </div>
    </div>
  );
}
