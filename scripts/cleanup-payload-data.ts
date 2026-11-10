import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const APPLY = process.argv.includes('--apply')

function getRelationID(value: any): string | null {
  if (value === null || value === undefined) return null

  if (typeof value === 'object') {
    return value.id != null ? String(value.id) : null
  }

  return String(value)
}

function normalizeName(value: string): string {
  return String(value || '')
    .normalize('NFKC')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ۀ/g, 'ه')
    .replace(/ة/g, 'ه')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

async function main() {
  const payload = await getPayload({ config })

  console.log('\n================================')
  console.log('Payload data cleanup')
  console.log('================================')
  console.log('Mode:', APPLY ? 'APPLY' : 'DRY RUN')

  // ---------------------------------------
  // 1. Find admin user
  // ---------------------------------------

  const usersResult = await payload.find({
    collection: 'users',
    limit: 1000,
    pagination: false,
    depth: 0,
  })

  const users = usersResult.docs as any[]

  if (users.length === 0) {
    throw new Error('No users found. Cleanup stopped.')
  }

  let adminUser: any

  if (users.length === 1) {
    adminUser = users[0]
  } else {
    const admins = users.filter((user) => {
      const role = user.role
      const roles = user.roles

      return (
        role === 'admin' ||
        (Array.isArray(roles) && roles.includes('admin'))
      )
    })

    if (admins.length !== 1) {
      throw new Error(
        `Expected exactly one admin user, found ${admins.length}. Cleanup stopped.`,
      )
    }

    adminUser = admins[0]
  }

  console.log('\nAdmin user:')
  console.log('ID:', adminUser.id)
  console.log('Email:', adminUser.email)
  console.log('Name:', adminUser.name || adminUser.displayName || '-')

  // ---------------------------------------
  // 2. Fetch posts and tags
  // ---------------------------------------

  const [postsResult, tagsResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      limit: 10000,
      pagination: false,
      depth: 0,
    }),
    payload.find({
      collection: 'tags',
      limit: 10000,
      pagination: false,
      depth: 0,
    }),
  ])

  const posts = postsResult.docs as any[]
  const tags = tagsResult.docs as any[]

  console.log('\nCurrent data:')
  console.log('Posts:', posts.length)
  console.log('Tags:', tags.length)

  // ---------------------------------------
  // 3. Find duplicate tags
  // ---------------------------------------

  const groups = new Map<string, any[]>()

  for (const tag of tags) {
    const normalized = normalizeName(tag.name)

    if (!normalized) continue

    const group = groups.get(normalized) || []
    group.push(tag)
    groups.set(normalized, group)
  }

  const duplicateMap = new Map<string, string>()
  const duplicateTags: any[] = []

  for (const group of groups.values()) {
    if (group.length < 2) continue

    // Keep the oldest tag.
    group.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()

      return dateA - dateB
    })

    const canonical = group[0]

    for (const duplicate of group.slice(1)) {
      duplicateMap.set(
        String(duplicate.id),
        String(canonical.id),
      )

      duplicateTags.push(duplicate)
    }
  }

  console.log('\nDuplicate tags:', duplicateTags.length)

  for (const tag of duplicateTags) {
    console.log(
      `- ${tag.name} | duplicate ID: ${tag.id} | keeping ID: ${duplicateMap.get(String(tag.id))}`,
    )
  }

  // ---------------------------------------
  // 4. Find posts without author
  // ---------------------------------------

  const postsWithoutAuthor = posts.filter(
    (post) => !getRelationID(post.author),
  )

  console.log('\nPosts without author:', postsWithoutAuthor.length)

  // ---------------------------------------
  // 5. Prepare tag relations
  // ---------------------------------------

  const postUpdates: {
    post: any
    data: Record<string, any>
  }[] = []

  const usedTagIDs = new Set<string>()

  let changedTagRelations = 0

  for (const post of posts) {
    const oldTagIDs = Array.isArray(post.tags)
      ? post.tags
          .map(getRelationID)
          .filter((id): id is string => Boolean(id))
      : []

    const newTagIDs = [
      ...new Set(
        oldTagIDs.map(
          (id) => duplicateMap.get(id) || id,
        ),
      ),
    ]

    for (const id of newTagIDs) {
      usedTagIDs.add(id)
    }

    const changed =
      oldTagIDs.length !== newTagIDs.length ||
      oldTagIDs.some((id, index) => id !== newTagIDs[index])

    const data: Record<string, any> = {}

    if (!getRelationID(post.author)) {
      data.author = adminUser.id
    }

    if (changed) {
      data.tags = newTagIDs
      changedTagRelations++
    }

    if (Object.keys(data).length > 0) {
      postUpdates.push({ post, data })
    }
  }

  // ---------------------------------------
  // 6. Find unused tags
  // ---------------------------------------

  const unusedTags = tags.filter(
    (tag) =>
      !usedTagIDs.has(String(tag.id)) &&
      !duplicateMap.has(String(tag.id)),
  )

  console.log('\nUnused tags:', unusedTags.length)

  for (const tag of unusedTags) {
    console.log(`- ${tag.name} | ID: ${tag.id}`)
  }

  console.log('\nPlanned operations:')
  console.log('Assign authors:', postsWithoutAuthor.length)
  console.log('Update post tag relations:', changedTagRelations)
  console.log('Merge duplicate tags:', duplicateTags.length)
  console.log('Delete unused tags:', unusedTags.length)

  if (!APPLY) {
    console.log('\nDRY RUN completed. No data was changed.')
    console.log('Run with --apply to perform cleanup.')
    return
  }

  // ---------------------------------------
  // 7. Update posts
  // ---------------------------------------

  for (const item of postUpdates) {
    await payload.update({
      collection: 'posts',
      id: item.post.id,
      data: item.data,
    })

    console.log(`Updated post: ${item.post.title}`)
  }

  // ---------------------------------------
  // 8. Delete duplicate and unused tags
  // ---------------------------------------

  const tagsToDelete = [
    ...duplicateTags,
    ...unusedTags,
  ]

  for (const tag of tagsToDelete) {
    await payload.delete({
      collection: 'tags',
      id: tag.id,
    })

    console.log(`Deleted tag: ${tag.name} | ID: ${tag.id}`)
  }

  console.log('\n================================')
  console.log('Cleanup completed successfully.')
  console.log('================================')
}

main().catch((error) => {
  console.error('\nCleanup failed:')
  console.error(error)
  process.exit(1)
})
