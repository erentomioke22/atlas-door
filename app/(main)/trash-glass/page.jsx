import PostPage from "@components/posts/postPage";



export const metadata = {
  // title : "Atlas News | best & hot news",
  metadataBase: new URL("https://www.atlasdoor.com/automatic-door"),
  title :"درب اتوماتیک",
  description:"نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
  twitter:{
   card:'summary_large_image'
  },
  openGraph:{
    title :"درب اتوماتیک",
    description:"نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
    type:"website",
    locale:"en_US",
    url:"https://www.atlasdoor.ir/automatic-door",
    siteName:"Atas door"
  }
}

export default async function Page({params}) {




  return (



  <div className="my-10">
     <PostPage params={params}/>
  </div>


  );
}
