export const metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
  title : {
    default:"پروفايل - تنظيمات",
    template:'%s - تنظيمات'
  },
  description:"نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
  keywords:'  کرکره برقی,درب اتوماتیک,جام باکن,پارتیشن شیشه ای,پارتیشن حمامی,پارتیشن حمومی, پارتیشن,موتور درب اتوماتیک,موتور کرکره برقی,سکوریت شیشه',
  twitter:{
   card:'summary_large_image'
  },
  openGraph:{
    title:"تنظيمات",
    description:"نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
    keywords:'  کرکره برقی,درب اتوماتیک,جام باکن,پارتیشن شیشه ای,پارتیشن حمامی,پارتیشن حمومی, پارتیشن,موتور درب اتوماتیک,موتور کرکره برقی,سکوریت شیشه',
    type:"website",
    locale:"fa_IR",
    url:`${process.env.NEXT_PUBLIC_BASE_URL}`,
    siteName:"Atas door"
  }
}

export default  function Layout({children}) {
  
  return (
  <div >
    <div className="py-5">
          {children}
    </div>
</div>
     );
   }