import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
  }).format(price);
}
// utils/date.ts
export function formatTimestamp(timestamp: number | string | null | undefined) {
  if (!timestamp) return "Invalid date";

  let date: Date;

  if (typeof timestamp === "number") {
    // 10-digit number → assume seconds, 13-digit → milliseconds
    date = timestamp < 1e12 ? new Date(timestamp * 1000) : new Date(timestamp);
  } else if (typeof timestamp === "string") {
    // Check if string is numeric
    const num = Number(timestamp);
    if (!isNaN(num)) {
      date = num < 1e12 ? new Date(num * 1000) : new Date(num);
    } else {
      const parsed = Date.parse(timestamp);
      if (isNaN(parsed)) return "Invalid date";
      date = new Date(parsed);
    }
  } else {
    return "Invalid date";
  }

  return date.toLocaleDateString();
}

export function formatDate(date: string | Date | number): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export function calculateDiscount(
  originalPrice: number,
  currentPrice: number
): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const handleDownload = async (orderId: string) => {
  if (!orderId) return;
  const res = await fetch(`/api/invoice/${orderId}`);
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `invoice-${orderId}.pdf`;
  a.click();
  a.remove();
};
