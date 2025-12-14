import ProductPage from './productPage';
import { cache } from 'react';
import { prisma } from '@/utils/database';
import { getProductDataInclude } from '@/lib/types';
import Head from 'next/head';
import { notFound } from 'next/navigation';
import { ProductLite } from '@/components/products/productCard';
import { getServerSession } from "@/lib/get-session";
import Script from 'next/script';
interface ProductParams {
  name: string;
}

interface PageProps {
  params: Promise<ProductParams>;
}

const getProduct = cache(async (slug: string, userId?: string | null) => {
  try {
    return await prisma.product.findUnique({
      where: { slug: decodeURIComponent(slug) },
      include: getProductDataInclude(userId),
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
});

export const revalidate = 3600;


export async function generateStaticParams(): Promise<Array<{ name: string }>> {
  try {
    const products = await prisma.product.findMany({
      select: {
        slug: true,
      },
      take: 100,
      orderBy: { createdAt: 'desc' }
    });

    return products.map((product) => ({
      name: product.slug,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}



export async function generateMetadata({ params }: PageProps) {
  try {
    const { name } = await params;
    const product = await getProduct(name);
    
    if (!product) return {
      title: 'محصول یافت نشد',
      description: 'صفحه مورد نظر وجود ندارد',
      robots: { index: false, follow: false }
    };



  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const productUrl = `${baseUrl}/products/${product.slug}`;
  
  const images = product.images?.map(img => ({
    url: img,
    width: 1200,
    height: 630,
    alt: product.name,
  })) || [];

  // Find minimum price
  const minPrice = product.colors?.length > 0 
    ? Math.min(...product.colors.map(c => c.price))
    : 0;

  return {
    metadataBase: new URL(`${productUrl}`),
    title: `${product.name} | Atlas Door`,
    description: product.desc?.slice(0, 160) || '',
    alternates: {
      canonical: productUrl
    },
    openGraph: {
      title: product.name,
      description: product.desc || '',
      type: 'article',
      url: productUrl,
      publishedTime: product.createdAt.toISOString(),
      modifiedTime: product.updatedAt.toISOString(),
      siteName: 'Atlas Door',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.desc?.slice(0, 200) || '',
      images: images.length > 0 ? [images[0].url] : [],
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
      }
    },
    other: {
      'product:price:amount': minPrice.toString(),
      'product:price:currency': 'IRR',
    }
  };
  } catch (error) {
    console.error('Error fetching product metadata:', error);
    return {};
  }
}

const page = async ({ params }:PageProps) => {
  const { name } = await params;
  const session = await getServerSession();
  const product = await getProduct(name, session?.user?.id);

  if (!product) return notFound();


  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const productUrl = `${baseUrl}/products/${product.slug}`;

  // Calculate min price
  const minPrice = product.colors?.length > 0 
    ? Math.min(...product.colors.map(c => c.price))
    : 0;

  const productStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.desc || '',
    brand: {
      '@type': 'Brand',
      name: 'Atlas Door'
    },
    sku: product.id,
    image: product.images,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'IRR',
      price: minPrice,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.colors?.some(c => c.stocks > 0) 
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Atlas Door'
      }
    }
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'محصولات',
        item: `${baseUrl}/products`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.name,
        item: productUrl
      }
    ]
  };

  return (
    <>
      <Script
        id="product-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData)
        }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />
      <article >
       <ProductPage initialProduct={product} session={session}/>
      </article>
    </>
  );
};

export default page;

