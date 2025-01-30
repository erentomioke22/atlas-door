import React from 'react';
import PostPage from "@components/posts/postPage";
import Head from 'next/head';

export const metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/roller-shutter`),
  title: "کرکره برقی - فروش و نصب انمواع کرکره‌های اتوماتیک و برقی با کیفیت",
  description: "کرکره برقی با بهترین کیفیت و امنیت برای منازل و کسب‌وکارها. ارائه‌دهنده خدمات فروش، نصب و تعمیر کرکره‌های برقی با قیمت مناسب. مشاوره رایگان.",
  keywords: "کرکره برقی, فروش کرکره برقی, نصب کرکره برقی, تعمیر کرکره برقی, کرکره اتوماتیک, کرکره‌های حفاظتی, کرکره‌های امنیتی, کرکره برای منازل, کرکره برای کسب‌وکارها, قیمت کرکره برقی, خدمات پس از فروش کرکره برقی, مشاوره کرکره برقی, خرید کرکره برقی",
  twitter: {
    card: 'summary_large_image'
  },
  openGraph: {
    title: "کرکره برقی - فروش و نصب انمواع کرکره‌های اتوماتیک و برقی با کیفیت",
    description: "کرکره برقی با بهترین کیفیت و امنیت برای منازل و کسب‌وکارها. ارائه‌دهنده خدمات فروش، نصب و تعمیر کرکره‌های برقی با قیمت مناسب. مشاوره رایگان.",
    keywords: "کرکره برقی, فروش کرکره برقی, نصب کرکره برقی, تعمیر کرکره برقی, کرکره اتوماتیک, کرکره‌های حفاظتی, کرکره‌های امنیتی, کرکره برای منازل, کرکره برای کسب‌وکارها, قیمت کرکره برقی, خدمات پس از فروش کرکره برقی, مشاوره کرکره برقی, خرید کرکره برقی",
    type: "website",
    locale: "fa_IR",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/roller-shutter`,
    siteName: "Atlas Door"
  }
}

export default async function Page({ params }) {
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "کرکره برقی",
    "description": "کرکره برقی با بهترین کیفیت و امنیت برای منازل و کسب‌وکارها. ارائه‌دهنده خدمات فروش، نصب و تعمیر کرکره‌های برقی با قیمت مناسب. مشاوره رایگان.",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/roller-shutter`,
    "image": [`${process.env.NEXT_PUBLIC_BASE_URL}/your-default-image.jpg`],
    "brand": {
      "@type": "Brand",
      "name": "Atlas Door"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "IRR",
      "url": `${process.env.NEXT_PUBLIC_BASE_URL}/roller-shutter`,
      "itemCondition": "http://schema.org/NewCondition",
      "availability": "http://schema.org/InStock"
    }
  };

  return (
    <>
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <div className="my-10">
        <PostPage params={{ title: 'کرکره-برقی_bv199ooybn' }} />
      </div>
    </>
  );
}

