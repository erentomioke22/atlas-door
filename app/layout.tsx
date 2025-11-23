import type { Metadata } from "next";
import ReactQueryProvider from "@/context/ReactQueryProvider";
import "../styles/globals.css";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GoogleTagManager } from "@next/third-parties/google";
import NextTopLoader from "nextjs-toploader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import { Inter, Rubik } from 'next/font/google'
import localFont from 'next/font/local'



const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap', 
  variable: '--font-rubik',
  weight:"800"
})

const blanka = localFont({
  src: '../public/fonts/Blanka-Regular.otf',
  variable: '--font-blanka',
})


export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
  title: {
    default: "اطلس در | نمايندگی شيشه سكوريت و خام | فروش و ارائه خدمات انواع شيشه های سكوريت ، انواع درب های اتوماتيک  ، نرده های شيشه ای ، پارتيشن های اداری ، حمام شيشه ای و جام بالكن ها ",
    template: "%s - 0990-119-6140 | اطلس در | 55589837-021",
  },
  description: "نمايندگی شيشه سكوريت و خام - فروش و ارائه خدمات انواع شيشه های سكوريت ، انواع درب های اتوماتيک  ، نرده های شيشه ای ، پارتيشن های اداری ، حمام شيشه ای و جام بالكن ها",
  keywords:
    "کرکره برقی,درب اتوماتیک,جام باکن,پارتیشن شیشه ای,پارتیشن حمامی,پارتیشن حمومی, پارتیشن,موتور درب اتوماتیک,موتور کرکره برقی,سکوریت شیشه",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    title: "اطلس در | نمايندگی شيشه سكوريت و خام | فروش و ارائه خدمات انواع شيشه های سكوريت ، انواع درب های اتوماتيک  ، نرده های شيشه ای ، پارتيشن های اداری ، حمام شيشه ای و جام بالكن ها ",
    description: "نمايندگی شيشه سكوريت و خام - فروش و ارائه خدمات انواع شيشه های سكوريت ، انواع درب های اتوماتيک  ، نرده های شيشه ای ، پارتيشن های اداری ، حمام شيشه ای و جام بالكن ها",
    type: "website",
    locale: "fa_IR",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    siteName: "Atlas Door",
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

interface JsonLd {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  sameAs: string[];
}

const RootLayout = ({ children }: RootLayoutProps) => {
  // Handle potential undefined environment variable
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://default-url.com";
  
  const jsonLd: JsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Atlas Door",
    description: "نمايندگی شيشه سكوريت و خام - فروش و ارائه خدمات انواع شيشه های سكوريت ، انواع درب های اتوماتيک  ، نرده های شيشه ای ، پارتيشن های اداری ، حمام شيشه ای و جام بالكن ها",
    url: baseUrl,
    sameAs: [
      "https://www.facebook.com/AtlasDoor",
      "https://www.instagram.com/AtlasDoor",
      "https://www.linkedin.com/company/AtlasDoor",
    ],
  };

  return (
    <html lang="fa" dir="rtl" className={`${inter.variable} ${rubik.variable} ${blanka.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="enamad" content="22538924" />
      </head>
      <body className="font-rubik  bg-white text-[#1f2937] dark:bg-black dark:text-white" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader showSpinner={false} color="#d2d4d7" />
          <ReactQueryProvider>
              {children}
              <Toaster richColors position="bottom-right" />
          </ReactQueryProvider>
        </ThemeProvider>
        <SpeedInsights />
        <GoogleTagManager gtmId="GTM-W36FRRD8" />
        <GoogleAnalytics gaId="G-ZSTR9DKJHX" />
      </body>
    </html>
  );
};

export default RootLayout;