import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string | undefined): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[^\d]/g, '');
  const match = cleaned.match(/^(?:7|8)?(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+7 (${match[1]}) ${match[2]} ${match[3]} ${match[4]}`;
  }
  return phone;
}
