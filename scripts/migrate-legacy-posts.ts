
// /**
//  * One-time migration: Prisma/Tiptap CSV exports -> Payload/Lexical.
//  *
//  * Run from the Payload project root.
//  *
//  * Required fields:
//  * - Posts: legacyId
//  * - Tags: legacyId
//  * - Media: legacyUrl
//  *
//  * Commands:
//  * npx tsx scripts/migrate-legacy-posts.ts
//  * npx tsx scripts/migrate-legacy-posts.ts --apply --limit=1
//  * npx tsx scripts/migrate-legacy-posts.ts --apply
//  */

// import fs from 'node:fs'
// import path from 'node:path'
// import { basename, extname, sep } from 'node:path'
// import { parse } from 'csv-parse/sync'
// import { JSDOM } from 'jsdom'
// import 'dotenv/config'
// import { Posts } from '@/collections/Posts'
// import { getPayload } from 'payload'
// import {
//   convertHTMLToLexical,
//   editorConfigFactory,
// } from '@payloadcms/richtext-lexical'

// import config from '@payload-config'
// import { generateSlug } from '@/utilities/generateSlug'

// // ======================================================
// // Configuration
// // ======================================================

// const APPLY = process.argv.includes('--apply')

// const LIMIT_ARG = process.argv.find((arg) =>
//   arg.startsWith('--limit='),
// )

// const LIMIT = LIMIT_ARG
//   ? Number(LIMIT_ARG.split('=')[1])
//   : Infinity

// if (
//   LIMIT_ARG &&
//   (!Number.isInteger(LIMIT) || LIMIT < 1)
// ) {
//   throw new Error('Invalid --limit value. Example: --limit=1')
// }

// const DATA_DIR = path.resolve(process.cwd(), 'migration-data')

// const POSTS_CSV = path.join(DATA_DIR, 'posts_rows.csv')
// const TAGS_CSV = path.join(DATA_DIR, 'tags_rows.csv')
// const POST_TAG_CSV = path.join(DATA_DIR, '_PostToTag_rows.csv')

// const databaseUrl = process.env.DATABASE_URL

// console.log('DATABASE_URL configured:', Boolean(databaseUrl))

// if (databaseUrl) {
//   try {
//     const parsedURL = new URL(databaseUrl)

//     console.log('Database host:', parsedURL.hostname)
//     console.log('Database port:', parsedURL.port || 'default')
//   } catch {
//     throw new Error('DATABASE_URL is not a valid URL.')
//   }
// }

// // Cache old URL -> Payload media ID during this run.
// const mediaIdByURL = new Map<string, string | number>()

// // ======================================================
// // Types
// // ======================================================

// type PayloadClient = Awaited<ReturnType<typeof getPayload>>

// type ImageMetadata = {
//   caption: string
//   size: string
// }

// // ======================================================
// // CSV helpers
// // ======================================================

// function readCSV<T = Record<string, string>>(
//   filePath: string,
// ): T[] {
//   if (!fs.existsSync(filePath)) {
//     throw new Error(`CSV file not found: ${filePath}`)
//   }

//   return parse(fs.readFileSync(filePath, 'utf8'), {
//     columns: true,
//     skip_empty_lines: true,
//     bom: true,
//     relax_quotes: true,
//   }) as T[]
// }

// function asString(value: unknown): string {
//   return value == null ? '' : String(value).trim()
// }

// function parseJSONList(value: unknown): string[] {
//   if (Array.isArray(value)) {
//     return value.map(asString).filter(Boolean)
//   }

//   const text = asString(value)

//   if (!text) return []

//   try {
//     const parsed = JSON.parse(text)

//     return Array.isArray(parsed)
//       ? parsed.map(asString).filter(Boolean)
//       : []
//   } catch {
//     console.warn(
//       `Could not parse images JSON: ${text.slice(0, 100)}`,
//     )

//     return []
//   }
// }

// function parseDate(value: unknown): string | undefined {
//   const text = asString(value)

//   if (!text) return undefined

//   const date = new Date(text)

//   return Number.isNaN(date.getTime())
//     ? undefined
//     : date.toISOString()
// }

// function parseBoolean(
//   value: unknown,
//   fallback = true,
// ): boolean {
//   const text = asString(value).toLowerCase()

//   if (!text) return fallback

//   if (['true', '1', 'yes'].includes(text)) return true

//   if (['false', '0', 'no'].includes(text)) return false

//   return fallback
// }

// // ======================================================
// // URL helpers
// // ======================================================

// function normalizeURL(rawURL: string): string {
//   const value = rawURL.trim()

//   if (!value) {
//     throw new Error('Found an empty image URL')
//   }

//   if (value.startsWith('//')) {
//     return `https:${value}`
//   }

//   if (value.startsWith('/')) {
//     return new URL(
//       value,
//       'https://atlasdoors.ir',
//     ).toString()
//   }

//   return value
// }

// function safeLocalPublicPath(
//   imageURL: string,
// ): string | null {
//   const url = new URL(imageURL)

