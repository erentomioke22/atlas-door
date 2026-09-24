// sanity/lib/queries.ts
import { defineQuery } from 'next-sanity';
import { groq } from 'next-sanity';

// ====== فیلدهای مشترک ======
export const POST_FIELDS = groq`
  _id,
  title,
  "slug": slug.current,
  desc,
  "mainImage": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  publishedAt,
  "author": author->{
    _id,
    name,
    "image": image.asset->url
  },
  "tags": tags[]->{
    _id,
    name,
    "slug": slug.current
  }
`;

export const PRODUCT_FIELDS = groq`
  _id,
  name,
  "slug": slug.current,
  desc,
  "images": images[].asset->url,
  "mainImage": images[0].asset->url,
  "category": category->{
    _id,
    title,
    "slug": slug.current
  },
  material,
  colors[] {
    _key,
    color,
    price,
    discount,
    stock
  },
  "seller": seller->{
    _id,
    name,
    "image": image.asset->url
  },
  dimensions,
  assemblyRequired,
  _createdAt,
  _updatedAt
`;
// ====== ۱. کوئری صفحه اصلی (۱۰ پست + ۶ محصول) ======
export const HOME_PAGE_QUERY = defineQuery(`
  {
    "posts": *[_type == "post"] | order(publishedAt desc)[0...10] {
      ${POST_FIELDS}
    },
    "products": *[_type == "product"] | order(_createdAt desc)[0...6] {
      ${PRODUCT_FIELDS}
    }
  }
`);

// ====== ۲. کوئری صفحه لیست پست‌ها با پیجینیشن و فیلتر ======
export const POSTS_LIST_QUERY = defineQuery(`
  *[_type == "post" 
    && defined(slug.current)
    && ($tag == "" || $tag in tags[]->slug.current)
  ] | order(publishedAt desc) [$start...$end] {
    ${POST_FIELDS}
  }
`);


export const POSTS_QUERY = defineQuery(`
  *[_type == "post" 
    && defined(slug.current)
    && ($tag == "" || $tag in tags[]->slug.current)
  ] | order(publishedAt desc) [0...$limit] {
    ${POST_FIELDS}
  }
`);

// ====== کوئری برای بارگذاری بیشتر (با offset) ======
export const POSTS_LOAD_MORE_QUERY = defineQuery(`
  *[_type == "post" 
    && defined(slug.current)
    && ($tag == "" || $tag in tags[]->slug.current)
  ] | order(publishedAt desc) [$start...$end] {
    ${POST_FIELDS}
  }
`);




// ====== ۳. تعداد کل پست‌ها (برای پیجینیشن) ======
export const POSTS_TOTAL_COUNT_QUERY = defineQuery(`
  count(*[_type == "post" 
    && defined(slug.current)
    && ($tag == "" || $tag in tags[]->slug.current)
  ])
`);

// ====== ۴. کوئری صفحه جزئیات پست ======
export const SINGLE_POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    ${POST_FIELDS},
    discussions,
    content[]{
      ...,
      _type == "image" => {
        "url": asset->url,
        "alt": alt,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height,
        "lqip": asset->metadata.lqip,
        "caption": caption
      },
      markDefs[]{
        ...,
        _type == "link" => {
          "href": href,
          "blank": blank
        }
      }
    },
    "relatedPosts": *[_type == "post" 
      && slug.current != $slug 
      && count(tags[@._ref in ^.tags[]._ref]) > 0
    ] | order(publishedAt desc)[0...6] {
      ${POST_FIELDS}
    },
    "readingTime": round(length(pt::text(content)) / 5 / 180)
  }
`);

// ====== ۵. کوئری تمام تگ‌ها ======
export const ALL_TAGS_QUERY = defineQuery(`
  *[_type == "tag" && count(*[_type == "post" && references(^._id)]) > 0] {
    _id,
    name,
    "slug": slug.current,
    "count": count(*[_type == "post" && references(^._id)])
  } | order(name asc)
`);

// ====== ۶. کوئری متا تگ‌های پست ======
export const POST_META_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    desc,
    "image": mainImage.asset->url,
    "imageAlt": mainImage.alt,
    publishedAt,
    _updatedAt,
    "authorName": author->name,
    "tags": tags[]->name
  }
`);



