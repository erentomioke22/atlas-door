import Head from 'next/head';
import PostList from './postlist';
import { Suspense } from 'react';
import LoadingIcon from '@/components/ui/loading/LoadingIcon';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/posts`),
  title: "مقالات تخصصی آموزش و آشنایی با شیشه سکوریت و درب های اتوماتیک",
  description: "آموزش تخصصی نصب و نگهداری شیشه سکوریت، درب های اتوماتیک و کرکره های برقی",
  keywords: [
    "آموزش درب اتوماتیک",
    "آموزش درب اتوماتیک",
    "قیمت درب اتوماتیک",
    "قیمت شیشه سکوریت",
    "تعمیر کرکره برقی",
    "مقالات جام بالکن",
    "پارتیشن شیشه ای",
    "آموزش نصب درب اتوماتیک",
    "آموزش نصب جام بالکن ها",
    "مقالات شیشه سکوریت",
    "مشاوره درب اتوماتیک",
    "خدمات درب اتوماتیک"
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/posts`
  },
  openGraph: {
    title: "مقالات تخصصی آموزش و آشنایی با شیشه سکوریت و درب های اتوماتیک",
    description: "آموزش تخصصی نصب و نگهداری شیشه سکوریت، درب های اتوماتیک و کرکره های برقی",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts`,
    siteName: "Atlas Door",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "مقالات تخصصی شیشه سکوریت و درب های اتوماتیک | اطلس در",
    description: "آموزش تخصصی نصب و نگهداری شیشه سکوریت، درب های اتوماتیک و کرکره های برقی",
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
};

// Define JSON-LD structure type
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

const AllPosts = () => {
  const jsonLd: JsonLdData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "مقالات تخصصی آموزش و آشنایی با شیشه سکوریت و درب های اتوماتیک",
    "description": "آموزش تخصصی نصب و نگهداری شیشه سکوریت، درب های اتوماتیک و کرکره های برقی",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/posts`,
    "image": [`${process.env.NEXT_PUBLIC_BASE_URL}/images/og-posts.jpg`], 
    "mainEntityOfPage": {
      "@type": "ItemList",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/posts`
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
          <PostList />
        </Suspense>
      </div>
    </> 
  );
};

export default AllPosts;