//   const hostname = url.hostname
//     .toLowerCase()
//     .replace(/^www\./, '')

//   if (hostname !== 'atlasdoors.ir') {
//     return null
//   }

//   const relativePath = decodeURIComponent(
//     url.pathname,
//   ).replace(/^\/+/, '')

//   const publicRoot = path.resolve(
//     process.cwd(),
//     'public',
//   )

//   const filePath = path.resolve(
//     publicRoot,
//     relativePath,
//   )

//   if (
//     filePath !== publicRoot &&
//     !filePath.startsWith(publicRoot + sep)
//   ) {
//     throw new Error(
//       `Unsafe local image path: ${imageURL}`,
//     )
//   }

//   return filePath
// }

// function mimeFromName(filename: string): string {
//   switch (extname(filename).toLowerCase()) {
//     case '.jpg':
//     case '.jpeg':
//       return 'image/jpeg'

//     case '.png':
//       return 'image/png'

//     case '.webp':
//       return 'image/webp'

//     case '.gif':
//       return 'image/gif'

//     case '.svg':
//       return 'image/svg+xml'

//     case '.avif':
//       return 'image/avif'

//     case '.bmp':
//       return 'image/bmp'

//     default:
//       return 'application/octet-stream'
//   }
// }

// function safeFilename(url: string): string {
//   const parsed = new URL(url)

//   let name =
//     basename(decodeURIComponent(parsed.pathname)) ||
//     'migrated-image.jpg'

//   name = name
//     .replace(/[^\p{L}\p{N}._-]+/gu, '-')
//     .replace(/^-+|-+$/g, '')

//   if (!name || !extname(name)) {
//     name = `${name || 'migrated-image'}.jpg`
//   }

//   return name.slice(0, 180)
// }

// // ======================================================
// // Image helpers
// // ======================================================

// function getImageSize(
//   img: Element,
//   figure: Element | null,
// ): string {
//   const raw =
//     img.getAttribute('data-width') ||
//     img.getAttribute('width') ||
//     figure?.getAttribute('width') ||
//     '100%'

//   const numeric =
//     String(raw).match(/\d+/)?.[0] || '100'

//   return ['25', '50', '75', '100'].includes(numeric)
//     ? numeric
//     : '100'
// }

// async function findByLegacyURL(
//   payload: PayloadClient,
//   url: string,
// ) {
//   const found = await payload.find({
//     collection: 'media',
//     where: {
//       legacyUrl: {
//         equals: url,
//       },
//     },
//     limit: 1,
//     depth: 0,
//     overrideAccess: true,
//   })

//   return found.docs[0] as any
// }

// async function ensureMedia(
//   payload: PayloadClient,
//   rawURL: string,
//   alt = '',
//   caption = '',
// ) {
//   const url = normalizeURL(rawURL)

//   // 1. Check in-memory cache.
//   const cached = mediaIdByURL.get(url)

//   if (cached != null) {
//     return {
//       id: cached,
//       url,
//     }
//   }

//   // 2. Check existing Payload media.
//   const existing = await findByLegacyURL(
//     payload,
//     url,
//   )

//   if (existing) {
//     mediaIdByURL.set(url, existing.id)

//     console.log(
//       `  reused existing media: ${url} -> ${existing.id}`,
//     )

//     return {
//       id: existing.id,
//       url,
//     }
//   }

//   // 3. Create new media only when not found.
//   const localPath = safeLocalPublicPath(url)

//   let created: any

//   if (localPath) {
//     if (!fs.existsSync(localPath)) {
//       throw new Error(
//         `Local image is missing from public/: ${localPath} (source URL: ${url})`,
//       )
//     }

//     created = await payload.create({
//       collection: 'media',
//       data: {
//         alt: alt || '',
//         caption: caption || '',
//         legacyUrl: url,
//       },
//       filePath: localPath,
//       overrideAccess: true,
//     })
//   } else {
//     const response = await fetch(url, {
//       redirect: 'follow',
//     })

//     if (!response.ok) {
//       throw new Error(
//         `Could not download image (${response.status} ${response.statusText}): ${url}`,
//       )
//     }

//     const buffer = Buffer.from(
//       await response.arrayBuffer(),
//     )

//     const filename = safeFilename(url)

//     const contentType =
//       response.headers
//         .get('content-type')
//         ?.split(';')[0]
//         ?.trim() || mimeFromName(filename)

//     if (!contentType.startsWith('image/')) {
//       throw new Error(
//         `URL did not return an image (${contentType}): ${url}`,
//       )
//     }

//     created = await payload.create({
//       collection: 'media',
//       data: {
//         alt: alt || '',
//         caption: caption || '',
//         legacyUrl: url,
//       },
//       file: {
//         data: buffer,
//         mimetype: contentType,
//         name: filename,
//         size: buffer.length,
//       },
//       overrideAccess: true,
//     })
//   }

//   mediaIdByURL.set(url, created.id)

//   console.log(
//     `  created media: ${url} -> Payload ID ${created.id}`,
//   )

