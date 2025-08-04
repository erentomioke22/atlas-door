import Head from 'next/head';


export const metadata = {
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
    // images: [
    //   {
    //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/og-settings.jpg`,
    //     width: 800,
    //     height: 600,
    //     alt: "تنظیمات حساب کاربری اطلس در"
    //   }
    // ]
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

export default  function Layout({children}) {
  const jsonLd = {
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
  return (
  <div >
          <Head>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Head>
    <div className="py-5">
          {children}
    </div>
</div>
     );
   }








