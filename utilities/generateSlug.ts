import slugify from 'slugify'

export function generateSlug(title: string): string {
  const normalizedTitle = title
    .normalize('NFC')
    .replace(/[\u200c\u200d]/g, ' ')
    .trim()

  const containsPersian = /[\u0600-\u06FF]/.test(normalizedTitle)

  if (containsPersian) {
    return normalizedTitle
      .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  return slugify(normalizedTitle, {
    lower: true,
    strict: true,
    trim: true,
  })
}