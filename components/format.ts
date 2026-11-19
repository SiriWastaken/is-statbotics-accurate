import type { Winner } from "@/lib/score";

export const pct = (p: number) => `${(p * 100).toFixed(1)}%`;
export const label = (w: Winner) => (w === "tie" ? "Tie" : w === "red" ? "Red" : "Blue");
export const tone = (w: Winner) => (w === "red" ? "text-red" : w === "blue" ? "text-blue" : "text-muted");