//   return {
//     id: created.id,
//     url,
//   }
// }

// // ======================================================
// // Tag helpers
// // ======================================================

// async function createOrFindTag(
//   payload: PayloadClient,
//   oldTag: any,
// ) {
//   const oldID = asString(oldTag.id)

//   // 1. Find by legacy ID.
//   const byLegacy = await payload.find({
//     collection: 'tags',
//     where: {
//       legacyId: {
//         equals: oldID,
//       },
//     },
//     limit: 1,
//     depth: 0,
//     overrideAccess: true,
//   })

//   if (byLegacy.docs[0]) {
//     return byLegacy.docs[0] as any
//   }

//   const name = asString(oldTag.name)

//   if (!name) {
//     throw new Error(
//       `Legacy tag ${oldID} has no name.`,
//     )
//   }

//   const baseSlug =
//     asString(generateSlug(name)) || `tag-${oldID}`

//   let slug = baseSlug
//   let suffix = 2

//   // 2. Find by slug.
//   while (true) {
//     const bySlug = await payload.find({
//       collection: 'tags',
//       where: {
//         slug: {
//           equals: slug,
//         },
//       },
//       limit: 1,
//       depth: 0,
//       overrideAccess: true,
//     })

//     const existing: any = bySlug.docs[0]

//     if (!existing) break

//     // Same tag already exists: attach legacy ID.
//     if (asString(existing.name) === name) {
//       return (await payload.update({
//         collection: 'tags',
//         id: existing.id,
//         data: {
//           legacyId: oldID,
//           info:
//             asString(oldTag.info) ||
//             existing.info ||
//             '',
//         },
//         overrideAccess: true,
//       })) as any
//     }

//     slug = `${baseSlug}-${suffix++}`
//   }

//   // 3. Create only if it does not exist.
//   return (await payload.create({
//     collection: 'tags',
//     data: {
//       name,
//       slug,
//       info: asString(oldTag.info) || undefined,
//       legacyId: oldID,
//     },
//     overrideAccess: true,
//   })) as any
// }

// // ======================================================
// // Lexical helpers
// // ======================================================

// function setUploadNodeFields(
//   value: any,
//   metadataById: Map<string, ImageMetadata[]>,
// ): void {
//   if (!value || typeof value !== 'object') return

//   if (value.type === 'upload' && value.relationTo === 'media') {
//     // استخراج شناسه رسانه
//     const rawID =
//       value.value && typeof value.value === 'object'
//         ? value.value.id
//         : value.value

//     if (rawID == null || rawID === '') {
//       throw new Error(
//         `Upload node has an empty ID: ${JSON.stringify(value)}`,
//       )
//     }

//     // PostgreSQL IDs در پروژه تو عددی هستند.
//     const idString = String(rawID)

//     const normalizedID = /^\d+$/.test(idString)
//       ? Number(idString)
//       : idString

//     // مقدار value باید شناسه باشد، نه آبجکت کامل رسانه
//     value.value = normalizedID

//     // تنظیم فیلدهای سفارشی تصویر
//     const queue = metadataById.get(idString)
//     const meta = queue?.shift()

//     if (meta) {
//       value.fields = {
//         ...(value.fields && typeof value.fields === 'object'
//           ? value.fields
//           : {}),
//         caption: meta.caption,
//         size: meta.size,
//       }
//     }

//     console.log('Normalized upload node:', {
//       relationTo: value.relationTo,
//       value: value.value,
//       valueType: typeof value.value,
//     })
//   }

//   for (const child of Object.values(value)) {
//     if (child && typeof child === 'object') {
//       if (Array.isArray(child)) {
//         child.forEach((item) =>
//           setUploadNodeFields(item, metadataById),
//         )
//       } else {
//         setUploadNodeFields(child, metadataById)
//       }
//     }
//   }
// }

// async function convertPostHTML(
//   payload: PayloadClient,
//   html: string,
//   editorConfig: any,
// ) {
//   const dom = new JSDOM(
//     `<body>${html || ''}</body>`,
//   )

//   const document = dom.window.document

//   const metadataById = new Map<
//     string,
//     ImageMetadata[]
//   >()

//   const images = Array.from(
//     document.querySelectorAll('img'),
//   )

//   console.log(`  HTML images found: ${images.length}`)

//   for (const img of images) {
//     const rawSrc = img.getAttribute('src')

//     if (!rawSrc) {
//       console.warn('  skipped image without src')
//       continue
//     }

//     const url = normalizeURL(rawSrc)

//     const figure = img.closest('figure')

//     const caption =
//       figure
//         ?.querySelector('figcaption')
//         ?.textContent?.trim() || ''

//     const alt =
//       img.getAttribute('alt') ||
//       figure?.getAttribute('alt') ||
//       caption ||
//       ''

//     const size = getImageSize(img, figure)

//     const media = await ensureMedia(
//       payload,
//       url,
//       alt,
//       caption,
//     )

//     const idKey = String(media.id)