export const PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" 
    && defined(slug.current)
    && ($category == "" || category->slug.current == $category)
  ] | order(_createdAt desc) [$start...$end] {
    ${PRODUCT_FIELDS}
  }
`);

export const PRODUCTS_TOTAL_COUNT_QUERY = defineQuery(`
  count(*[_type == "product" 
    && defined(slug.current)
    && ($category == "" || category->slug.current == $category)
  ])
`);

export const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    "image": image.asset->url,
    "count": count(*[_type == "product" && references(^._id)])
  }
`);



export const SINGLE_PRODUCT_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    ${PRODUCT_FIELDS},
    content[]{
      ...,
      _type == "image" => {
        "url": asset->url,
        "alt": alt,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height,
        "lqip": asset->metadata.lqip,
        "caption": caption
      },
      markDefs[]{
        ...,
        _type == "link" => {
          "href": href,
          "blank": blank
        }
      }
    },
    "relatedProducts": *[_type == "product" 
      && slug.current != $slug 
      && category._ref == ^.category._ref
    ] | order(_createdAt desc)[0...6] {
      ${PRODUCT_FIELDS}
    }
  }
`);

export const RELATED_PRODUCTS_QUERY = groq`
  *[_type == "product" && status == "PUBLISHED" 
    && _id != $productId
    && category->slug.current == $categorySlug
  ] | order(publishedAt desc)[0...6] {
    _id,
    name,
    "slug": slug.current,
    desc,
    "mainImage": images[0].asset->url,
    "images": images[].asset->url,
    colors[] {
      _key,
      color,
      hexCode,
      price,
      discount,
      stock
    },
    publishedAt
  }
`;


export const PRODUCT_META_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    name,
    desc,
    "image": images[0].asset->url,
    "imageAlt": images[0].alt,
    _createdAt,
    _updatedAt,
    "categoryName": category->title,
    "categorySlug": category->slug.current,
    colors[] {
      price,
      discount,
      stock
    }
  }
`);



export const SEARCH_POSTS_QUERY = defineQuery(`
  *[_type == "post" 
    && defined(slug.current)
    && (
      title match $q + "*" ||
      desc match $q + "*" ||
      pt::text(content) match $q + "*" ||
      $q in tags[]->name
    )
  ] | order(publishedAt desc)[0...$limit] {
    _id,
    title,
    "slug": slug.current,
    desc,
    "mainImage": mainImage.asset->url,
    publishedAt,
    "author": author->{
      _id,
      name,
      "image": image.asset->url
    },
    "tags": tags[]->{
      _id,
      name,
      "slug": slug.current
    },
    _type
  }
`);

export const SEARCH_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" 
    && defined(slug.current)
    && (
      name match $q + "*" ||
      desc match $q + "*" ||
      pt::text(content) match $q + "*" ||
      $q in category->title ||
      $q in colors[].color
    )
  ] | order(_createdAt desc)[0...$limit] {
    _id,
    name,
    "slug": slug.current,
    desc,
    "mainImage": images[0].asset->url,
    "images": images[].asset->url,
    "category": category->{
      _id,
      title,
      "slug": slug.current
    },
    colors[] {
      _key,
      color,
      price,
      discount,
      stock
    },
    "seller": seller->{
      _id,
      name,
      "image": image.asset->url
    },
    _createdAt,
    _type
  }
`);

export const SEARCH_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" 
    && title match $q + "*"
  ] | order(title asc)[0...$limit] {
    _id,
    title,
    "slug": slug.current,
    "image": image.asset->url,
    "count": count(*[_type == "product" && references(^._id)]),
    _type
  }
`);

export const SEARCH_TAGS_QUERY = defineQuery(`
  *[_type == "tag" 
    && name match $q + "*"
  ] | order(name asc)[0...$limit] {
    _id,
    name,
    "slug": slug.current,
    "count": count(*[_type == "post" && references(^._id)]),
    _type
  }
`);

export const SEARCH_COUNT_QUERY = defineQuery(`
  {
    "posts": count(*[_type == "post" 
      && defined(slug.current)
      && (title match $q + "*" || desc match $q + "*")
    ]),
    "products": count(*[_type == "product" 
      && defined(slug.current)
      && (name match $q + "*" || desc match $q + "*")
    ]),
    "categories": count(*[_type == "category" && title match $q + "*"]),
    "tags": count(*[_type == "tag" && name match $q + "*"])
  }
`);

