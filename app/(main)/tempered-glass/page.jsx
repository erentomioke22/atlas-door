import React from 'react';
import PostPage from "@components/posts/postPage";
import Head from 'next/head';

export const metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/tempered-glass`),
  title: "شیشه سکوریت - خدمات حرفه‌ای فروش، نصب و تعمیر شیشه سکوریت",
  description: "بهترین خدمات فروش، نصب و تعمیر شیشه سکوریت در ایران و تهران. شیشه‌های مقاوم و ایمن برای تمامی نیازهای ساختمانی و دکوراسیون داخلی. تجربه‌ای حرفه‌ای و مطمئن با محصولات ما. مشاوره رایگان و خدمات حرفه‌ای.",
  keywords: "شیشه سکوریت, فروش شیشه سکوریت, نصب شیشه سکوریت, تعمیر شیشه سکوریت, شیشه‌های مقاوم, شیشه‌های ایمنی, شیشه‌های ساختمانی, دکوراسیون داخلی, شیشه برای فروشگاه‌ها, قیمت شیشه سکوریت, خدمات شیشه سکوریت, شرکت شیشه سکوریت, مشاوره شیشه سکوریت, خرید شیشه سکوریت, تولید شیشه سکوریت",
  twitter: {
    card: 'summary_large_image'
  },
  openGraph: {
    title: "شیشه سکوریت - خدمات حرفه‌ای فروش، نصب و تعمیر شیشه سکوریت",
    description: "بهترین خدمات فروش، نصب و تعمیر شیشه سکوریت در ایران و تهران. شیشه‌های مقاوم و ایمن برای تمامی نیازهای ساختمانی و دکوراسیون داخلی. تجربه‌ای حرفه‌ای و مطمئن با محصولات ما. مشاوره رایگان و خدمات حرفه‌ای.",
    keywords: "شیشه سکوریت, فروش شیشه سکوریت, نصب شیشه سکوریت, تعمیر شیشه سکوریت, شیشه‌های مقاوم, شیشه‌های ایمنی, شیشه‌های ساختمانی, دکوراسیون داخلی, شیشه برای فروشگاه‌ها, قیمت شیشه سکوریت, خدمات شیشه سکوریت, شرکت شیشه سکوریت, مشاوره شیشه سکوریت, خرید شیشه سکوریت, تولید شیشه سکوریت",
    type: "website",
    locale: "fa_IR",
    url: "https://www.atlasdoors.ir/tempered-glass",
    siteName: "Atlas Door"
  }
};

export default async function Page({ params }) {
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "شیشه سکوریت",
    "description": "بهترین خدمات فروش، نصب و تعمیر شیشه سکوریت در ایران و تهران. شیشه‌های مقاوم و ایمن برای تمامی نیازهای ساختمانی و دکوراسیون داخلی. تجربه‌ای حرفه‌ای و مطمئن با محصولات ما. مشاوره رایگان و خدمات حرفه‌ای.",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/tempered-glass`,
    "image": [`${process.env.NEXT_PUBLIC_BASE_URL}/your-default-image.jpg`], // Update with your default image
    "brand": {
      "@type": "Brand",
      "name": "Atlas Door"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "IRR",
      "url": `${process.env.NEXT_PUBLIC_BASE_URL}/tempered-glass`,
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
        <PostPage params={{ title: 'شیشه-سکوریت_hi88q0m9of' }} />
      </div>
    </>
  );
}

