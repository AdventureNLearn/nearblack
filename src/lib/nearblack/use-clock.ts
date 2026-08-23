import { useNearblack } from "./store";

export type ClockParts = {
  time: string;
  date: string;
};

export function useClock(_enabled = true): ClockParts {
  return useNearblack((s) => s.clock);
}
