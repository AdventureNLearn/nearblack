import { createFileRoute } from "@tanstack/react-router";
import { Desk } from "@/components/nearblack/desk";
import { IdleLayer } from "@/components/nearblack/idle-layer";
import { HydrateSettings } from "@/lib/nearblack/hydrate";
import { useNearblack } from "@/lib/nearblack/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const surface = useNearblack((s) => s.surface);
  return (
    <div data-surface={surface} className="min-h-dvh bg-bg">
      <HydrateSettings />
      <Desk />
      <IdleLayer />
    </div>
  );
}
