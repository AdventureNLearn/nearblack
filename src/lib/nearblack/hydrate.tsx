import { useEffect } from "react";
import { registerPwa } from "@/components/nearblack/install-button";
import { loadSettings, saveKiss, saveSwamp, useNearblack } from "./store";

export function HydrateSettings() {
  useEffect(() => {
    const { kiss, swamp } = loadSettings();
    useNearblack.getState().hydrate(kiss, swamp);
    useNearblack.getState().tickClock();
    registerPwa();
    if (useNearblack.getState().events.length === 0) {
      useNearblack.getState().pushEvent("Desk ready. Idle timer armed.");
    }
    const clockId = window.setInterval(() => useNearblack.getState().tickClock(), 1000);
    const unsub = useNearblack.subscribe((s) => {
      saveKiss({
        power: s.power,
        idleTimeoutSec: s.idleTimeoutSec,
        hudOpacity: s.hudOpacity,
        driftIntervalSec: s.driftIntervalSec,
        holdDesk: s.holdDesk,
        surface: s.surface,
      });
      saveSwamp(s.swamp);
    });
    return () => {
      window.clearInterval(clockId);
      unsub();
    };
  }, []);
  return null;
}
