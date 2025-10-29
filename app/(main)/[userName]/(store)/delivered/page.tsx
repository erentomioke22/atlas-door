import { Metadata } from "next";
import { ReactNode } from "react";
import { getServerSession } from "@/lib/get-session";
import DeliveredPage from "./deliverPage";

export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
  title: " سفارشات تحویل گرفته شده",
  description:
    "نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
  keywords:
    "کرکره برقی,درب اتوماتیک,جام باکن,پارتیشن شیشه ای,پارتیشن حمامی,پارتیشن حمومی, پارتیشن,موتور درب اتوماتیک,موتور کرکره برقی,سکوریت شیشه",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    title: " سفارشات تحویل گرفته شده",
    description:
      "نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
    // keywords: 'کرکره برقی,درب اتوماتیک,جام باکن,پارتیشن شیشه ای,پارتیشن حمامی,پارتیشن حمومی, پارتیشن,موتور درب اتوماتیک,موتور کرکره برقی,سکوریت شیشه',
    type: "website",
    locale: "fa_IR",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    siteName: "Atas door",
  },
};


export default async function Layout() {
  const session = await getServerSession();

  return (
    <div>
      <DeliveredPage session={session} />
    </div>
  );
}
