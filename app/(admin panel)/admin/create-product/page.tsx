import React from 'react';
import CreateProduct from "./create-product";
import Head from 'next/head';
import { getServerSession } from '@/lib/get-session';
interface Metadata {
  metadataBase: URL;
  title: string;
}

export const metadata : Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/create-product`),
  title: "create product",
};

interface JsonLd {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  description: string;
}

const Page : React.FC = async() => {

  const jsonLd : JsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "create product",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/create-product`,
    "description": "Create a new product on Atlas Door"
  };
  const session = await getServerSession();
  return (
    <div>
      <Head>
        <title>{metadata.title}</title>
        <meta property="og:url" content={metadata.metadataBase.toString()} />
        <meta name="description" content="Create a new product on Atlas Door" />
        <meta property="og:title" content={metadata.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <CreateProduct session={session}/>
    </div>
  );
};

export default Page;

