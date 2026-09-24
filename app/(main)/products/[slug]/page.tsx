// app/(main)/products/[slug]/page.tsx
import { sanityFetch } from '@/sanity/lib/server';
import { client } from '@/sanity/lib/client';
import {
  SINGLE_PRODUCT_QUERY,
  PRODUCT_META_QUERY,
  RELATED_PRODUCTS_QUERY,
} from '@/lib/sanity/queries';
import ProductPage from '@/components/pages/productPage';
import { ProductFull, SanityProduct } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getServerSession } from '@/lib/get-session';
import { groq } from 'next-sanity';
import { transformProductToLite } from '@/lib/sanity/transformers';

export const revalidate = 120;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const products = await client.fetch<Array<{ slug: string }>>(
      groq`*[_type == "product" && status == "PUBLISHED" && defined(slug.current)]{ "slug": slug.current }`,
      {},
      {
        next: {
          revalidate: 120,
          tags: ['product'],
        },
      }
    );

    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('❌ Error generating static params:', error);
    return [];
  }
}

// ====== متادیتا ======
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await sanityFetch<{
      name: string;
      desc?: string;
      image?: string;
      imageAlt?: string;
      publishedAt?: string;
      _updatedAt?: string;
      categoryName?: string;
      categorySlug?: string;
      colors?: Array<{ price: number; discount: number; stock: number }>;
    }>({
      query: PRODUCT_META_QUERY,
      params: { slug },
      tags: [`product-${slug}`],
      revalidate: 3600,
    });

    if (!product) {
      return {
        title: 'محصول یافت نشد | اطلس در',
        robots: { index: false, follow: false },
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const productUrl = `${baseUrl}/products/${slug}`;

    const minPrice = product.colors?.length
      ? Math.min(...product.colors.map((c) => c.price))
      : 0;

    return {
      metadataBase: new URL(baseUrl),
      title: `${product.name} | اطلس در`,
      description: product.desc?.slice(0, 160) || '',
      alternates: { canonical: productUrl },
      openGraph: {
        title: product.name,
        description: product.desc?.slice(0, 200) || '',
        type: 'article',
        publishedTime: product.publishedAt,
        modifiedTime: product._updatedAt,
        url: productUrl,
        locale: 'fa_IR',
        siteName: 'Atlas Door',
        images: product.image
          ? [
              {
                url: product.image,
                width: 1200,
                height: 630,
                alt: product.imageAlt || product.name,
              },
            ]
          : [],
      },
      twitter: {
        card: product.image ? 'summary_large_image' : 'summary',
        title: product.name,
        description: product.desc?.slice(0, 200) || '',
        images: product.image ? [product.image] : [],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      other: {
        'product:price:amount': minPrice.toString(),
        'product:price:currency': 'IRR',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: 'خطا | اطلس در' };
  }
}

// ====== صفحه ======
export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const session = await getServerSession();

  const product = await sanityFetch<SanityProduct>({
    query: SINGLE_PRODUCT_QUERY,
    params: { slug },
    tags: [`product-${slug}`, 'product'],
    revalidate: 120,
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await sanityFetch<SanityProduct[]>({
    query: RELATED_PRODUCTS_QUERY,
    params: {
      productId: product._id,
      categorySlug: product.category?.slug || '',
    },
    tags: ['product', 'related-products'],
    revalidate: 120,
  });

  const transformedProduct = transformProductToLite(product);
  const transformedRelated = (relatedProducts || []).map(transformProductToLite);

  const productFull: ProductFull = {
    ...transformedProduct,
    content: product.content,
    relatedProducts: transformedRelated,
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const productUrl = `${baseUrl}/products/${slug}`;

  const minPrice = product.colors?.length
    ? Math.min(...product.colors.map((c) => c.price))
    : 0;

  const productStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.desc || '',
    brand: {
      '@type': 'Brand',
      name: 'Atlas Door',
    },
    sku: product._id,
    image: product.images,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'IRR',
      price: minPrice,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      availability: product.colors?.some((c) => c.stock > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Atlas Door',
      },
    },
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'محصولات',
        item: `${baseUrl}/products`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <ProductPage initialProduct={productFull} session={session} />
    </>
  );
}
