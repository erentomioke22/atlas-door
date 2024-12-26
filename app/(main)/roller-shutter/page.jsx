import Link from "next/link";
import EmblaCarousel from "@components/ui/carousel/carousel";
import { FaCaretRight } from "react-icons/fa6";
import PostPage from "@components/posts/postPage";
import ImageCom from "@components/ui/Image";



export const metadata = {
  // title : "Atlas News | best & hot news",
  metadataBase: new URL("https://www.atlasdoor.com/roller-shutter"),
  title :"کرکره برقی",
  description:"نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
  twitter:{
   card:'summary_large_image'
  },
  openGraph:{
    title :"کرکره برقی",
    description:"نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
    type:"website",
    locale:"en_US",
    url:"https://www.atlasdoor.ir/roller-shutter",
    siteName:"Atas door"
  }
}

export default async function Page({params}) {


  const models=[
    {
      name:'تیغه آلمینیومی',
      url:'/automatic-door',
      image:'/images/roller-shutter/blade/gray.jpg'
    },
    {
      name:'پلی کربنات',
      url:'/roller-shutter',
      image:'/images/roller-shutter/blade/polycarbonat2.jpg'
    },
    {
      name:'رول گیتر',
      url:'/tempered-glass',
      image:'/images/roller-shutter/blade/rolgater.jpg'
    },
    {
      name:'گالوانیزه',
      url:'/partition-glass',
      image:'/images/roller-shutter/blade/galvanize.jpg'
    },
    {
      name:'فولادی',
      url:'/balcony-glass',
      image:'/images/roller-shutter/blade/gray.jpg'
    },
  ]

  const tools=[
    {
      name:'موتور',
      url:'/',
      image:'/images/roller-shutter/accessories/motor/1732009538090.jpg'
    },
    {
      name:'صفحه پلیت',
      url:'/',
      image:'/images/roller-shutter/accessories/plates/1732009538068.jpg'
    },
    {
      name:'مدار فرمان',
      url:'/',
      image:'/images/roller-shutter/accessories/circuit-control/1732009538149.jpg'
    },
    {
      name:'خلاص کن',
      url:'/',
      image:'/images/roller-shutter/accessories/remover/1732009538101.jpg'
    },
    {
      name:'سنسور',
      url:'/',
      image:'/images/roller-shutter/accessories/sensores/1732009538024.jpg'
    },
    {
      name:'ریل',
      url:'/',
      image:'/images/roller-shutter/accessories/rail/1732009538064.jpg'
    },
    {
      name:'رسیور',
      url:'/',
      image:'/images/roller-shutter/accessories/reciever/1732009538157.jpg'
    },
    {
      name:'باطری',
      url:'/',
      image:'/images/roller-shutter/accessories/battery/1732009538142.jpg'
    },
    {
      name:'قفل',
      url:'/',
      image:'/images/roller-shutter/accessories/lock/1732009538073.jpg'
    },
    {
      name:'لوله شفت',
      url:'/',
      image:'/images/roller-shutter/accessories/shaft-pipe/1732009538041.jpg'
    },
    {
      name:'کپس',
      url:'/',
      image:'/images/roller-shutter/accessories/caps/1732009538012.jpg'
    },
    {
      name:'میکروسوییچ',
      url:'/',
      image:'/images/roller-shutter/accessories/circuit-control/1732009538118.jpg'
    },
  ]




  return (
    <>

    {/* <div className="bg-lcard  py-16 dark:bg-dcard">
      <div className="space-y-10 ">
        <div className="px-6">
          <p className=" text-4xl md:text-[60px] leading-normal">انواع تیغه های کرکره برقی</p>
          <p className=" text-md text-lfont">انواع تیغه های کرکره با توجه به نوع کارکرد و محیط مورد نظر و سلیقه به دسته بندی های زیر تقسیم میشوند </p>
        </div>
        <EmblaCarousel 
        options={{ dragFree: true ,direction:'rtl'}}
        buttons={true}
        autoScroll={false}
        >
          {models.map((model)=>(
        <div className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[75%] md:basis-[45%] lg:basis-[25%] min-w-0 pl-4" 
        key={model.url}>
          <Link href={model.url}>
          <div className="relative w-full h-[200px] md:h-[250px]  ">
            <ImageCom 
            className=' rounded-xl w-full '
            size={'h-[200px] md:h-[250px]'}
             alt={"Thumnail Image"}
             src={model.image} />
            <div className="absolute  inset-x-0 bottom-0 rounded-b-xl mx-auto py-3 w-full bg-gradient-to-t from-black/75 from-50% to-transparent  flex  justify-between px-3 items-center">
            <h1 className="text-2xl text-white">{model.name}</h1>
            <button className="bg-white p-1 text-sm rounded-full text-black my-auto"><FaCaretRight/></button>
            </div>
            </div>
            </Link>
         </div>
          ))}
         
        </EmblaCarousel>
      </div>
    </div> */}

      {/* <div className="w-full   py-14 relative bg-gradient-to-t  from-lbtn to-black text-white dark:from-dbtn dark:to-white dark:text-black ">
      <div className="space-y-10 ">
        <div className="text-center">
          <p className="text-4xl md:text-[60px] leading-normal">لوازم کرکره برقی</p>
          <p className=" text-md  text-lbtn dark:text-dbtn">آشنایی با لوازم کرکره برقی برای خریدی بهتر</p>
        </div>
        <EmblaCarousel 
        // options={{ dragFree: true ,loop:true}}
        buttons={true}
        autoScroll={false}
        >
          {tools.map((tool)=>(
        <div className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[75%] md:basis-[45%] lg:basis-[25%] min-w-0 pl-4" key={1}>
          <Link href={tool.url}>
          <div className="relative w-full h-[200px] md:h-[250px]  ">
            <ImageCom 
            className=' rounded-xl w-full '
            size={'h-[200px] md:h-[250px]'}
             alt={"Thumnail Image"}
             src={tool.image} />
            <div className="absolute  inset-x-0 bottom-0 rounded-b-xl mx-auto py-3 w-full bg-gradient-to-t from-black/75 from-50% to-transparent  flex  justify-between px-3 items-center">
            <h1 className="text-2xl text-white">{tool.name}</h1>
            <button className="bg-white p-1 text-sm rounded-full text-black my-auto"><FaCaretRight/></button>
            </div>
            </div>
            </Link>
         </div>
          ))}
         
        </EmblaCarousel>
      </div>
    </div> */}



  <div className="my-10">
     <PostPage params={{title:'کرکره-برقی_bv199ooybn'}}/>
  </div>


    </>
  );
}
