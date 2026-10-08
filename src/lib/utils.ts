import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ClassValue2 = ClassValue;

export function confetti(count = 64, x = 50, y = 0): void {
  const holder = document.createElement("div");
  holder.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden";
  document.body.appendChild(holder);
  const colors = ["#4fa3ec", "#7fc0f4", "#b6dcff", "#ffffff", "#2a6ec4"];
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    const size = 5 + Math.random() * 7;
    const left = `calc(${x}% + ${Math.random() * 90 - 45}px)`;
    p.style.cssText = [
      "position:absolute",
      `left:${left}`,
      `top:${y}%`,
      `width:${size}px`,
      `height:${size / 2.2}px`,
      `background:${colors[Math.floor(Math.random() * colors.length)]}`,
      `border-radius:${Math.random() > 0.6 ? "9999px" : "3px"}`,
      `--pp-cx:${Math.random() * 220 - 110}px`,
      `animation:pp-confetti-fall ${1.3 + Math.random() * 1.7}s cubic-bezier(0.25,0.6,0.6,1) ${Math.random() * 0.4}s forwards`,
    ].join(";");
    holder.appendChild(p);
  }
  setTimeout(() => holder.remove(), 3800);
}
