import React from 'react';
import PostPage from "@components/posts/postPage";
import Head from 'next/head';

export const metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/balcony-glass`),
  title: "جام بالکن - ارائه‌دهنده انواع شیشه‌های بالکنی برای منازل و اماکن تجاری",
  description: "فروش و نصب شیشه‌های بالکنی با کیفیت بالا و امنیت بیشتر. ارائه بهترین خدمات نصب و تعمیر شیشه‌های بالکنی. مشاوره و بازدید رایگان.",
  keywords: "جام بالکن, شیشه‌های بالکنی, فروش شیشه‌های بالکنی, نصب شیشه‌های بالکنی, تعمیر شیشه‌های بالکنی, شیشه‌های مقاوم, شیشه‌های ایمنی, شیشه برای بالکن, شیشه‌های دکوراتیو, قیمت شیشه‌های بالکنی, خدمات پس از فروش شیشه‌های بالکنی, مشاوره شیشه‌های بالکنی, خرید شیشه‌های بالکنی",
  twitter: {
    card: 'summary_large_image'
  },
  openGraph: {
    title: "جام بالکن - ارائه‌دهنده انواع شیشه‌های بالکنی برای منازل و اماکن تجاری",
    description: "فروش و نصب شیشه‌های بالکنی با کیفیت بالا و امنیت بیشتر. ارائه بهترین خدمات نصب و تعمیر شیشه‌های بالکنی. مشاوره و بازدید رایگان.",
    keywords: "جام بالکن, شیشه‌های بالکنی, فروش شیشه‌های بالکنی, نصب شیشه‌های بالکنی, تعمیر شیشه‌های بالکنی, شیشه‌های مقاوم, شیشه‌های ایمنی, شیشه برای بالکن, شیشه‌های دکوراتیو, قیمت شیشه‌های بالکنی, خدمات پس از فروش شیشه‌های بالکنی, مشاوره شیشه‌های بالکنی, خرید شیشه‌های بالکنی",
    type: "website",
    locale: "fa_IR",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/balcony-glass`,
    siteName: "Atlas Door"
  }
}

export default async function Page({ params }) {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "جام بالکن",
    "description": "فروش و نصب شیشه‌های بالکنی با کیفیت بالا و امنیت بیشتر. ارائه بهترین خدمات نصب و تعمیر شیشه‌های بالکنی. مشاوره و بازدید رایگان.",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/balcony-glass`,
    "image": [`${process.env.NEXT_PUBLIC_BASE_URL}/your-default-image.jpg`], // Update with your default image
    "brand": {
      "@type": "Brand",
      "name": "Atlas Door"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "IRR",
      "url": `${process.env.NEXT_PUBLIC_BASE_URL}/balcony-glass`,
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
        <PostPage params={{ title: 'شیشه-بالکنی_54jevup6ok' }} />
      </div>
    </>
  );
}


