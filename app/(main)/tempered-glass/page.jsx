import Link from "next/link";
import EmblaCarousel from "@components/ui/carousel/carousel";
import { FaCaretRight } from "react-icons/fa6";
import PostPage from "@components/posts/postPage";
import ImageCom from "@components/ui/Image";



export const metadata = {
  // title : "Atlas News | best & hot news",
  metadataBase: new URL("https://www.atlasdoor.com/tempered-glass"),
  title :"شیشه سکوریت",
  description:"نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
  twitter:{
   card:'summary_large_image'
  },
  openGraph:{
    title :"شیشه سکوریت",
    description:"نمایندگی شیشه سکوریت و فروش محصولات کرکره برقی و درب اتوماتیک ونصب انواع پارتیشن و جام بالکن ها",
    type:"website",
    locale:"en_US",
    url:"https://www.atlasdoor.ir/tempered-glass",
    siteName:"Atas door"
  }
}

export default async function Page({params}) {


  // const models=[
  //   {
  //     name:'اسلایدینگ (کشویی)',
  //     url:'/automatic-door',
  //     image:'/images/automatic-door/slide/thumnail.jpg'
  //   },
  //   {
  //     name:'فولدینگ (تاشو)',
  //     url:'/roller-shutter',
  //     image:'/images/automatic-door/folding/thumnail.jpg'
  //   },
  //   {
  //     name:'تلسکوپی',
  //     url:'/tempered-glass',
  //     image:'/images/automatic-door/telescope/thumnail.jpg'
  //   },
  //   {
  //     name:'گردان',
  //     url:'/partition-glass',
  //     image:'/images/automatic-door/revolving/thumnail.jpg'
  //   },
  //   {
  //     name:'سوینگ (بازشو)',
  //     url:'/balcony-glass',
  //     image:'/images/automatic-door/swing/thumnail.jpg'
  //   },
  //   {
  //     name:'مثلثی',
  //     url:'/mirror',
  //     image:'/images/automatic-door/triangular/thumnail.webp'
  //   },
  //   {
  //     name:'بیمارستانی',
  //     url:'/upvc-window',
  //     image:'/images/automatic-door/hospital/thumnail.jpg'
  //   },
  //   {
  //     name:'کرو',
  //     url:'/upvc-window',
  //     image:'/images/automatic-door/curve/thumnail.jpg'
  //   },
  //   {
  //     name:'بریک اوت',
  //     url:'/upvc-window',
  //     image:'/images/automatic-door/breakOut/thumnail.jpg'
  //   },
  // ]

  // const tools=[
  //   {
  //     name:'تسمه',
  //     url:'/',
  //     image:'/images/automatic-door/accessories/strap/1732004919019.jpg'
  //   },
  //   {
  //     name:'هنگر',
  //     url:'/',
  //     image:'/images/automatic-door/accessories/hanger/1732004919001.jpg'
  //   },
  //   {
  //     name:'چشمی',
  //     url:'/',
  //     image:'/images/automatic-door/accessories/sensor/1732004918980.jpg'
  //   },
  //   {
  //     name:'موتور',
  //     url:'/',
  //     image:'/images/automatic-door/accessories/motor/1732004918954.jpg'
  //   },
  //   {
  //     name:'قفل',
  //     url:'/',
  //     image:'/images/automatic-door/accessories/lock/1732004918925.jpg'
  //   },
  //   {
  //     name:'ریموت',
  //     url:'/',
  //     image:'/images/automatic-door/accessories/remote/1732004918995.jpg'
  //   },
  //   {
  //     name:'اپراتور',
  //     url:'/',
  //     image:'/images/automatic-door/accessories/operator/1732004918946.jpg'
  //   },
  // ]




  return (
    <>

    {/* <div className="bg-lcard  py-16 dark:bg-dcard">
      <div className="space-y-10 ">
        <div className="px-6">
          <p className=" text-4xl md:text-[60px] leading-normal">انواع درب اتوماتیک</p>
          <p className=" text-md text-lfont">انواع درب اتوماتیک با توجه به نوع کارکرد و محیط مورد نظر و سلیقه به دسته بندی های زیر تقسیم میشوند </p>
        </div>
        <EmblaCarousel 
        options={{ dragFree: true ,direction:'rtl'}}
        buttons={true}
        autoScroll={false}
        >
          {models.map((model)=>(
        <div className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[75%] md:basis-[45%] lg:basis-[25%] min-w-0 pl-4" key={1}>
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
    </div>

      <div className="w-full   py-14 relative bg-gradient-to-t  from-lbtn to-black text-white dark:from-dbtn dark:to-white dark:text-black ">
      <div className="space-y-10 ">
        <div className="text-center">
          <p className="text-4xl md:text-[60px] leading-normal">لوازم درب اتوماتیک</p>
          <p className=" text-md  text-lbtn dark:text-dbtn">آشنایی با لوازم درب اتوماتیک برای خریدی بهتر</p>
        </div>
        <EmblaCarousel 
        options={{ dragFree: true ,direction:'rtl'}}
        buttons={true}
        autoScroll={false}
        >
          {tools.map((tool)=>(
        <div className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[75%] md:basis-[45%] lg:basis-[25%] min-w-0 pl-4" key={1}>
          <Link href={tool.url}>
          <div className="relative w-full h-[200px] md:h-[250px]  ">
            <ImageCom 
            className='object-cover  rounded-xl w-full '
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
     <PostPage params={{title:'شیشه-سکوریت_hi88q0m9of'}}/>
  </div>


    </>
  );
}
