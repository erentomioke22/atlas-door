import { ThemeProvider } from '@context/themeProvider'
import ReactQueryProvider from '@context/ReactQueryProvider';
import '../styles/globals.css';
import AuthProvider from '@context/Provider';
import { Toaster } from 'sonner'
import { GoogleAnalytics } from '@next/third-parties/google'
import { GoogleTagManager } from '@next/third-parties/google'
import NextTopLoader from 'nextjs-toploader';

export const metadata = {
    // title : "Atlas News | best & hot news",
    metadataBase: new URL("https://www.atlasdoor.com"),
    title : {
      default:"Atlas Door | 0912-375-8621 | اطلس دٌر  | 55589837-021",
      template:'%s - 0912-3758621| اطلس در | 55589837-021'
    },
    description:"نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
    keywords:'شیشه',
    twitter:{
     card:'summary_large_image'
    },
    openGraph:{
      title:" اطلس در | 2121295-021",
      description:"نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
      type:"website",
      locale:"en_US",
      url:"https://www.atlasdoor.ir",
      siteName:"Atas News"
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
  <body  className=" font-Rubik font-bold  bg-[#ffffff] text-[#1f2937] dark:bg-[#1d232a]  dark:text-[#a6adbb]"
  >
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange > 
    <NextTopLoader showSpinner={false} color='#13ce66'/>
      <ReactQueryProvider>
        <AuthProvider>
                 {children}     
             <Toaster richColors  position="bottom-left"/>
       </AuthProvider>
      </ReactQueryProvider>
    </ThemeProvider> 
  </body> 
  <GoogleTagManager gtmId="GTM-W36FRRD8" />
  <GoogleAnalytics gaId="G-XYZ" />
</html>
  )
}


export default RootLayout;
