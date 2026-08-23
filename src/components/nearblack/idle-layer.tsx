import { useEffect, useState } from "react";
import { ClockFace } from "@/components/nearblack/clock-face";
import { SwampIdle } from "@/components/nearblack/swamp-idle";
import { useClock } from "@/lib/nearblack/use-clock";
import { usePrefersReducedMotion } from "@/lib/nearblack/use-reduced-motion";
import { useNearblack } from "@/lib/nearblack/store";

function nextOffset() {
  const maxX = Math.min(220, window.innerWidth * 0.22);
  const maxY = Math.min(140, window.innerHeight * 0.18);
  return {
    x: (Math.random() * 2 - 1) * maxX,
    y: (Math.random() * 2 - 1) * maxY,
  };
}

export function IdleLayer() {
  const isIdle = useNearblack((s) => s.isIdle);
  const surface = useNearblack((s) => s.surface);
  const power = useNearblack((s) => s.power);
  const hudOpacity = useNearblack((s) => s.hudOpacity);
  const driftIntervalSec = useNearblack((s) => s.driftIntervalSec);
  const tryWake = useNearblack((s) => s.tryWake);
  const reduced = usePrefersReducedMotion();
  const showHud = isIdle && power === "ac";
  const parts = useClock(showHud && surface === "kiss");
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isIdle || surface === "swamp") {
      setOffset({ x: 0, y: 0 });
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault();
      tryWake();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isIdle, surface, tryWake]);

  useEffect(() => {
    if (!showHud || reduced || surface === "swamp") return;
    setOffset(nextOffset());
    const id = window.setInterval(() => setOffset(nextOffset()), driftIntervalSec * 1000);
    return () => window.clearInterval(id);
  }, [showHud, reduced, driftIntervalSec, surface]);

  if (!isIdle) return null;
  if (surface === "swamp") return <SwampIdle />;

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-void"
      role="dialog"
      aria-modal="true"
      aria-label={power === "battery" ? "Battery idle. Touch to wake." : "Idle display"}
      onPointerUp={tryWake}
    >
      {showHud ? (
        <ClockFace
          parts={parts}
          opacity={hudOpacity}
          offset={offset}
          drifting={!reduced}
          reduced={reduced}
        />
      ) : null}

      <p
        className="pointer-events-none absolute bottom-8 left-0 right-0 text-center font-sans text-xs tracking-[0.28em] uppercase text-hud/50"
      >
        Touch to wake
      </p>
    </div>
  );
}
