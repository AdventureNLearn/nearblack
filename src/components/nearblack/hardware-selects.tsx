import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LAPTOPS } from "@/lib/nearblack/laptops";
import { useNearblack } from "@/lib/nearblack/store";
import { cn } from "@/lib/utils";

export function HardwareSelects({ compact = false }: { compact?: boolean }) {
  const swamp = useNearblack((s) => s.swamp);
  const setLaptop = useNearblack((s) => s.setLaptop);
  const setSim = useNearblack((s) => s.setSim);
  const createSim = useNearblack((s) => s.createSim);
  const deleteSim = useNearblack((s) => s.deleteSim);
  const mfsActive = swamp.source === "mfs";

  return (
    <div className={cn("w-full max-w-md", compact && "max-w-none")}>
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-subtle">
        Standard laptop
      </p>
      <select
        className={cn("field-select mt-2", !mfsActive && "field-select-active")}
        value={swamp.laptopId}
        onChange={(e) => setLaptop(e.target.value)}
        aria-label="Standard laptop"
      >
        {LAPTOPS.map((l) => (
          <option key={l.id} value={l.id}>
            {l.label}
          </option>
        ))}
      </select>

      <p className="mt-4 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-subtle">
        MFS simulation
      </p>
      <select
        className={cn("field-select mt-2", mfsActive && "field-select-active")}
        value={swamp.simId}
        onChange={(e) => setSim(e.target.value)}
        aria-label="MFS simulation"
      >
        {swamp.sims.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <div className="mt-2 flex gap-2">
        <Button size="sm" variant="secondary" className="flex-1" onClick={() => createSim()}>
          <Plus className="size-3.5" />
          Save new
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => deleteSim()}
          disabled={swamp.sims.length <= 1}
          aria-label="Delete simulation"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
