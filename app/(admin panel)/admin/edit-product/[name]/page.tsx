import React from 'react';
import EditProduct from "./edit-product";
import Head from 'next/head';
import { getServerSession } from '@/lib/get-session';

interface Metadata {
  metadataBase: URL;
  title: string;
}
interface JsonLd {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  description: string;
}





export const metadata : Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/edit-product`),
  title: 'edit product',
}

const Page = async ({ params }: { params: Promise<{ name: string }> }
 ) => {
 const { name } = await params;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "edit product",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/edit-product`,
    "description": "Edit an existing product on Atlas Door"
  };

  const session = await getServerSession();

  return (
    <div>
      <Head>
        <title>{metadata.title}</title>
        <meta property="og:url" content={metadata.metadataBase.toString()} />
        <meta name="description" content="Edit an existing product on Atlas Door" />
        <meta property="og:title" content={metadata.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <EditProduct name={name} session={session}/>
    </div>
  );
};

export default Page;

