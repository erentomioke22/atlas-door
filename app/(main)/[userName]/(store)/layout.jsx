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
  <div className=" w-full sm:w-4/5 lg:w-4/6 xl:w-3/5 mx-auto my-10 space-y-10 px-5">
    <BagBar/>
    <div>
          {children}
    </div>
</div>
     );
   }