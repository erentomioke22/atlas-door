// import Link from "next/link";
// import EmblaCarousel from "@components/ui/carousel/carousel";
// import { FaCaretRight } from "react-icons/fa6";
// import ImageCom from "@components/ui/Image";
import PostPage from "@components/posts/postPage";


export const metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/automatic-door`),
  title :"درب‌های اتوماتیک - انواع درب‌های اتوماتیک با نصب حرفه‌ای و خدمات پس از فروش",
  description:"فروش و نصب درب‌های اتوماتیک با کیفیت بالا و امنیت بیشتر. ارائه بهترین خدمات نصب و تعمیر درب‌های اتوماتیک. مشاوره و بازدید رایگان.",
  keywords:"درب‌های اتوماتیک, فروش درب‌های اتوماتیک, نصب درب‌های اتوماتیک, تعمیر درب‌های اتوماتیک, درب‌های خودکار, درب‌های حفاظتی, درب‌های امنیتی, درب برای منازل, درب برای کسب‌وکارها, قیمت درب‌های اتوماتیک, خدمات پس از فروش درب‌های اتوماتیک, مشاوره درب‌های اتوماتیک, خرید درب‌های اتوماتیک",
  twitter:{
   card:'summary_large_image'
  },
  openGraph:{
    title :"درب‌های اتوماتیک - انواع درب‌های اتوماتیک با نصب حرفه‌ای و خدمات پس از فروش",
    description:"فروش و نصب درب‌های اتوماتیک با کیفیت بالا و امنیت بیشتر. ارائه بهترین خدمات نصب و تعمیر درب‌های اتوماتیک. مشاوره و بازدید رایگان.",
    keywords:"درب‌های اتوماتیک, فروش درب‌های اتوماتیک, نصب درب‌های اتوماتیک, تعمیر درب‌های اتوماتیک, درب‌های خودکار, درب‌های حفاظتی, درب‌های امنیتی, درب برای منازل, درب برای کسب‌وکارها, قیمت درب‌های اتوماتیک, خدمات پس از فروش درب‌های اتوماتیک, مشاوره درب‌های اتوماتیک, خرید درب‌های اتوماتیک",
    type:"website",
    locale:"fa_IR",
    url:`${process.env.NEXT_PUBLIC_BASE_URL}/automatic-door`,
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
  //     url:'/fvbrgb',
  //     image:'/images/automatic-door/accessories/strap/1732004919019.jpg'
  //   },
  //   {
  //     name:'هنگر',
  //     url:'/bg',
  //     image:'/images/automatic-door/accessories/hanger/1732004919001.jpg'
  //   },
  //   {
  //     name:'چشمی',
  //     url:'/ b',
  //     image:'/images/automatic-door/accessories/sensor/1732004918980.jpg'
  //   },
  //   {
  //     name:'موتور',
  //     url:'/db',
  //     image:'/images/automatic-door/accessories/motor/1732004918954.jpg'
  //   },
  //   {
  //     name:'قفل',
  //     url:'/nhjm',
  //     image:'/images/automatic-door/accessories/lock/1732004918925.jpg'
  //   },
  //   {
  //     name:'ریموت',
  //     url:'/xgb',
  //     image:'/images/automatic-door/accessories/remote/1732004918995.jpg'
  //   },
  //   {
  //     name:'اپراتور',
  //     url:'/zf',
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
     <PostPage params={{title:'درب-اتوماتیک_k474nwj6qb'}}/>
  </div>


    </>
  );
}

