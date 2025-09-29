import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";


export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// export function formatRelativeDate(from) {
//   const currentDate = new Date();
//   if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
//     return formatDistanceToNowStrict(from, { addSuffix: true });
//   } else {
//     if (currentDate.getFullYear() === from.getFullYear()) {
//       return formatDate(from, "MMM d");
//     } else {
//       return formatDate(from, "MMM d, yyyy");
//     }
//   }
// }


export function formatRelativeDate(from) {
  const currentDate = moment();
  if (currentDate.diff(from, 'days') < 1) {
    return moment(from).fromNow();
  } else {
    if (currentDate.year() === moment(from).year()) {
      return moment(from).format("MMM D");
    } else {
      return moment(from).format("MMM D, YYYY");
    }
  }
}

export function formatNumber(n) {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function slugify(input) {
  return input
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}





export function formatPrice(price) {
  const [whole, decimal] = price.toString().split('.');
  
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  return decimal ? `${formattedWhole}.${decimal}` : formattedWhole;
}

// lib/utils.js
export const formatNumberFa = (value) => {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("fa-IR").format(Number(value));
};

export const formatPriceFa = (value, currencySuffix = "تومان") => {
  if (value === null || value === undefined) return "";
  const n = Number(value);
  // return `${new Intl.NumberFormat("fa-IR").format(n)} ${currencySuffix}`.trim();
  return `${new Intl.NumberFormat("fa-IR").format(n)}`.trim();
};

const faDigits = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
export const toFaDigits = (input) => {
  if (input === null || input === undefined) return "";
  return String(input).replace(/\d/g, (d) => faDigits[Number(d)]);
};

// تاریخ
export const formatDateFa = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });
};