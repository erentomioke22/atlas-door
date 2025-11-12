export function generateSlug(title: string, addRandom: boolean = true): string {
  let slug = title
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\-]/g, '') 
    .replace(/\-\-+/g, '-')      
    .replace(/^-+/, '')          
    .replace(/-+$/, '');   

  if (addRandom) {
    const randomString = Math.random().toString(36).substring(2, 8);
    slug += `-${randomString}`;
  }

  return slug;
}

export async function getUniqueSlug(
  originalSlug: string,
  checkUnique: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = originalSlug;
  let counter = 1;

  while (await checkUnique(slug)) {
    slug = `${originalSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// import slugify from 'slugify';
// import { customAlphabet } from 'nanoid';

// const nanoid = customAlphabet('1234567890abcdef', 8);

// export function generateSlug(title: string, addRandom: boolean = true): string {
//   let slug = slugify(title, {
//     replacement: '-',
//     remove: /[*+~.()'"!:@]/g,
//     lower:false,
//     strict:false,
//     trim: true
//     // locale: 'fa',
//   });

//   slug = slug.replace(/[^a-zA-Z0-9\u0600-\u06FF\-]/g, '');


//   if (addRandom) {
//     const randomString = nanoid();
//     slug += `-${randomString}`;
//   }

//   return slug;
// }