//     const queue =
//       metadataById.get(idKey) || []

//     queue.push({
//       caption,
//       size,
//     })

//     metadataById.set(idKey, queue)

//     img.setAttribute('src', url)

//     img.setAttribute(
//       'data-lexical-upload-id',
//       String(media.id),
//     )

//     img.setAttribute(
//       'data-lexical-upload-relation-to',
//       'media',
//     )

//     if (alt) {
//       img.setAttribute('alt', alt)
//     }

//     // Replace old Tiptap figure wrapper.
//     // Caption and size will be restored on the Lexical upload node.
//     if (figure && figure.contains(img)) {
//       figure.replaceWith(img)
//     }
//   }

//   const htmlWithPayloadImages =
//     document.body.innerHTML

//   const lexical = convertHTMLToLexical({
//     editorConfig,
//     html: htmlWithPayloadImages,
//     JSDOM,
//   }) as any

//   setUploadNodeFields(
//     lexical,
//     metadataById,
//   )

//   // Basic structure check before sending content to Payload.
//   if (
//     !lexical ||
//     typeof lexical !== 'object' ||
//     !lexical.root ||
//     lexical.root.type !== 'root' ||
//     !Array.isArray(lexical.root.children)
//   ) {
//     throw new Error(
//       'HTML to Lexical conversion returned an invalid root structure.',
//     )
//   }

//   console.log(
//     `  Lexical conversion successful. Root children: ${lexical.root.children.length}`,
//   )

//   return lexical
// }

// // ======================================================
// // Main migration
// // ======================================================

// async function main() {
//   if (!APPLY) {
//     console.log('\nNo data was changed.')
//     console.log(
//       'Use --apply to perform the migration.',
//     )
//     console.log(
//       'Use --apply --limit=1 to migrate one article.',
//     )

//     console.log(
//       `\nExpected files:\n- ${POSTS_CSV}\n- ${TAGS_CSV}\n- ${POST_TAG_CSV}`,
//     )

//     return
//   }

//   if (!databaseUrl) {
//     throw new Error(
//       'DATABASE_URL is missing from environment variables.',
//     )
//   }

//   const posts = readCSV<any>(POSTS_CSV)
//   const tags = readCSV<any>(TAGS_CSV)
//   const postTagRows = readCSV<any>(POST_TAG_CSV)

//   console.log(
//     `\nLoaded ${posts.length} posts, ${tags.length} tags and ${postTagRows.length} post-tag relations.`,
//   )

//   console.log(
//     `Migration limit: ${LIMIT === Infinity ? 'ALL' : LIMIT}`,
//   )

//   let payload: PayloadClient | undefined

//   let createdPosts = 0
//   let skippedPosts = 0
//   let attemptedPosts = 0

//   try {
//     payload = await getPayload({
//       config,
//     })


//     // --------------------------------------------------
//     // Get the actual Posts content editor configuration
//     // --------------------------------------------------

//     const contentField = Posts.fields.find(
//       (field: any) => field.name === 'content',
//     )
    
//     if (!contentField || contentField.type !== 'richText') {
//       console.log(
//         'Posts fields:',
//         Posts.fields.map((field: any) => ({
//           name: field.name,
//           type: field.type,
//         })),
//       )
    
//       throw new Error(
//         'Content richText field was not found in Posts collection.',
//       )
//     }
    
//     const editorConfig = editorConfigFactory.fromField({
//       field: contentField as any,
//     })
    
//     console.log('Posts Lexical editor configuration loaded successfully.')


//     // --------------------------------------------------
//     // Tags
//     // --------------------------------------------------

//     const tagIDMap = new Map<
//       string,
//       string | number
//     >()

//     for (const oldTag of tags) {
//       const tag = await createOrFindTag(
//         payload,
//         oldTag,
//       )

//       tagIDMap.set(
//         asString(oldTag.id),
//         tag.id,
//       )
//     }

//     console.log(
//       `\nMapped ${tagIDMap.size} legacy tags.`,
//     )

//     // --------------------------------------------------
//     // Post-tag relations
//     // --------------------------------------------------

//     const tagIDsByPost = new Map<
//       string,
//       Array<string | number>
//     >()

//     for (const relation of postTagRows) {
//       const postID = asString(relation.A)
//       const oldTagID = asString(relation.B)

//       const newTagID = tagIDMap.get(oldTagID)

//       if (newTagID == null) {
//         console.warn(
//           `Tag relation skipped: unknown legacy tag ${oldTagID} for post ${postID}`,
//         )
//         continue
//       }

//       const ids =
//         tagIDsByPost.get(postID) || []

//       if (
//         !ids.some(
//           (id) =>
//             String(id) === String(newTagID),
//         )
//       ) {
//         ids.push(newTagID)
//       }

//       tagIDsByPost.set(postID, ids)
//     }

//     // --------------------------------------------------
//     // Posts
//     // --------------------------------------------------

//     for (const oldPost of posts) {
//       const oldID = asString(oldPost.id)
//       const title = asString(oldPost.title)

