import React from 'react';
import CreatePostRoot from "./create-post-root";
import Head from 'next/head';

export const metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/create-post`),
  title: "create post",
};

const Page = () => {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "create post",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/create-post`,
    "description": "Create a new post on Atlas Door"
  };

  return (
    <div>
      <Head>
        <title>{metadata.title}</title>
        <meta property="og:url" content={metadata.metadataBase} />
        <meta name="description" content="Create a new post on Atlas Door" />
        <meta property="og:title" content={metadata.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <CreatePostRoot />
    </div>
  );
};

export default Page;

