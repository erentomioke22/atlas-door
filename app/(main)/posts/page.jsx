import React from 'react';
import List from "@components/ui/list";
import Head from 'next/head';

export const metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/posts`),
  title: "مقاله ها- آموزش و آشنایی با تمامی خدمات و محصولات اطلس در",
  description: "آموزش و آشنایی با انوع محصولات ما اعم از درب های اتوماتیک کرکره های برقی شیشه سکوریت جام بالکن ها و انواع پارتیشن ها",
  keywords: "درب‌های اتوماتیک, فروش درب‌های اتوماتیک, نصب درب‌های اتوماتیک, تعمیر درب‌های اتوماتیک, درب‌های خودکار, درب‌های حفاظتی, درب‌های امنیتی, درب برای منازل, درب برای کسب‌وکارها, قیمت درب‌های اتوماتیک, خدمات پس از فروش درب‌های اتوماتیک, وجام بالکن ها , آموزش شیشه سکوریت,آموزش در ب های اتوماتیک,آموزش انواع جام بالکن ها,آموزش کرکره برقی,اموزش شیشه یو پی وی سی,مشاوره درب‌های اتوماتیک, کرکره برقی",
  twitter: {
    card: 'summary_large_image'
  },
  openGraph: {
    title: "مقاله ها- آموزش و آشنایی با تمامی خدمات و محصولات اطلس در",
    description: "آموزش و آشنایی با انوع محصولات ما اعم از درب های اتوماتیک کرکره های برقی شیشه سکوریت جام بالکن ها و انواع پارتیشن ها",
    keywords: "درب‌های اتوماتیک, فروش درب‌های اتوماتیک, نصب درب‌های اتوماتیک, تعمیر درب‌های اتوماتیک, درب‌های خودکار, درب‌های حفاظتی, درب‌های امنیتی, درب برای منازل, درب برای کسب‌وکارها, قیمت درب‌های اتوماتیک, خدمات پس از فروش درب‌های اتوماتیک, وجام بالکن ها , آموزش شیشه سکوریت,آموزش در ب های اتوماتیک,آموزش انواع جام بالکن ها,آموزش کرکره برقی,اموزش شیشه یو پی وی سی,مشاوره درب‌های اتوماتیک, کرکره برقی",
    type: "website",
    locale: "fa_IR",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts`,
    siteName: "Atlas Door"
  }
}

const AllPosts = () => {
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "مقاله ها- آموزش و آشنایی با تمامی خدمات و محصولات اطلس در",
    "description": "آموزش و آشنایی با انوع محصولات ما اعم از درب های اتوماتیک کرکره های برقی شیشه سکوریت جام بالکن ها و انواع پارتیشن ها",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/posts`,
    "image": [`${process.env.NEXT_PUBLIC_BASE_URL}/your-default-image.jpg`], // Update with your default image
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/posts`
    }
  };

  return (
    <>
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <div>
        <List />
      </div>
    </>
  );
}

export default AllPosts;
