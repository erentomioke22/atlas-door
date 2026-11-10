import type { Metadata } from "next";
import { ReactQueryProvider } from "@/context/ReactQueryProvider";
import './globals.css'
import { GoogleAnalytics } from "@next/third-parties/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import { Inter, Rubik } from 'next/font/google'
import localFont from 'next/font/local'
import Navbar from "@/components/Navbar"
import Footer from '@/components/footer';
import { getServerSession } from "@/lib/get-session";
import type { ServerSession } from '@/lib/get-session';
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
  src: '../../public/fonts/Blanka-Regular.otf',
  variable: '--font-blanka',
})


export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://atlasdoors.ir' 
  ),
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
  other: {
    enamad: "22538924",
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

type LayoutProps = {
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
export default async function Layout({ children }: LayoutProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://default-url.com";
  const session : ServerSession = await getServerSession();
  
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
  // <meta name="enamad" content="22538924" />

  return (
    <html lang="fa" suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${rubik.variable} ${blanka.variable} font-rubik bg-white text-[#1f2937] dark:bg-black dark:text-white`}
      >
        <div dir="rtl" >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
            }}
          />
  
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ReactQueryProvider>
              <Navbar session={session} />
  
              <div className="min-h-screen pt-28">
                {children}
              </div>
  
              <Footer />
            </ReactQueryProvider>
          </ThemeProvider>
  
          <SpeedInsights />
          <GoogleTagManager gtmId="GTM-W36FRRD8" />
          <GoogleAnalytics gaId="G-ZSTR9DKJHX" />
        </div>
      </body>
    </html>
  );
};