//       // Skip already migrated articles.
//       const existing = await payload.find({
//         collection: 'posts',
//         where: {
//           legacyId: {
//             equals: oldID,
//           },
//         },
//         limit: 1,
//         depth: 0,
//         overrideAccess: true,
//       })

//       if (existing.docs[0]) {
//         console.log(
//           `\nSkipped existing post: ${title} (${oldID})`,
//         )

//         skippedPosts++
//         continue
//       }

//       // Stop after the requested number of new articles.
//       if (attemptedPosts >= LIMIT) {
//         break
//       }

//       attemptedPosts++

//       console.log(
//         `\n========================================`,
//       )

//       console.log(
//         `Post ${attemptedPosts}: ${title} (${oldID})`,
//       )

//       if (!title) {
//         throw new Error(
//           `Post ${oldID} has an empty title.`,
//         )
//       }

//       const slug = asString(oldPost.slug)

//       if (!slug) {
//         throw new Error(
//           `Post ${oldID} has no slug. Stopping to preserve old URLs.`,
//         )
//       }

//       // ------------------------------------------------
//       // Images array
//       // ------------------------------------------------

//       const imageURLs = parseJSONList(
//         oldPost.images,
//       ).map(normalizeURL)

//       const mediaIDsForArray: Array<
//         string | number
//       > = []

//       for (const imageURL of imageURLs) {
//         const media = await ensureMedia(
//           payload,
//           imageURL,
//         )

//         mediaIDsForArray.push(media.id)
//       }

//       // ------------------------------------------------
//       // HTML -> Lexical
//       // ------------------------------------------------

//       const lexicalContent = await convertPostHTML(
//         payload,
//         asString(oldPost.content),
//         editorConfig,
//       )

//       console.log(
//         '\nLexical content preview:',
//       )

//       console.log(
//         JSON.stringify(
//           lexicalContent,
//           null,
//           2,
//         ).slice(0, 5000),
//       )

//       // ------------------------------------------------
//       // Post data
//       // ------------------------------------------------

//       const data: Record<string, any> = {
//         legacyId: oldID,
//         title,
//         desc:
//           asString(oldPost.desc) || undefined,

//         // Preserve old slug exactly.
//         slug,

//         content: lexicalContent,

//         discussions: parseBoolean(
//           oldPost.discussions,
//           true,
//         ),

//         tags:
//           tagIDsByPost.get(oldID) || [],

//         // Old export uses createdAt.
//         publishedAt: parseDate(
//           oldPost.createdAt,
//         ),
//       }

//       // First old image becomes mainImage.
//       // It remains in the rich-text content too.
//       if (mediaIDsForArray.length > 0) {
//         data.mainImage =
//           mediaIDsForArray[0]
//       }

//       console.log(
//         '\nSaving post to Payload...',
//       )


//       let created: any

//       try {
//         created = await payload.create({
//           collection: 'posts',
//           data,
//           overrideAccess: true,
//         })
//       } catch (error: any) {
//         console.error('\n========== PAYLOAD VALIDATION ERROR ==========')
      
//         console.dir(
//           {
//             name: error?.name,
//             message: error?.message,
//             data: error?.data,
//             errors: error?.errors,
//             cause: error?.cause,
//           },
//           {
//             depth: 20,
//             colors: true,
//           },
//         )
      
//         console.error('==============================================')
      
//         throw error
//       }
      

//       console.log(
//         `\nSUCCESS: Post created.`,
//       )

//       console.log('Payload ID:', created.id)
//       console.log('Title:', title)
//       console.log('Slug:', slug)
//       console.log('Tags:', data.tags.length)
//       console.log('Images in array:', imageURLs.length)

//       createdPosts++
//     }

//     // --------------------------------------------------
//     // Summary
//     // --------------------------------------------------

//     console.log(
//       '\n========================================',
//     )

//     console.log('Migration finished.')

//     console.log(`Posts attempted: ${attemptedPosts}`)
//     console.log(`Posts created: ${createdPosts}`)
//     console.log(`Posts skipped: ${skippedPosts}`)

//     console.log(`Tags mapped: ${tagIDMap.size}`)

//     console.log(
//       `Unique image URLs processed: ${mediaIdByURL.size}`,
//     )

//     console.log(
//       '\nOld author/userId was intentionally not migrated because user IDs belong to the old database.',
//     )

//     console.log(
//       'Old status/isHot/expiresAt were intentionally ignored.',
//     )
//   } finally {
//     if (payload) {
//       console.log(
//         '\nClosing Payload connection...',
//       )

//       await payload.destroy()
//     }
//   }
// }

// // ======================================================
// // Execute
// // ======================================================

// main().catch((error) => {
//   console.error(
//     '\n========================================',
//   )

//   console.error('MIGRATION FAILED')

//   console.error(
//     error instanceof Error
//       ? error.stack || error.message
//       : error,
//   )

//   process.exitCode = 1
// })



