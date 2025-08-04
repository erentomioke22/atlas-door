import Head from 'next/head';
import VerifyPage from './verify';
import { Suspense } from "react";
import LoadingIcon from '@components/ui/loading/LoadingIcon';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.atlasdoor.ir'),
  title: "تأیید ایمیل | اطلس در",
  description: "صفحه تأیید ایمیل حساب کاربری در اطلس در - نمایندگی تخصصی شیشه سکوریت و درب های اتوماتیک",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true
    }
  },
  openGraph: {
    title: "تأیید ایمیل | اطلس در",
    description: "صفحه تأیید ایمیل حساب کاربری در اطلس در",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`,
    siteName: "Atlas Door",
    locale: "fa_IR",
    type: "website"
  },
  twitter: {
    card: 'summary',
    title: "تأیید ایمیل | اطلس در",
    description: "صفحه تأیید ایمیل حساب کاربری در اطلس در"
  }
};

const Page = () => {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EmailMessage",
    "description": "صفحه تأیید ایمیل حساب کاربری",
    "potentialAction": {
      "@type": "ConfirmAction",
      "name": "تأیید ایمیل",
      "handler": {
        "@type": "HttpActionHandler",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email`
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Atlas Door",
      "url": process.env.NEXT_PUBLIC_BASE_URL
    }
  };

  return (
    <div>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Head>
      <Suspense fallback={<LoadingIcon color={"bg-white dark:bg-black "}/>}>
       <VerifyPage />
      </Suspense>
    </div>
  );
};

export default Page;






