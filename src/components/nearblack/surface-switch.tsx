import { cn } from "@/lib/utils";
import { useNearblack, type Surface } from "@/lib/nearblack/store";

export function SurfaceSwitch() {
  const surface = useNearblack((s) => s.surface);
  const setSurface = useNearblack((s) => s.setSurface);

  return (
    <div
      role="tablist"
      aria-label="Surface"
      className="inline-flex rounded-full border border-border bg-bg-elevated p-1"
    >
      <Tab
        selected={surface === "kiss"}
        onClick={() => setSurface("kiss")}
        label="Stay Dark Stay On"
      />
      <Tab
        selected={surface === "swamp"}
        onClick={() => setSurface("swamp")}
        label="MFS Lab"
      />
    </div>
  );
}

function Tab({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        "h-9 min-w-16 rounded-full px-3 text-[0.65rem] font-medium tracking-wide transition-[background-color,color,transform] duration-150 sm:px-4 sm:text-xs",
        selected
          ? "bg-accent text-accent-fg"
          : "text-muted hover:text-fg",
      )}
    >
      {label}
    </button>
  );
}

export function surfaceName(s: Surface) {
  return s === "swamp" ? "MFS Lab" : "Stay Dark Stay On";
}
