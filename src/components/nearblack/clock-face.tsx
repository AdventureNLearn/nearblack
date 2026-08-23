import { cn } from "@/lib/utils";
import type { ClockParts } from "@/lib/nearblack/use-clock";

type ClockFaceProps = {
  parts: ClockParts;
  opacity: number;
  offset: { x: number; y: number };
  drifting: boolean;
  reduced: boolean;
  className?: string;
  showDate?: boolean;
};

export function ClockFace({
  parts,
  opacity,
  offset,
  drifting,
  reduced,
  className,
  showDate = true,
}: ClockFaceProps) {
  return (
    <div
      className={cn("text-center will-change-transform", className)}
      style={{
        opacity,
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: reduced
          ? "none"
          : drifting
            ? "transform 6.5s cubic-bezier(0.22, 1, 0.36, 1)"
            : "none",
      }}
    >
      <p
        className="font-display font-light tabular-nums tracking-tight text-hud text-balance"
        style={{
          fontSize: "clamp(3.75rem, 14vw, 10rem)",
          lineHeight: 0.92,
        }}
      >
        {parts.time}
      </p>
      {showDate ? (
        <p className="mt-4 font-sans text-[0.7rem] font-medium tracking-[0.32em] text-hud/65 sm:text-xs">
          {parts.date}
        </p>
      ) : null}
    </div>
  );
}
