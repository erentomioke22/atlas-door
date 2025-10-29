import React from 'react';
import EditPost from "./edit-post";
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

interface PageProps {
  params: {
    title: string;
  };
}


export const metadata : Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/edit-post`),
  title: 'edit post',
}



const Page : React.FC<PageProps> = async ({ params }) => {

  const jsonLd : JsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "edit post",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/edit-post`,
    "description": "Edit an existing post on Atlas Door"
  };
  const session = await getServerSession();
  return (
    <div>
      <Head>
        <title>{metadata.title}</title>
        <meta property="og:url" content={metadata.metadataBase.toString()} />
        <meta name="description" content="Edit an existing post on Atlas Door" />
        <meta property="og:title" content={metadata.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <EditPost title={params.title} session={session} />
    </div>
  );
};

export default Page;

