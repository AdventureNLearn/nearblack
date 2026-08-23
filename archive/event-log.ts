/** Archived lab event ring. Not imported by production. */

export type LabEvent = {
  id: number;
  at: string;
  msg: string;
};

export function stamp(): string {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function pushOnto(events: LabEvent[], seq: number, msg: string) {
  const id = seq;
  return {
    eventSeq: id + 1,
    events: [{ id, at: stamp(), msg }, ...events].slice(0, 12),
  };
}

export const SAMPLE: LabEvent[] = [
  { id: 1, at: "00:00:00", msg: "Desk ready. Idle timer armed." },
];
