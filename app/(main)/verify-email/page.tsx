import { Metadata } from 'next';
import { ResendVerificationButton } from './verification-button';
import { getServerSession } from '@/lib/get-session';
import { redirect } from "next/navigation";

export const metadata: Metadata = {
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

// Define the JSON-LD structure type
interface JsonLdData {
  "@context": string;
  "@type": string;
  description: string;
  potentialAction: {
    "@type": string;
    name: string;
    handler: {
      "@type": string;
      url: string;
    };
  };
  publisher: {
    "@type": string;
    name: string;
    url: string | undefined;
  };
}

export default async function VerifyEmailPage() {
  const jsonLd: JsonLdData = {
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


  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect("/");
  
  if (user.emailVerified) redirect("/");
  redirect("/");

  return (
    <main className="flex min-h-svh items-center justify-center px-4   container max-w-xl   mx-auto text-center">
      <div className="space-y-6">
        <div className="space-y-2">
        <h1  className="font-blanka font-bold text-2xl ">
         ATLAS DOOR
        </h1>
          <h1 className="text-xl font-semibold">ایمیل خود را تایید کنید</h1>
          <p className="text-lfont">
           ایمیل تایید به بسته ی ایمیل شما ارسال میشود
          </p>
        </div>
        {/* <ResendVerificationButton email={user.email} /> */}
      </div>
    </main>
  );
};






