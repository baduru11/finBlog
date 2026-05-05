import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatLongDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const SITE = {
  name: "SEUNGWAN's FINLOG",
  tagline: "Markets, macro, and the concepts behind them.",
  description:
    "Short, careful posts on markets, macro, and the concepts that make them legible.",
  author: "Seungwan",
  email: "baduruduru0722@gmail.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fin-blog.vercel.app",
} as const;
