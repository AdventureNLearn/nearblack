import { useEffect, useRef, useState } from "react";
import { useNearblack } from "./store";

export function useIdleMachine() {
  const isIdle = useNearblack((s) => s.isIdle);
  const holdDesk = useNearblack((s) => s.holdDesk);
  const idleTimeoutSec = useNearblack((s) => s.idleTimeoutSec);
  const goIdle = useNearblack((s) => s.goIdle);
  const [remaining, setRemaining] = useState(idleTimeoutSec);
  const lastActivity = useRef(Date.now());

  useEffect(() => {
    lastActivity.current = Date.now();
    setRemaining(idleTimeoutSec);
  }, [idleTimeoutSec]);

  useEffect(() => {
    if (isIdle) return;

    const bump = () => {
      lastActivity.current = Date.now();
    };

    window.addEventListener("pointerdown", bump, { passive: true });
    window.addEventListener("keydown", bump);
    window.addEventListener("touchstart", bump, { passive: true });

    const id = window.setInterval(() => {
      if (useNearblack.getState().holdDesk) {
        setRemaining(useNearblack.getState().idleTimeoutSec);
        lastActivity.current = Date.now();
        return;
      }
      const elapsed = (Date.now() - lastActivity.current) / 1000;
      const left = Math.max(0, idleTimeoutSec - elapsed);
      setRemaining(left);
      if (left <= 0) goIdle();
    }, 200);

    return () => {
      window.clearInterval(id);
      window.removeEventListener("pointerdown", bump);
      window.removeEventListener("keydown", bump);
      window.removeEventListener("touchstart", bump);
    };
  }, [isIdle, holdDesk, idleTimeoutSec, goIdle]);

  return { remaining };
}
