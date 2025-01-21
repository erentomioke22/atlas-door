import React from 'react';
import PostPage from "@components/posts/postPage";
import Head from 'next/head';

export const metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/partition-glass`),
  title: "پارتیشن‌های شیشه‌ای - ارائه‌ ؛ فروش و نصب انواع پارتیشن‌های شیشه‌ای برای منازل و اماکن تجاری",
  description: "پارتیشن‌های شیشه‌ای با بهترین کیفیت و طراحی مدرن برای تفکیک فضاهای داخلی. ارائه‌دهنده خدمات فروش، نصب و تعمیر پارتیشن‌های شیشه‌ای با قیمت مناسب. مشاوره رایگان.",
  keywords: "پارتیشن‌های شیشه‌ای, فروش پارتیشن‌های شیشه‌ای, نصب پارتیشن‌های شیشه‌ای, تعمیر پارتیشن‌های شیشه‌ای, پارتیشن‌های مدرن, پارتیشن‌های دکوراتیو, پارتیشن‌های داخلی, تفکیک فضا با شیشه, پارتیشن‌های مقاوم, قیمت پارتیشن‌های شیشه‌ای, خدمات پس از فروش پارتیشن‌های شیشه‌ای, مشاوره پارتیشن‌های شیشه‌ای, خرید پارتیشن‌های شیشه‌ای",
  twitter: {
    card: 'summary_large_image'
  },
  openGraph: {
    title: "پارتیشن‌های شیشه‌ای - ارائه‌ ؛ فروش و نصب انواع پارتیشن‌های شیشه‌ای برای منازل و اماکن تجاری",
    description: "پارتیشن‌های شیشه‌ای با بهترین کیفیت و طراحی مدرن برای تفکیک فضاهای داخلی. ارائه‌دهنده خدمات فروش، نصب و تعمیر پارتیشن‌های شیشه‌ای با قیمت مناسب. مشاوره رایگان.",
    keywords: "پارتیشن‌های شیشه‌ای, فروش پارتیشن‌های شیشه‌ای, نصب پارتیشن‌های شیشه‌ای, تعمیر پارتیشن‌های شیشه‌ای, پارتیشن‌های مدرن, پارتیشن‌های دکوراتیو, پارتیشن‌های داخلی, تفکیک فضا با شیشه, پارتیشن‌های مقاوم, قیمت پارتیشن‌های شیشه‌ای, خدمات پس از فروش پارتیشن‌های شیشه‌ای, مشاوره پارتیشن‌های شیشه‌ای, خرید پارتیشن‌های شیشه‌ای",
    type: "website",
    locale: "fa_IR",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/partition-glass`,
    siteName: "Atlas Door"
  }
}

export default async function Page({ params }) {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "پارتیشن‌های شیشه‌ای",
    "description": "پارتیشن‌های شیشه‌ای با بهترین کیفیت و طراحی مدرن برای تفکیک فضاهای داخلی. ارائه‌دهنده خدمات فروش، نصب و تعمیر پارتیشن‌های شیشه‌ای با قیمت مناسب. مشاوره رایگان.",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/partition-glass`,
    "image": [`${process.env.NEXT_PUBLIC_BASE_URL}/your-default-image.jpg`], // Update with your default image
    "brand": {
      "@type": "Brand",
      "name": "Atlas Door"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "IRR",
      "url": `${process.env.NEXT_PUBLIC_BASE_URL}/partition-glass`,
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
        <PostPage params={{ title: 'پارتیشن-شیشه-ای_ezrs3t77ap' }} />
      </div>
    </>
  );
}

