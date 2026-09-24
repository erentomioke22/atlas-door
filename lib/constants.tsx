// lib/constants.ts

export const COLORS = [
  { name: 'black',   label: 'مشکی',    hexCode: '#000000' },
  { name: 'white',   label: 'سفید',    hexCode: '#FFFFFF' },
  { name: 'oak',     label: 'بلوط',    hexCode: '#C8A165' },
  { name: 'walnut',  label: 'گردو',    hexCode: '#5D3A1A' },
  { name: 'grey',    label: 'خاکستری', hexCode: '#808080' },
  { name: 'natural', label: 'طبیعی',   hexCode: '#D4B896' },
  // ✅ اضافه کردن رنگ‌های بیشتر
  { name: 'silver',  label: 'نقره‌ای', hexCode: '#C0C0C0' },
  { name: 'gold',    label: 'طلایی',   hexCode: '#FFD700' },
  { name: 'bronze',  label: 'برنزی',   hexCode: '#CD7F32' },
  { name: 'chrome',  label: 'کروم',    hexCode: '#D3D3D3' },
  { name: 'steel',   label: 'استیل',   hexCode: '#B0B0B0' },
  { name: 'brown',   label: 'قهوه‌ای', hexCode: '#8B4513' },
  { name: 'blue',    label: 'آبی',     hexCode: '#0000FF' },
  { name: 'red',     label: 'قرمز',    hexCode: '#FF0000' },
  { name: 'green',   label: 'سبز',     hexCode: '#008000' },
  { name: 'yellow',  label: 'زرد',     hexCode: '#FFFF00' },
  { name: 'orange',  label: 'نارنجی',  hexCode: '#FFA500' },
  { name: 'purple',  label: 'بنفش',    hexCode: '#800080' },
  { name: 'pink',    label: 'صورتی',   hexCode: '#FFC0CB' },
] as const;

export const MATERIALS = [
  { value: 'wood',    label: 'چوب' },
  { value: 'metal',   label: 'فلز' },
  { value: 'fabric',  label: 'پارچه' },
  { value: 'leather', label: 'چرم' },
  { value: 'glass',   label: 'شیشه' },
] as const;

// ====== Sanity Lists ======
// ✅ حالا value میشه name (مثلاً "black") نه hexCode
export const COLORS_SANITY_LIST = COLORS.map(({ name, label }) => ({
  title: label,   // نمایش به فارسی توی Sanity
  value: name,    // ذخیره به انگلیسی (مثلاً "black")
}));

export const MATERIALS_SANITY_LIST = MATERIALS.map(({ value, label }) => ({
  title: label,
  value,
}));

// ====== Helper Functions ======
// ✅ تابع برای تبدیل name به hexCode
export function getColorHex(colorName: string): string {
  const color = COLORS.find(
    (c) => c.name.toLowerCase() === colorName?.toLowerCase()
  );
  return color?.hexCode || '#CCCCCC';
}

// ✅ تابع برای تبدیل name به label فارسی
export function getColorLabel(colorName: string): string {
  const color = COLORS.find(
    (c) => c.name.toLowerCase() === colorName?.toLowerCase()
  );
  return color?.label || colorName;
}

  
