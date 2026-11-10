// app/(main)/[userName]/settings/page.tsx
import type { Metadata } from "next";
import SettingPage from "../../../../components/pages/settingPage";
import { getServerSession } from "@/lib/get-session";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.atlasdoor.ir";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "تنظیمات حساب کاربری | اطلس در",
    template: "%s | تنظیمات - اطلس در",
  },
  description:
    "مدیریت تنظیمات حساب کاربری و پروفایل در اطلس در - نمایندگی تخصصی شیشه سکوریت، درب های اتوماتیک و کرکره برقی",
  alternates: {
    canonical: "/settings", // نسبی — metadataBase آن را کامل می‌کند
  },
  twitter: {
    card: "summary",
    title: "تنظیمات حساب کاربری | اطلس در",
    description: "مدیریت تنظیمات حساب کاربری و پروفایل در اطلس در",
    creator: "@atlasdoor",
  },
  openGraph: {
    title: "تنظیمات حساب کاربری | اطلس در",
    description:
      "مدیریت تنظیمات حساب کاربری و پروفایل در اطلس در - نمایندگی تخصصی شیشه سکوریت، درب های اتوماتیک و کرکره برقی",
    url: "/settings",
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
      noimageindex: true,
    },
  },
};

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

export default async function Page() {
  const session = await getServerSession();

  const jsonLd: JsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "تنظیمات حساب کاربری",
    description: "صفحه مدیریت تنظیمات حساب کاربری در وبسایت اطلس در",
    url: `${BASE_URL}/settings`,
    potentialAction: {
      "@type": "Action",
      name: "مدیریت حساب",
      target: `${BASE_URL}/settings`,
    },
  };

  return (
    <>
      {/* JSON-LD را مستقیم در JSX رندر کنید — نه با next/head */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <SettingPage session={session} />
      </div>
    </>
  );
}