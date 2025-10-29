import type { Metadata } from "next";
import ReactQueryProvider from "@/context/ReactQueryProvider";
import "../styles/globals.css";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GoogleTagManager } from "@next/third-parties/google";
import NextTopLoader from "nextjs-toploader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";



export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
  title: {
    default: "Atlas Door | 0990-119-6140 | اطلس در  | 55589837-021",
    template: "%s - 0990-119-6140 | اطلس در | 55589837-021",
  },
  description:
    "نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
  keywords:
    "کرکره برقی,درب اتوماتیک,جام باکن,پارتیشن شیشه ای,پارتیشن حمامی,پارتیشن حمومی, پارتیشن,موتور درب اتوماتیک,موتور کرکره برقی,سکوریت شیشه",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    title: " اطلس در | 2121295-021",
    description:
      "نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
    type: "website",
    locale: "fa_IR",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    siteName: "Atlas Door",
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

const RootLayout = ({ children }: RootLayoutProps): JSX.Element => {
  // Handle potential undefined environment variable
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://default-url.com";
  
  const jsonLd: JsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Atlas Door",
    description:
      "نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
    url: baseUrl,
    sameAs: [
      "https://www.facebook.com/AtlasDoor",
      "https://www.instagram.com/AtlasDoor",
      "https://www.linkedin.com/company/AtlasDoor",
    ],
  };

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-Rubik font-bold bg-[#ffffff] text-[#1f2937] dark:bg-[#1d232a] dark:text-white" suppressHydrationWarning>
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