/**
 * One-time migration: Prisma/Tiptap CSV exports -> Payload/Lexical.
 *
 * Images are intentionally NOT migrated.
 *
 * Run from the Payload project root.
 *
 * Required fields:
 * - Posts: legacyId
 * - Tags: legacyId
 *
 * Commands:
 * npx tsx scripts/migrate-legacy-posts.ts
 * npx tsx scripts/migrate-legacy-posts.ts --apply --limit=1
 * npx tsx scripts/migrate-legacy-posts.ts --apply
 */

import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'csv-parse/sync'
import { JSDOM } from 'jsdom'
import 'dotenv/config'

import { Posts } from '@/collections/Posts'
import { getPayload } from 'payload'
import {
  convertHTMLToLexical,
  editorConfigFactory,
} from '@payloadcms/richtext-lexical'

import config from '@payload-config'
import { generateSlug } from '@/utilities/generateSlug'

// ======================================================
// Configuration
// ======================================================

const APPLY = process.argv.includes('--apply')

const LIMIT_ARG = process.argv.find((arg) =>
  arg.startsWith('--limit='),
)

const LIMIT = LIMIT_ARG
  ? Number(LIMIT_ARG.split('=')[1])
  : Infinity

if (
  LIMIT_ARG &&
  (!Number.isInteger(LIMIT) || LIMIT < 1)
) {
  throw new Error('Invalid --limit value. Example: --limit=1')
}

const DATA_DIR = path.resolve(process.cwd(), 'migration-data')

const POSTS_CSV = path.join(DATA_DIR, 'posts_rows.csv')
const TAGS_CSV = path.join(DATA_DIR, 'tags_rows.csv')
const POST_TAG_CSV = path.join(DATA_DIR, '_PostToTag_rows.csv')

const databaseUrl = process.env.DATABASE_URL

console.log('DATABASE_URL configured:', Boolean(databaseUrl))

if (databaseUrl) {
  try {
    const parsedURL = new URL(databaseUrl)

    console.log('Database host:', parsedURL.hostname)
    console.log('Database port:', parsedURL.port || 'default')
  } catch {
    throw new Error('DATABASE_URL is not a valid URL.')
  }
}

// ======================================================
// Types
// ======================================================

type PayloadClient = Awaited<ReturnType<typeof getPayload>>

// ======================================================
// CSV helpers
// ======================================================

