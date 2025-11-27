import Head from 'next/head';
import ProductList from './productlist';
import { Suspense } from 'react';
import LoadingIcon from '@/components/ui/loading/LoadingIcon';
import { Metadata } from 'next';


export const metadata : Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/products`),
  title: "محصولات - فروش لوازم و یراق های شیشه سکوریت و درب های اتوماتیک | اطلس در",
  description: "فروش تخصصی لوازم و ابزار و یراق های شیشه سکوریت، لمینت و درب های اتوماتیک با بهترین کیفیت و قیمت",
  keywords: [
    "درب اتوماتیک",
    "شیشه سکوریت",
    "کرکره برقی",
    "جام بالکن",
    "پارتیشن شیشه ای",
    "نصب درب اتوماتیک",
    "فروش شیشه سکوریت",
    "قیمت درب اتوماتیک",
    "فروش لوازم درب اتوماتیک",
    "خرید لوازم درب اتوماتیک",
    "فروش یراق آلات",
    "فروش براق",
    "خرید یرق",
    "خرید یرق شیشه سکوریت",
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/products`
  },
  openGraph: {
    title: "محصولات - فروش لوازم و یراق های شیشه سکوریت و درب های اتوماتیک | اطلس در",
    description: "فروش تخصصی لوازم و ابزار و یراق های شیشه سکوریت، لمینت و درب های اتوماتیک با بهترین کیفیت و قیمت",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
    siteName: "Atlas Door",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "محصولات - فروش شیشه سکوریت و درب های اتوماتیک | اطلس در",
    description: "فروش تخصصی شیشه سکوریت، لمینت و درب های اتوماتیک با بهترین کیفیت و قیمت",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false
    }
  }
}

interface JsonLdData {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  image: string[];
  mainEntityOfPage: {
    "@type": string;
    "@id": string;
  };
}



const AllProducts  = ()  => {
  
  const jsonLd : JsonLdData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "محصولات - فروش شیشه سکوریت و درب های اتوماتیک | اطلس در",
    "description": "فروش تخصصی لوازم و ابزار و یراق های شیشه سکوریت، لمینت و درب های اتوماتیک با بهترین کیفیت و قیمت",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
    "image": [`${process.env.NEXT_PUBLIC_BASE_URL}/images/og-products.jpg`], 
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/products`
    }
  };

  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Head>
      <div>
      <Suspense fallback={<LoadingIcon color={"bg-white dark:bg-black "}/>}>
        <ProductList />
      </Suspense>
      </div>
    </>
  );
}

export default AllProducts;