import { cn } from "@/lib/utils";

/** Stencil skull + helmet, inspired by the MFS mark. Not a copy of the drawing. */
export function MfsMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-accent", className)}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9.2 13.2c0-4.2 3-7.4 6.8-7.4s6.8 3.2 6.8 7.4v1.1H9.2z"
        fill="currentColor"
      />
      <path
        d="M10.4 14.6c0 5.4 2.2 8.8 5.6 8.8s5.6-3.4 5.6-8.8"
        fill="currentColor"
      />
      <ellipse cx="13.2" cy="16.4" rx="1.35" ry="1.7" fill="var(--color-bg)" />
      <ellipse cx="18.8" cy="16.4" rx="1.35" ry="1.7" fill="var(--color-bg)" />
      <path d="M15.2 19.6h1.6v1.5h-1.6z" fill="var(--color-bg)" />
      <path
        d="M12.6 22.2c1 .9 2.1 1.4 3.4 1.4s2.4-.5 3.4-1.4"
        fill="none"
        stroke="var(--color-bg)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
