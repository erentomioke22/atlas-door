
import ProductPage from './productPage';
import { cache } from 'react';
import { prisma } from '@utils/database';
import { getProductDataInclude } from '@lib/types';
// import Head from 'next/head';

const getProduct = cache(async (name, loggedInUserId) => {
  try {
    const decodedTitle = decodeURIComponent(name);
    return await prisma.product.findFirst({
      where:{name:decodedTitle},
      include: getProductDataInclude(loggedInUserId),
  }) 

  } catch (error) {
    console.error('Error fetching product:', error);
    return null; 
  }
});


export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      select: {
        name: true,
      },
    });

    return products.map((product) => ({
      name: product.name,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}


export async function generateMetadata({ params }) {
  try{
    const  {name}  = await params;
    const product = await getProduct(name);
    if (!product) return {
      title: 'محصول یافت نشد',
      description: 'صفحه مورد نظر وجود ندارد',
      robots: { index: false, follow: false }
    };
  const contentImages = product?.images?.map((image)=>(
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${image}`,
      width: 800,
      height: 600,
      alt: product.name,
    }
  ))

    return {
      metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/${product.name}`),
      title: `${product?.name} - ${product?.desc?.slice(0, 50)}... | Atlas Door`,
      description: product?.desc,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.name}`
      },
      // keywords: `${product?.tags?.map((tag) => `${tag.name}`)}`,
      openGraph: {
        title: product.name,
        description: product.desc,
        type: 'product',
        publishedTime: product.createdAt.toISOString(),
        modifiedTime: product.updatedAt.toISOString(),
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.name}`,
        siteName: 'Atlas Door',
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${product?.images[0]}`,
            width: 800,
            height: 600,
            alt: product?.name,
          },
          ...contentImages
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.desc,
        images: images[0]?.url,
      },
      robots: {
        index: true,
        follow: true,
      }
    };

  }
  catch(error){
    console.error('Error fetching product metadata:', error); 
    return {}; 
  }
}

const page = async({params}) => {
  const product = await getProduct(params.name);

  const  {name}  = await params;
  // if (!product) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.desc,
    "brand": {
      "@type": "Brand",
      "name": "Atlas Door"
    },
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.name}`,
      "priceCurrency": "IRR",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Atlas Door"
      }
    },
    "image": product.images.map(img => ({
      "@type": "ImageObject",
      "url": `${process.env.NEXT_PUBLIC_BASE_URL}/${img}`,
      "width": 800,
      "height": 600
    })),
    "aggregateRating": product?.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product?.rating,
      "reviewCount": product?.reviewsCount
    } : undefined
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "محصولات",
        "item": `${process.env.NEXT_PUBLIC_BASE_URL}/products`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": product.name,
        "item": `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.name}`
      }
    ]
  };
  return (
    <>
          <Head>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      </Head>
      <ProductPage name={name}/>
    </>
  )
}

export default page; 

