import Head from 'next/head';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import SettingPage from './page';
import { getServerSession } from '@/lib/get-session';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.atlasdoor.ir'),
  title: {
    default: "تنظیمات حساب کاربری | اطلس در",
    template: "%s | تنظیمات - اطلس در"
  },
  description: "مدیریت تنظیمات حساب کاربری و پروفایل در اطلس در - نمایندگی تخصصی شیشه سکوریت، درب های اتوماتیک و کرکره برقی",
  keywords: [
    "تنظیمات حساب کاربری",
    "پروفایل اطلس در",
    "مدیریت حساب",
    "شیشه سکوریت",
    "درب اتوماتیک",
    "کرکره برقی",
    "پارتیشن شیشه ای",
    "جام بالکن",
    "نصب درب اتوماتیک"
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/settings`
  },
  twitter: {
    card: 'summary',
    title: "تنظیمات حساب کاربری | اطلس در",
    description: "مدیریت تنظیمات حساب کاربری و پروفایل در اطلس در",
    creator: "@atlasdoor"
  },
  openGraph: {
    title: "تنظیمات حساب کاربری | اطلس در",
    description: "مدیریت تنظیمات حساب کاربری و پروفایل در اطلس در - نمایندگی تخصصی شیشه سکوریت، درب های اتوماتیک و کرکره برقی",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings`,
    siteName: "Atlas Door",
    locale: "fa_IR",
    type: "website",
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: true,
      noimageindex: true
    }
  }
};

// Define the JSON-LD structure type
interface JsonLdData {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  potentialAction: {
    "@type": string;
    name: string;
    target: string;
  };
}

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const jsonLd: JsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "تنظیمات حساب کاربری",
    "description": "صفحه مدیریت تنظیمات حساب کاربری در وبسایت اطلس در",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/settings`,
    "potentialAction": {
      "@type": "Action",
      "name": "مدیریت حساب",
      "target": `${process.env.NEXT_PUBLIC_BASE_URL}/settings`
    }
  };
  const session = await getServerSession();

  return (
    <div>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Head>
      <div>
        <SettingPage session={session}/>
      </div>
    </div>
  );
}







