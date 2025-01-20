import { ThemeProvider } from '@context/themeProvider'
import ReactQueryProvider from '@context/ReactQueryProvider';
import '../styles/globals.css';
import AuthProvider from '@context/Provider';
import { Toaster } from 'sonner'
import { GoogleAnalytics } from '@next/third-parties/google'
import { GoogleTagManager } from '@next/third-parties/google'
import NextTopLoader from 'nextjs-toploader';
import { SpeedInsights } from "@vercel/speed-insights/next"


export const metadata = {
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
    title : {
      default:"Atlas Door | 0912-375-8621 | اطلس دٌر  | 55589837-021",
      template:'%s - 0912-3758621| اطلس در | 55589837-021'
    },
    description:"نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
    keywords:'  کرکره برقی,درب اتوماتیک,جام باکن,پارتیشن شیشه ای,پارتیشن حمامی,پارتیشن حمومی, پارتیشن,موتور درب اتوماتیک,موتور کرکره برقی,سکوریت شیشه',
    twitter:{
     card:'summary_large_image'
    },
    openGraph:{
      title:" اطلس در | 2121295-021",
      description:"نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
      keywords:'  کرکره برقی,درب اتوماتیک,جام باکن,پارتیشن شیشه ای,پارتیشن حمامی,پارتیشن حمومی, پارتیشن,موتور درب اتوماتیک,موتور کرکره برقی,سکوریت شیشه',
      type:"website",
      locale:"fa_IR",
      url:`${process.env.NEXT_PUBLIC_BASE_URL}`,
      siteName:"Atas door"
    }
}

const RootLayout = async({children})=> {

 return (
  <html lang='fa' dir='rtl'>
    <head>
      <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <meta name="apple-mobile-web-app-title" content="Atlas Door" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="google-site-verification" content="aBsXlKo4-eSlSDTM1tjvPD5UzqTavw3GSOLQfNxaimE" />
    </head>
  <body  className=" font-Rubik font-bold  bg-[#ffffff] text-[#1f2937] dark:bg-[#1d232a]  dark:text-white"
  >
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange > 
    <NextTopLoader showSpinner={false} color='#13ce66'/>
      <ReactQueryProvider>
        <AuthProvider>
                 {children}     
             <Toaster richColors  position="bottom-right"/>
       </AuthProvider>
      </ReactQueryProvider>
    </ThemeProvider> 
    <SpeedInsights />
  </body> 
  <GoogleTagManager gtmId="GTM-W36FRRD8" />
  <GoogleAnalytics gaId="G-ZSTR9DKJHX" />
</html>
  )
}


export default RootLayout;
