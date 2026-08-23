export type DisplayKind = "oled" | "ips";

export type Laptop = {
  id: string;
  label: string;
  tdpW: number;
  gpuIdleW: number;
  gpuMaxW: number;
  vramGb: number;
  sharedMemory: boolean;
  displayOnW: number;
  oled: boolean;
  note: string;
};

function igpu(id: string, label: string, tdpW: number, oled: boolean, note: string): Laptop {
  return {
    id,
    label,
    tdpW,
    gpuIdleW: 1.4,
    gpuMaxW: Math.max(15, tdpW - 6),
    vramGb: 0,
    sharedMemory: true,
    displayOnW: oled ? 4.2 : 5.2,
    oled,
    note,
  };
}

function dgpu(
  id: string,
  label: string,
  tdpW: number,
  gpuMaxW: number,
  vramGb: number,
  oled: boolean,
  note: string,
): Laptop {
  return {
    id,
    label,
    tdpW,
    gpuIdleW: Math.max(4, gpuMaxW * 0.08),
    gpuMaxW,
    vramGb,
    sharedMemory: false,
    displayOnW: oled ? 6.5 : 10,
    oled,
    note,
  };
}

function apple(
  id: string,
  label: string,
  tdpW: number,
  unifiedGb: number,
  note: string,
): Laptop {
  return {
    id,
    label,
    tdpW,
    gpuIdleW: 2,
    gpuMaxW: tdpW * 0.7,
    vramGb: unifiedGb,
    sharedMemory: true,
    displayOnW: 4.8,
    oled: false,
    note,
  };
}

/** 25 stock laptops, A–Z by label. Specs are typical SKUs, not a wattmeter. */
export const LAPTOPS: Laptop[] = [
  igpu("swift-go", "Acer Swift Go 14", 28, true, "Light OLED. iGPU only."),
  dgpu("alienware-m16", "Alienware m16 · RTX 4080", 300, 175, 12, false, "Fat 4080. HUD is a rounding error."),
  dgpu("tuf-16", "ASUS TUF 16 · RTX 4060", 200, 140, 8, false, "Chunky 4060 laptop."),
  igpu("zenbook-14", "ASUS Zenbook 14 OLED", 28, true, "Ultrabook. Do not pretend it is a 4090."),
  igpu("dell-xps-13", "Dell XPS 13 9340 · Arc", 28, false, "Arc iGPU still shares the package."),
  dgpu("dell-xps-15", "Dell XPS 15 · RTX 4050", 140, 115, 6, true, "dGPU present. Still a laptop TDP."),
  igpu("framework-13", "Framework 13 · 7840U", 28, false, "Repairable 28W. Shared iGPU."),
  dgpu("framework-16", "Framework 16 · 7700S", 170, 115, 8, false, "Modular dGPU module."),
  igpu("galaxy-book4", "Galaxy Book4 Pro 16", 28, true, "AMOLED panel. iGPU SoC."),
  igpu("hp-pavilion-iris-xe", "HP Pavilion 15 · Iris Xe i7", 28, false, "Shared iGPU. HUD must stay sparse."),
  igpu("hp-pavilion-plus", "HP Pavilion Plus 14 · OLED", 28, true, "Same SoC class, OLED tax on the panel."),
  igpu("hp-spectre-x360", "HP Spectre x360 14", 28, true, "Thin 2-in-1. No dGPU headroom."),
  dgpu("legion-5", "Lenovo Legion 5 · RTX 4070", 230, 140, 8, false, "Gaming 140W GPU. HUD is cheap."),
  igpu("lg-gram-17", "LG Gram 17", 28, false, "17-inch featherweight. No dGPU."),
  apple("mba-m3", "MacBook Air 13 M3", 22, 16, "Fanless. Unified memory fights the HUD."),
  apple("mbp14-m3pro", "MacBook Pro 14 M3 Pro", 42, 18, "More headroom than Air. Still unified."),
  apple("mbp16-m3max", "MacBook Pro 16 M3 Max", 80, 36, "Max still shares RAM with the display."),
  dgpu("msi-stealth-16", "MSI Stealth 16 · 4070", 200, 140, 8, true, "Stealth OLED + 140W GPU."),
  dgpu("helios-16", "Predator Helios 16 · 4070", 230, 140, 8, false, "Helios can train and still glow."),
  dgpu("razer-blade-15", "Razer Blade 15 · 4070", 220, 140, 8, false, "Thin 4070. GPU eats first."),
  dgpu("zephyrus-g14", "ROG Zephyrus G14 · 4070", 190, 125, 8, true, "Compact 125W. Plenty of HUD budget."),
  igpu("surface-laptop-7", "Surface Laptop 7 · X Elite", 23, false, "Snapdragon. Tight TDP. Treat like iGPU."),
  dgpu("surface-studio-2", "Surface Laptop Studio 2 · 4060", 150, 115, 8, false, "Studio dGPU. Display is the tax."),
  dgpu("thinkpad-p16s", "ThinkPad P16s · RTX A500", 90, 45, 4, false, "Workstation iGPU+entry dGPU."),
  igpu("thinkpad-x1", "ThinkPad X1 Carbon G12", 28, false, "Road warrior. Honest 28W package."),
];

export const LAPTOP_BY_ID: Record<string, Laptop> = Object.fromEntries(
  LAPTOPS.map((l) => [l.id, l]),
);

export const DEFAULT_LAPTOP_ID = LAPTOPS[0]!.id;
