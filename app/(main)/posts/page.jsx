import List from "@components/ui/list";


export const metadata = {
  // title : "Atlas News | best & hot news",
  metadataBase: new URL("https://www.atlasdoor.com/posts"),
  title :"مقاله ها",
  description:"نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
  twitter:{
   card:'summary_large_image'
  },
  openGraph:{
    title :"وبلاگ ها",
    description:"نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
    type:"website",
    locale:"en_US",
    url:"https://www.atlasdoor.ir/posts",
    siteName:"Atas door"
  }
}

const AllPosts = () => {
  return (
            <div>
              <List/>
            </div>
  )
}

export default AllPosts