import React from 'react';
import EditPost from "./edit-post-root";
import Head from 'next/head';

export const metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/edit-post`),
  title: 'edit post',
}

const Page = ({ params }) => {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "edit post",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/edit-post`,
    "description": "Edit an existing post on Atlas Door"
  };

  return (
    <div>
      <Head>
        <title>{metadata.title}</title>
        <meta property="og:url" content={metadata.metadataBase} />
        <meta name="description" content="Edit an existing post on Atlas Door" />
        <meta property="og:title" content={metadata.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <EditPost title={params.title} />
    </div>
  );
};

export default Page;

