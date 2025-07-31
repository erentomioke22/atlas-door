"use client";

import React from 'react';
import Head from 'next/head';
import VerifyPage from './verify';

export const metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`),
  title: "تایید ایمیل",
};

const Page = () => {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "تایید ایمیل",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`,
    "description": "Create a new post on Atlas Door"
  };

  return (
    <div>
      <Head>
        <title>{metadata.title}</title>
        <meta property="og:url" content={metadata.metadataBase} />
        <meta name="description" content="jتایید ایمیل اطلس در" />
        <meta property="og:title" content={metadata.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <VerifyPage />
    </div>
  );
};

export default Page;