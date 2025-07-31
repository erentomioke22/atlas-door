import Head from 'next/head';
import ProductList from './productlist';

export const metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/products`),
  name: " محصولات - فروش محصولات مرتبط بانصب شیشه سکوریت و درب های اتوماتیک",
  description: "فروش محصولات مرتبط با نصب شیشه سکوریت و لمینت و درب های اتوماتیک",
  keywords: "درب‌های اتوماتیک, فروش درب‌های اتوماتیک, نصب درب‌های اتوماتیک, تعمیر درب‌های اتوماتیک, درب‌های خودکار, درب‌های حفاظتی, درب‌های امنیتی, درب برای منازل, درب برای کسب‌وکارها, قیمت درب‌های اتوماتیک, خدمات پس از فروش درب‌های اتوماتیک, وجام بالکن ها , آموزش شیشه سکوریت,آموزش در ب های اتوماتیک,آموزش انواع جام بالکن ها,آموزش کرکره برقی,اموزش شیشه یو پی وی سی,مشاوره درب‌های اتوماتیک, کرکره برقی",
  twitter: {
    card: 'summary_large_image'
  },
  openGraph: {
    title: "مقاله ها- آموزش و آشنایی با تمامی خدمات و محصولات اطلس در",
    description: "آموزش و آشنایی با انوع محصولات ما اعم از درب های اتوماتیک کرکره های برقی شیشه سکوریت جام بالکن ها و انواع پارتیشن ها",
    keywords: "درب‌های اتوماتیک, فروش درب‌های اتوماتیک, نصب درب‌های اتوماتیک, تعمیر درب‌های اتوماتیک, درب‌های خودکار, درب‌های حفاظتی, درب‌های امنیتی, درب برای منازل, درب برای کسب‌وکارها, قیمت درب‌های اتوماتیک, خدمات پس از فروش درب‌های اتوماتیک, وجام بالکن ها , آموزش شیشه سکوریت,آموزش در ب های اتوماتیک,آموزش انواع جام بالکن ها,آموزش کرکره برقی,اموزش شیشه یو پی وی سی,مشاوره درب‌های اتوماتیک, کرکره برقی",
    type: "website",
    locale: "fa_IR",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
    siteName: "Atlas Door"
  }
}

const AllProducts = () => {
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": " محصولات - فروش محصولات مرتبط بانصب شیشه سکوریت و درب های اتوماتیک",
    "description": "فروش محصولات مرتبط با نصب شیشه سکوریت و لمینت و درب های اتوماتیک",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
    "image": [`${process.env.NEXT_PUBLIC_BASE_URL}/your-default-image.jpg`], // Update with your default image
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/products`
    }
  };

  return (
    <>
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <div>
        <ProductList />
      </div>
    </>
  );
}

export default AllProducts;