import type { ModuleId } from "./hardware";

export const JOBS = [
  "vLLM · 70B · batch 4",
  "llama.cpp · 32k ctx",
  "Comfy · flux-dev 1024",
  "whisper · 41 min tape",
  "exllamav2 · Q5 · 8k",
  "ollama · r1 · think",
  "sdxl turbo · queue 9",
  "embed · 12k chunks",
];

const DRY: Record<"low" | "mid" | "high" | "black", string[]> = {
  low: [
    "Pond still. Models napping.",
    "Clocks down. Lily pad cold.",
    "Nothing in the queue but frogs.",
  ],
  mid: [
    "Tokens in the water. HUD on a diet.",
    "Chat load. iGPU sharing the swamp.",
    "Keep it sparse. The model is eating.",
  ],
  high: [
    "Swamp boiling. Shed the toys.",
    "Training has the GPU. HUD goes quiet.",
    "Iris Xe would already be black.",
  ],
  black: [
    "Mud. No glow. Frogs wait.",
    "Battery plus load. Field goes black.",
    "KISS wins. Display sleeps.",
  ],
};

const SWAMPY: Record<"low" | "mid" | "high" | "black", string[]> = {
  low: [
    "Ribbit withheld. The pond is civil.",
    "A frog sits on the idle clock.",
    "MFS built a quieter swamp than this.",
  ],
  mid: [
    "Lily hop. Tokens hopping too.",
    "Do not make the HUD louder than the model.",
    "Heavy AI, light frog. That is the deal.",
  ],
  high: [
    "The GPU is a hungry toad. HUD starves first.",
    "48GB later. Right now the swamp is on fire.",
    "KISS is the adult. This lab is the dare.",
  ],
  black: [
    "Lights out in the cattails.",
    "No HUD. Only mud and math.",
    "Touch to wake the frog.",
  ],
};

export function pickQuip(
  humor: "dry" | "swamp",
  loadPct: number,
  black: boolean,
  tick: number,
) {
  const bank = humor === "swamp" ? SWAMPY : DRY;
  const lane = black ? "black" : loadPct > 70 ? "high" : loadPct > 28 ? "mid" : "low";
  const list = bank[lane];
  return list[tick % list.length] ?? list[0];
}

export function pickJob(loadPct: number, tick: number) {
  if (loadPct < 8) return "queue empty · pond idle";
  if (loadPct > 92) return "queue saturated · shed HUD";
  return JOBS[tick % JOBS.length] ?? JOBS[0];
}

export const MODULE_HINT: Record<ModuleId, string> = {
  clock: "Always first. Last to shed.",
  date: "Cheap. Still a lit pixel.",
  quip: "One line. No parade.",
  aiTicker: "What the box is chewing.",
  gpuMeter: "Simulated draw, not a sensor.",
  vram: "Shared on Iris Xe. Real on Heavy.",
  jobs: "Loudest module. First to shed.",
};