function readCSV<T = Record<string, string>>(
  filePath: string,
): T[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`)
  }

  return parse(fs.readFileSync(filePath, 'utf8'), {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_quotes: true,
  }) as T[]
}

function asString(value: unknown): string {
  return value == null ? '' : String(value).trim()
}

function parseDate(value: unknown): string | undefined {
  const text = asString(value)

  if (!text) return undefined

  const date = new Date(text)

  return Number.isNaN(date.getTime())
    ? undefined
    : date.toISOString()
}

function parseBoolean(
  value: unknown,
  fallback = true,
): boolean {
  const text = asString(value).toLowerCase()

  if (!text) return fallback

  if (['true', '1', 'yes'].includes(text)) return true

  if (['false', '0', 'no'].includes(text)) return false

  return fallback
}

// ======================================================
// Tag helpers
// ======================================================

async function createOrFindTag(
  payload: PayloadClient,
  oldTag: any,
) {
  const oldID = asString(oldTag.id)

  // 1. Find by legacy ID.
  const byLegacy = await payload.find({
    collection: 'tags',
    where: {
      legacyId: {
        equals: oldID,
      },
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (byLegacy.docs[0]) {
    return byLegacy.docs[0] as any
  }

  const name = asString(oldTag.name)

  if (!name) {
    throw new Error(
      `Legacy tag ${oldID} has no name.`,
    )
  }

  const baseSlug =
    asString(generateSlug(name)) || `tag-${oldID}`

  let slug = baseSlug
  let suffix = 2

  // 2. Find by slug.
  while (true) {
    const bySlug = await payload.find({
      collection: 'tags',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    const existing: any = bySlug.docs[0]

    if (!existing) break

    // Same tag already exists: attach legacy ID.
    if (asString(existing.name) === name) {
      return (await payload.update({
        collection: 'tags',
        id: existing.id,
        data: {
          legacyId: oldID,
          info:
            asString(oldTag.info) ||
            existing.info ||
            '',
        },
        overrideAccess: true,
      })) as any
    }

    slug = `${baseSlug}-${suffix++}`
  }

  // 3. Create only if it does not exist.
  return (await payload.create({
    collection: 'tags',
    data: {
      name,
      slug,
      info: asString(oldTag.info) || undefined,
      legacyId: oldID,
    },
    overrideAccess: true,
  })) as any
}

// ======================================================
// HTML -> Lexical
// Images are removed before conversion.
// No media lookup, download or upload is performed.
// ======================================================

async function convertPostHTML(
  html: string,
  editorConfig: any,
) {
  const dom = new JSDOM(
    `<body>${html || ''}</body>`,
  )

  const document = dom.window.document

  // Count images only for logging.
  const imageCount = document.querySelectorAll(
    'img, picture, source',
  ).length

  console.log(
    `  Images found in HTML: ${imageCount} (will be removed)`,
  )

  // --------------------------------------------------
  // Remove figure wrappers containing images.
  // Preserve their textual captions when available.
  // --------------------------------------------------

  const figures = Array.from(
    document.querySelectorAll('figure'),
  )

  for (const figure of figures) {
    const containsImage = figure.querySelector(
      'img, picture, source',
    )

    if (containsImage) {
      const caption = figure
        .querySelector('figcaption')
        ?.textContent
        ?.trim()

      if (caption) {
        const paragraph = document.createElement('p')
        paragraph.textContent = caption
        figure.replaceWith(paragraph)
      } else {
        figure.remove()
      }
    } else {
      // Preserve the contents of non-image figures.
      figure.replaceWith(
        ...Array.from(figure.childNodes),
      )
    }
  }

  // --------------------------------------------------
  // Remove all remaining image elements.
  // --------------------------------------------------

  document
    .querySelectorAll('img, picture, source')
    .forEach((element) => element.remove())

  // Remove empty links left behind by deleted images.
  document.querySelectorAll('a').forEach((anchor) => {
    const hasText = Boolean(anchor.textContent?.trim())
    const hasElement = anchor.querySelector('*')

    if (!hasText && !hasElement) {
      anchor.remove()
    }
  })

  // --------------------------------------------------
  // Convert clean HTML to Lexical.
  // --------------------------------------------------

  const cleanHTML = document.body.innerHTML

  const lexical = convertHTMLToLexical({
    editorConfig,
    html: cleanHTML,
    JSDOM,
  }) as any

  // --------------------------------------------------
  // Validate Lexical root.
  // --------------------------------------------------

  if (
    !lexical ||
    typeof lexical !== 'object' ||
    !lexical.root ||
    lexical.root.type !== 'root' ||
    !Array.isArray(lexical.root.children)
  ) {
    throw new Error(
      'HTML to Lexical conversion returned an invalid root structure.',
    )
  }

  // Make sure no upload nodes remain.
  function countUploadNodes(value: any): number {
    if (!value || typeof value !== 'object') {
      return 0
    }

    let count = 0

    if (value.type === 'upload') {
      count++
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') {
        if (Array.isArray(child)) {
          for (const item of child) {
            count += countUploadNodes(item)
          }
        } else {
          count += countUploadNodes(child)
        }
      }
    }

    return count
  }

  const uploadNodes = countUploadNodes(lexical)

  if (uploadNodes > 0) {
    throw new Error(
      `Image removal failed: ${uploadNodes} upload node(s) remain in Lexical content.`,
    )
  }

  console.log(
    `  Lexical conversion successful. Root children: ${lexical.root.children.length}`,
  )

  console.log(
    '  Image upload nodes: 0',
  )

  return lexical
}

// ======================================================
// Main migration
// ======================================================

async function main() {
  if (!APPLY) {
    console.log('\nNo data was changed.')
    console.log(
      'Use --apply to perform the migration.',
    )
    console.log(
      'Use --apply --limit=1 to migrate one article.',
    )

    console.log(
      `\nExpected files:\n- ${POSTS_CSV}\n- ${TAGS_CSV}\n- ${POST_TAG_CSV}`,
    )

    return
  }

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is missing from environment variables.',
    )
  }

  const posts = readCSV<any>(POSTS_CSV)
  const tags = readCSV<any>(TAGS_CSV)
  const postTagRows = readCSV<any>(POST_TAG_CSV)

  console.log(
    `\nLoaded ${posts.length} posts, ${tags.length} tags and ${postTagRows.length} post-tag relations.`,
  )

  console.log(
    `Migration limit: ${LIMIT === Infinity ? 'ALL' : LIMIT}`,
  )

  console.log(
    'Image migration: DISABLED',
  )

  let payload: PayloadClient | undefined

  let createdPosts = 0
  let skippedPosts = 0
  let attemptedPosts = 0

  try {
    payload = await getPayload({
      config,
    })

    // --------------------------------------------------
    // Get actual Posts content editor configuration.
    // --------------------------------------------------

    const contentField = Posts.fields.find(
      (field: any) => field.name === 'content',
    )

    if (
      !contentField ||
      contentField.type !== 'richText'
    ) {
      console.log(
        'Posts fields:',
        Posts.fields.map((field: any) => ({
          name: field.name,
          type: field.type,
        })),
      )

      throw new Error(
        'Content richText field was not found in Posts collection.',
      )
    }

    const editorConfig = editorConfigFactory.fromField({
      field: contentField as any,
    })

    console.log(
      'Posts Lexical editor configuration loaded successfully.',
    )

    // --------------------------------------------------
    // Tags
    // --------------------------------------------------

    const tagIDMap = new Map<
      string,
      string | number
    >()

    for (const oldTag of tags) {
      const tag = await createOrFindTag(
        payload,
        oldTag,
      )

      tagIDMap.set(
        asString(oldTag.id),
        tag.id,
      )
    }

    console.log(
      `\nMapped ${tagIDMap.size} legacy tags.`,
    )

    // --------------------------------------------------
    // Post-tag relations
    // --------------------------------------------------

    const tagIDsByPost = new Map<
      string,
      Array<string | number>
    >()

    for (const relation of postTagRows) {
      const postID = asString(relation.A)
      const oldTagID = asString(relation.B)

      const newTagID = tagIDMap.get(oldTagID)

      if (newTagID == null) {
        console.warn(
          `Tag relation skipped: unknown legacy tag ${oldTagID} for post ${postID}`,
        )
        continue
      }

      const ids =
        tagIDsByPost.get(postID) || []

      if (
        !ids.some(
          (id) =>
            String(id) === String(newTagID),
        )
      ) {
        ids.push(newTagID)
      }

      tagIDsByPost.set(postID, ids)
    }

    // --------------------------------------------------
    // Posts
    // --------------------------------------------------

    for (const oldPost of posts) {
      const oldID = asString(oldPost.id)
      const title = asString(oldPost.title)

      // Skip already migrated articles.
      const existing = await payload.find({
        collection: 'posts',
        where: {
          legacyId: {
            equals: oldID,
          },
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })

      if (existing.docs[0]) {
        console.log(
          `\nSkipped existing post: ${title} (${oldID})`,
        )

        skippedPosts++
        continue
      }

      // Stop after the requested number of new articles.
      if (attemptedPosts >= LIMIT) {
        break
      }

      attemptedPosts++

      console.log(
        '\n========================================',
      )

      console.log(
        `Post ${attemptedPosts}: ${title} (${oldID})`,
      )

      if (!title) {
        throw new Error(
          `Post ${oldID} has an empty title.`,
        )
      }

      const slug = asString(oldPost.slug)

      if (!slug) {
        throw new Error(
          `Post ${oldID} has no slug. Stopping to preserve old URLs.`,
        )
      }

      // ------------------------------------------------
      // HTML -> Lexical
      // Images are removed and never migrated.
      // ------------------------------------------------

      const lexicalContent = await convertPostHTML(
        asString(oldPost.content),
        editorConfig,
      )

      console.log(
        '\nLexical content preview:',
      )

      console.log(
        JSON.stringify(
          lexicalContent,
          null,
          2,
        ).slice(0, 5000),
      )

      // ------------------------------------------------
      // Post data
      // No mainImage or images field is included.
      // ------------------------------------------------

      const data: Record<string, any> = {
        legacyId: oldID,

        title,

        desc:
          asString(oldPost.desc) || undefined,

        // Preserve old slug exactly.
        slug,

        content: lexicalContent,

        discussions: parseBoolean(
          oldPost.discussions,
          true,
        ),

        tags:
          tagIDsByPost.get(oldID) || [],

        // Old export uses createdAt.
        publishedAt: parseDate(
          oldPost.createdAt,
        ),
      }

      console.log(
        '\nSaving post to Payload...',
      )

      let created: any

      try {
        created = await payload.create({
          collection: 'posts',
          data,
          overrideAccess: true,
        })
      } catch (error: any) {
        console.error(
          '\n========== PAYLOAD VALIDATION ERROR ==========',
        )

        console.dir(
          {
            name: error?.name,
            message: error?.message,
            data: error?.data,
            errors: error?.errors,
            cause: error?.cause,
          },
          {
            depth: 20,
            colors: true,
          },
        )

        console.error(
          '==============================================',
        )

        throw error
      }

      console.log(
        '\nSUCCESS: Post created.',
      )

      console.log('Payload ID:', created.id)
      console.log('Title:', title)
      console.log('Slug:', slug)
      console.log('Tags:', data.tags.length)
      console.log('Images migrated: 0')

      createdPosts++
    }

    // --------------------------------------------------
    // Summary
    // --------------------------------------------------

    console.log(
      '\n========================================',
    )

    console.log('Migration finished.')

    console.log(`Posts attempted: ${attemptedPosts}`)
    console.log(`Posts created: ${createdPosts}`)
    console.log(`Posts skipped: ${skippedPosts}`)

    console.log(`Tags mapped: ${tagIDMap.size}`)

    console.log(
      'Images migrated: 0',
    )

    console.log(
      '\nOld author/userId was intentionally not migrated because user IDs belong to the old database.',
    )

    console.log(
      'Old status/isHot/expiresAt were intentionally ignored.',
    )

    console.log(
      'Images and mainImage were intentionally not migrated.',
    )
  } finally {
    if (payload) {
      console.log(
        '\nClosing Payload connection...',
      )

      await payload.destroy()
    }
  }
}

// ======================================================
// Execute
// ======================================================

main().catch((error) => {
  console.error(
    '\n========================================',
  )

  console.error('MIGRATION FAILED')

  console.error(
    error instanceof Error
      ? error.stack || error.message
      : error,
  )

  process.exitCode = 1
})
