import { cn } from "@/lib/utils";

export function FrogMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-accent", className)}
      aria-hidden="true"
    >
      <ellipse cx="16" cy="19" rx="10" ry="7.5" fill="currentColor" />
      <circle cx="11.2" cy="12.5" r="3.4" fill="currentColor" />
      <circle cx="20.8" cy="12.5" r="3.4" fill="currentColor" />
      <circle cx="11.2" cy="12.3" r="1.15" fill="var(--color-bg)" />
      <circle cx="20.8" cy="12.3" r="1.15" fill="var(--color-bg)" />
    </svg>
  );
}
