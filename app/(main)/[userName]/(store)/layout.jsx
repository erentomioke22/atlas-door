import BagBar from "./bagBar";



export const metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
  title : {
    default:"سبد خريد",
    template:'%s - سبد خريد'
  },
  description:"نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
  keywords:'  کرکره برقی,درب اتوماتیک,جام باکن,پارتیشن شیشه ای,پارتیشن حمامی,پارتیشن حمومی, پارتیشن,موتور درب اتوماتیک,موتور کرکره برقی,سکوریت شیشه',
  twitter:{
   card:'summary_large_image'
  },
  openGraph:{
    title:"سبد خريد",
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
  <div className="  md:px-20 lg:px-52 xl:px-96 space-y-5 ">
    <BagBar/>
    <div className="py-5">
          {children}
    </div>
</div>
     );
   }