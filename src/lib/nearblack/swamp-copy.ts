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

const DRY_BANK: Record<"low" | "mid" | "high" | "black", string[]> = {
  low: [
    "Load low. Clocks down.",
    "Field dark. Models idle.",
    "Nothing in the queue.",
  ],
  mid: [
    "Keep the HUD quieter than the model.",
    "Chat load. Shared GPU on a diet.",
    "Sparse pixels. The box is eating.",
  ],
  high: [
    "Training has the GPU. HUD goes quiet.",
    "Shed the toys. Watts go to inference.",
    "iGPU SKUs would already be black.",
  ],
  black: [
    "Battery plus load. Field goes black.",
    "Stay Dark wins. Display sleeps.",
    "No glow. Touch to wake.",
  ],
};

const SAVAGE: Record<"low" | "mid" | "high" | "black", string[]> = {
  low: [
    "Merciless on watts. Fearless on black.",
    "Disgruntled. HUD still sparse.",
    "Savage on the GPU. Civil on the pixels.",
  ],
  mid: [
    "Keep it honest. Simulated, not a sensor.",
    "The model can think. The panel should not burn.",
    "Fearless load. Merciless HUD budget.",
  ],
  high: [
    "GPU first. HUD starves. That is the deal.",
    "Savage training. Sparse remaining.",
    "Stay Dark is the adult. This lab is the dare.",
  ],
  black: [
    "Lights out. Touch to wake.",
    "No HUD. Only math.",
    "Battery plus swarm. Field goes black.",
  ],
};

export function pickQuip(
  humor: "dry" | "swamp",
  loadPct: number,
  black: boolean,
  tick: number,
) {
  const bank = humor === "swamp" ? SAVAGE : DRY_BANK;
  const lane = black ? "black" : loadPct > 70 ? "high" : loadPct > 28 ? "mid" : "low";
  const list = bank[lane];
  return list[tick % list.length] ?? list[0];
}

export function pickJob(loadPct: number, tick: number) {
  if (loadPct < 8) return "queue empty · idle";
  if (loadPct > 92) return "queue saturated · shed HUD";
  return JOBS[tick % JOBS.length] ?? JOBS[0];
}

export const MODULE_HINT: Record<ModuleId, string> = {
  clock: "Always first. Last to shed.",
  date: "Cheap. Still a lit pixel.",
  quip: "One line. No parade.",
  aiTicker: "What the box is chewing.",
  gpuMeter: "Simulated draw, not a sensor.",
  vram: "Shared on iGPU SKUs. Dedicated on dGPU.",
  jobs: "Loudest module. First to shed.",
};

export const DRIFT_LABEL: Record<"glide" | "lily" | "orbit", string> = {
  glide: "glide",
  lily: "pulse",
  orbit: "orbit",
};
