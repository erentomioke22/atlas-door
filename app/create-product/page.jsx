import React from 'react';
import CreateProduct from "./create-product";
import Head from 'next/head';

export const metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/create-product`),
  title: "create product",
};

const Page = () => {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "create product",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/create-product`,
    "description": "Create a new product on Atlas Door"
  };

  return (
    <div>
      <Head>
        <title>{metadata.title}</title>
        <meta property="og:url" content={metadata.metadataBase} />
        <meta name="description" content="Create a new product on Atlas Door" />
        <meta property="og:title" content={metadata.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <CreateProduct />
    </div>
  );
};

export default Page;

