
import ProductPage from './productPage';
import { cache } from 'react';
import NotFound from '@app/(main)/not-found';
import { prisma } from '@utils/database';
import { getProductDataInclude } from '@lib/types';
// import Head from 'next/head';

const getPost = cache(async (name, loggedInUserId) => {
  try {
    // console.log('title 10101',title)
    const decodedTitle = decodeURIComponent(name);
    const product = await prisma.product.findFirst({
      where:{name:decodedTitle},
      include: getProductDataInclude(loggedInUserId),
  }) 

  
    return product;
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
    const product = await getPost(name);
    if (!product) { return {}; }
  // const contentImages = post?.contentImages?.map((contentImage)=>(
  //   {
  //     url: `https://www.atlasdoor.ir/${contentImage}`,
  //     width: 800,
  //     height: 600,
  //     alt: post?.title,
  //   }
  // ))

    return {
      metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/${product.name}`),
      title: `${product?.name} - ${product?.desc?.slice(0, 50)}...`,
      description: `${product?.desc}`,
      // keywords: `${product?.tags?.map((tag) => `${tag.name}`)}`,
      twitter: {
        card: 'summary_large_image',
        title: `${product.name}`,
        description: `${product?.desc}`,
      },
      openGraph: {
        title: `${product?.name} - ${product?.desc?.slice(0, 50)}...`,
        description: `${product?.desc}`,
        type: 'website',
        locale: 'en_US',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product?.name}`,
        siteName: 'trader comunity',
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${product?.images[0]}`,
            width: 800,
            height: 600,
            alt: product?.name,
          },
          // ...contentImages
        ],
      },
    };

  }
  catch(error){
    console.error('Error fetching product metadata:', error); 
    return {}; 
  }
}

const page = async({params}) => {
  const  {name}  = await params;
console.log(name)
  return (
      <ProductPage name={name}/>
  )
}

export default page;


