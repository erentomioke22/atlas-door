import Image from 'next/image';
import Link from 'next/link';
import { FaTelegram } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { FaBolt, FaLightbulb, FaHandshake, FaWandMagicSparkles, FaStar, FaArrowLeftLong } from "react-icons/fa6";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'درباره ما | شرکت اطلس در | تولید کننده شیشه سکوریت و لمینت',
  description: 'شرکت اطلس در با ۲۰ سال تجربه در تولید و نصب شیشه های سکوریت و لمینت. کیفیت عالی، قیمت مناسب و خدمات پس از فروش مطمئن',
  keywords: 'شیشه سکوریت, شیشه لمینت, نصب شیشه, تولید شیشه, شرکت اطلس در, درباره ما',
  openGraph: {
    title: 'درباره شرکت اطلس در | تخصص در شیشه های سکوریت و لمینت',
    description: '۲۰ سال تجربه در تولید و نصب شیشه های ایمنی با کیفیت عالی',
    type: 'website',
    locale: 'fa_IR'
  }
};

// Define JSON-LD structure type
interface JsonLdData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  logo: string;
  foundingDate: string;
  address: {
    '@type': string;
    addressCountry: string;
    addressRegion: string;
    addressLocality: string;
  };
  contactPoint: {
    '@type': string;
    telephone: string;
    contactType: string;
  };
  sameAs: string[];
}

export default function AboutUs() {
  const jsonLd: JsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'شرکت اطلس در',
    description: 'تولید کننده و مجری شیشه های سکوریت و لمینت با ۲۰ سال سابقه',
    url: 'https://atlasdoors,ir',
    logo: 'https://atlasdoors,ir/images/logo/atlasDoor.png',
    foundingDate: '2004',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IR',
      addressRegion: 'تهران',
      addressLocality: 'تهران'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+98-21-55589837',
      contactType: 'پشتیبانی'
    },
    sameAs: [
      'https://t.me/Atlasdoor96',
      'https://www.instagram.com/atlasshishe96'
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen  py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="flex justify-between  mt-16">
              <h1 className="text-2xl">درباره ما</h1>
              <Link href="/" className="flex text-sm my-auto">
                بازگشت
                <FaArrowLeftLong className="my-auto " />
              </Link>
            </div>
          </header>

          <div className=" gap-10 mb-16">
            {/* Company Info */}
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl font-semibold  mb-4">داستان ما</h1>
              <p className="text-gray-700 leading-8 mb-6 ">
                شرکت اطلس در با بیش از ۲۰ سال تجربه در زمینه تولید و فروش شیشه های سکوریت و ابزارآلات مربوطه، 
                همواره کیفیت و رضایت مشتری را در اولویت اول خود قرار داده است. ما با بهره‌گیری از تکنولوژی‌های 
                روز دنیا و نیروی متخصص، محصولاتی با کیفیت عالی و استانداردهای بین‌المللی تولید می‌کنیم.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6 max-w-xl">
                <div className="bg-lcard dark:bg-dcard p-4 rounded-xl ">
                  <div className="text-neutral-500 dark:text-neutral-300 text-xl font-bold">۵۰۰۰+</div>
                  <div className="">مشتری راضی</div>
                </div>
                <div className="bg-lcard dark:bg-dcard p-4 rounded-xl ">
                  <div className="text-neutral-500 dark:text-neutral-300 text-xl font-bold">۱۰۰+</div>
                  <div className="">محصول متنوع</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission and Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-6 rounded-2xl ">
              <div className="flex items-center mb-4 gap-2 text-2xl">
                <FaBolt className='text-yellow'/>
                <h3 className="text-xl font-semibold ">ماموریت ما</h3>
              </div>
              <p>
                ارائه محصولات با کیفیت و ایمن در زمینه شیشه های سکوریت به همراه ابزارآلات تخصصی، 
                تا مشتریان ما با اطمینان خاطر از محصولات ما استفاده کنند و فضایی امن و زیبا ایجاد نمایند.
              </p>
            </div>

            <div className="p-6 rounded-2xl ">
              <div className="flex items-center mb-4 gap-2 text-2xl">
                <FaLightbulb className='text-yellow'/>
                <h3 className="text-xl font-semibold ">چشم انداز</h3>
              </div>
              <p className="text-gray-700">
                تبدیل شدن به برند پیشرو در صنعت شیشه های سکوریت در منطقه و گسترش فعالیت‌های خود 
                به بازارهای بین‌المللی با حفظ استانداردهای کیفیت و نوآوری در تولید محصولات.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-center  mb-8">ارزش‌های ما</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-lcard dark:bg-dcard p-6 rounded-2xl  text-center">
                <FaStar className='text-yellow mx-auto mb-5 text-4xl'/>
                <h3 className="text-lg font-semibold mb-2">کیفیت</h3>
                <p className="text-gray-600">تضمین کیفیت برتر در تمامی محصولات و خدمات ارائه شده</p>
              </div>

              <div className="bg-lcard dark:bg-dcard p-6 rounded-2xl  text-center">
                <FaHandshake className='text-darkgreen mx-auto mb-5 text-4xl'/>
                <h3 className="text-lg font-semibold mb-2">رضایت مشتری</h3>
                <p className="text-gray-600">اولویت دادن به رضایت و اعتماد مشتریان در تمامی تعاملات</p>
              </div>

              <div className="bg-lcard dark:bg-dcard p-6 rounded-2xl  text-center">
                <FaWandMagicSparkles className='text-purple mx-auto mb-5 text-4xl'/>
                <h3 className="text-lg font-semibold mb-2">نوآوری</h3>
                <p className="text-gray-600">توسعه مستمر محصولات و خدمات با استفاده از تکنولوژی‌های روز</p>
              </div>
            </div>
          </div>

          <div className='my-20 space-y-10'>
            <h1 className="text-2xl md:text-3xl font-semibold text-center  ">پلتفرم ها و شبکه های اجتماعی ما</h1>
            <div className='flex flex-wrap justify-center gap-5 md:gap-7 mt-3 text-2xl md:text-4xl'>
              <a href="https://eitaa.com/Atlasdoor96" target="_blank" rel="noopener noreferrer" title='eitaa'>
                <Image src="/icon/eitaa.svg" width={36} height={36} className="size-6 md:size-9" alt="Eitaa Icon" />
              </a>
              <a href="https://rubika.ir/Atlasdoor96" target="_blank" rel="noopener noreferrer" title='eitaa'>
                <Image src="/icon/rubika.svg" width={36} height={36} className="size-6 md:size-9" alt="Rubika Icon" />
              </a>
              <a className='text-blue duration-500' href="https://t.me/Atlasdoor96" target="_blank" rel="noopener noreferrer" title='telegram'><FaTelegram /></a>
              <a className='text-[violet] duration-500' href="https://www.instagram.com/atlasshishe96" target="_blank" rel="noopener noreferrer" title='instagram'><FiInstagram /></a>
              <a className='text-darkgreen duration-500' href="https://wa.me/+989334922498" target="_blank" rel="noopener noreferrer" title='whatsapp'><FaWhatsapp /></a>
            </div>
          </div>

          {/* CTA */}
          <div className=" rounded-2xl p-8 md:p-12 text-center  mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">آماده همکاری با ما هستید؟</h2>
            <p className="mb-6 max-w-2xl mx-auto">برای دریافت مشاوره رایگان و اطلاعات بیشتر درباره محصولات ما با ما تماس بگیرید</p>
          </div>
        </div>
      </div>
    </>
  );
}