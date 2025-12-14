import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment, { type Moment } from "moment";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(from: Date | string | number | Moment): string {
  const currentDate = moment();
  if (currentDate.diff(from as any, "days") < 1) {
    return moment(from as any).fromNow();
  } else {
    if (currentDate.year() === moment(from as any).year()) {
      return moment(from as any).format("MMM D");
    } else {
      return moment(from as any).format("MMM D, YYYY");
    }
  }
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function slugify(input: string): string {
  return input.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "");
}

export function formatPrice(price: number | string): string {
  const [whole, decimal] = price.toString().split(".");
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal ? `${formattedWhole}.${decimal}` : formattedWhole;
}

export const formatNumberFa = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("fa-IR").format(Number(value));
};

export const formatPriceFa = (
  value: number | string | null | undefined,
  currencySuffix: string = "تومان"
): string => {
  if (value === null || value === undefined) return "";
  const n = Number(value);
  // return `${new Intl.NumberFormat("fa-IR").format(n)} ${currencySuffix}`.trim();
  return `${new Intl.NumberFormat("fa-IR").format(n)}`.trim();
};

const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;

export const toFaDigits = (input: string | number | null | undefined): string => {
  if (input === null || input === undefined) return "";
  return String(input).replace(/\d/g, (d) => faDigits[Number(d)]);
};

// تاریخ
export const formatDateFa = (date: Date | string | number): string => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });
};

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getProductPriceRange(colors: any[]): { min: number; max: number } {
  if (!colors || colors.length === 0) {
    return { min: 0, max: 0 };
  }
  
  const prices = colors.map(color => color.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}