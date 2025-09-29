// app/about-us/page.js
import ImageCom from '@components/ui/Image';
import Image from 'next/image';
import Link from 'next/link';
import { FaBolt,FaLightbulb ,FaHandshake ,FaWandMagicSparkles ,FaStar ,FaArrowLeftLong } from "react-icons/fa6";
import { notFound } from 'next/navigation';
import Tabs from '@components/ui/Tabs';
import React from 'react';
export const metadata = {
  title: 'لیست قیمت شیشه سکوریت و لمینت ۱۴۰۴ | نصب و اجرا | اطلس در',
  description: 'لیست قیمت به‌روز شیشه سکوریت و شیشه لمینت با نصب حرفه‌ای. بهترین قیمت بازار با گارانتی کیفیت. مشاوره رایگان',
  keywords: 'قیمت شیشه سکوریت, قیمت شیشه لمینت, نصب شیشه سکوریت, اجرای شیشه لمینت',
};

export default function PriceList() {

  notFound()
  // const priceData = [
  //   {
  //     category: "شیشه سکوریت 10 میله",
  //     products: [
  //       { title: "شیشه سکوریت 10 میله سوپرکلیر (شفاف)", urgent: "-", threeDays: "1,750,000", fiveDays: "1,550,000", oneDay: "1,530,000" },
  //       { title: "شیشه سکوریت 10 میله قلوت (سفید)", urgent: "890,000", threeDays: "840,000", fiveDays: "850,000", oneDay: "850,000" },
  //       { title: "شیشه سکوریت 10 میله برزز", urgent: "-", threeDays: "1,380,000", fiveDays: "1,340,000", oneDay: "1,300,000" },
  //       { title: "شیشه سکوریت 10 میله دودی", urgent: "-", threeDays: "1,480,000", fiveDays: "1,440,000", oneDay: "1,400,000" },
  //       { title: "شیشه سکوریت 10 میله سانتیا", urgent: "-", threeDays: "1,480,000", fiveDays: "1,440,000", oneDay: "1,400,000" }
  //     ]
  //   },
  //   {
  //     category: "شیشه سکوریت 8 میله",
  //     products: [
  //       { title: "شیشه سکوریت 8 میله سوپرکلیر (شفاف)", urgent: "-", threeDays: "990,000", fiveDays: "970,000", oneDay: "950,000" },
  //       { title: "شیشه سکوریت 8 میله قلوت (سفید)", urgent: "-", threeDays: "790,000", fiveDays: "770,000", oneDay: "750,000" },
  //       { title: "شیشه سکوریت 8 میله برزز", urgent: "-", threeDays: "1,180,000", fiveDays: "1,140,000", oneDay: "1,100,000" },
  //       { title: "شیشه سکوریت 8 میله دودی", urgent: "-", threeDays: "1,280,000", fiveDays: "1,240,000", oneDay: "1,200,000" },
  //       { title: "شیشه سکوریت 8 میله سانتیا", urgent: "-", threeDays: "1,280,000", fiveDays: "1,240,000", oneDay: "1,200,000" }
  //     ]
  //   },
  //   {
  //     category: "شیشه سکوریت 7 میله",
  //     products: [
  //       { title: "شیشه سکوریت 7 میله سوپرکلیر (شفاف)", urgent: "-", threeDays: "870,000", fiveDays: "840,000", oneDay: "820,000" },
  //       { title: "شیشه سکوریت 7 میله قلوت (سفید)", urgent: "-", threeDays: "760,000", fiveDays: "740,000", oneDay: "720,000" },
  //       { title: "شیشه سکوریت 7 میله برزز", urgent: "-", threeDays: "910,000", fiveDays: "960,000", oneDay: "870,000" },
  //       { title: "شیشه سکوریت 7 میله دودی", urgent: "-", threeDays: "1,050,000", fiveDays: "1,010,000", oneDay: "970,000" },
  //       { title: "شیشه سکوریت 7 میله سانتیا", urgent: "-", threeDays: "1,250,000", fiveDays: "1,260,000", oneDay: "1,120,000" }
  //     ]
  //   },
  //   {
  //     category: "شیشه سکوریت 5 میله",
  //     products: [
  //       { title: "شیشه سکوریت 5 میله سوپرکلیر (شفاف)", urgent: "-", threeDays: "840,000", fiveDays: "860,000", oneDay: "800,000" },
  //       { title: "شیشه سکوریت 5 میله قلوت (سفید)", urgent: "-", threeDays: "740,000", fiveDays: "740,000", oneDay: "700,000" },
  //       { title: "شیشه سکوریت 5 میله برزز", urgent: "-", threeDays: "-", fiveDays: "-", oneDay: "-" },
  //       { title: "شیشه سکوریت 5 میله دودی", urgent: "-", threeDays: "1,000,000", fiveDays: "970,000", oneDay: "920,000" }
  //     ]
  //   },
  //   {
  //     category: "خدمات اضافی",
  //     products: [
  //       { title: "اجرت سوراخ 15-20 مته (30-40 عدد)", urgent: "50,000", threeDays: "", fiveDays: "", oneDay: "" },
  //       { title: "اجرت سوراخ 45-60 مته (40-50 عدد)", urgent: "70,000", threeDays: "", fiveDays: "", oneDay: "" },
  //       { title: "هزار شیشه", urgent: "هزار تومن", threeDays: "", fiveDays: "", oneDay: "" },
  //       { title: "هزار شیشه", urgent: "هزار تومن", threeDays: "", fiveDays: "", oneDay: "" }
  //     ]
  //   }
  // ];

  const tableData = [
    {
      thickness: "10 میل",
      types: [
        { name: "سوپرکلیر (شفاف)", urgent: "-", day3: "1,050,000", day5: "1,050,000", day10: "1,053,000" },
        { name: "فلوت (سفید)", urgent: "890,000", day3: "840,000", day5: "860,000", day10: "850,000" },
        { name: "برنز", urgent: "-", day3: "1,380,000", day5: "1,380,000", day10: "1,300,000" },
        { name: "دودی", urgent: "-", day3: "1,480,000", day5: "1,480,000", day10: "1,400,000" },
        { name: "ساتینا", urgent: "-", day3: "1,480,000", day5: "1,480,000", day10: "1,400,000" }
      ]
    },
    {
      thickness: "8 میل",
      types: [
        { name: "سوپرکلیر (شفاف)", urgent: "-", day3: "990,000", day5: "970,000", day10: "950,000" },
        { name: "فلوت (سفید)", urgent: "-", day3: "790,000", day5: "770,000", day10: "750,000" },
        { name: "برنز", urgent: "-", day3: "1,180,000", day5: "1,180,000", day10: "1,150,000" },
        { name: "دودی", urgent: "-", day3: "1,280,000", day5: "1,280,000", day10: "1,300,000" },
        { name: "ساتینا", urgent: "-", day3: "1,280,000", day5: "1,280,000", day10: "1,300,000" }
      ]
    },
    {
      thickness: "6 میل",
      types: [
        { name: "سوپرکلیر (شفاف)", urgent: "-", day3: "870,000", day5: "860,000", day10: "860,000" },
        { name: "فلوت (سفید)", urgent: "-", day3: "760,000", day5: "740,000", day10: "740,000" },
        { name: "برنز", urgent: "-", day3: "915,000", day5: "895,000", day10: "870,000" },
        { name: "دودی", urgent: "-", day3: "1,050,000", day5: "1,050,000", day10: "970,000" },
        { name: "ساتینا", urgent: "-", day3: "1,200,000", day5: "1,200,000", day10: "1,130,000" }
      ]
    },
    {
      thickness: "5 میل",
      types: [
        { name: "سوپرکلیر (شفاف)", urgent: "-", day3: "840,000", day5: "860,000", day10: "850,000" },
        { name: "فلوت (سفید)", urgent: "-", day3: "740,000", day5: "740,000", day10: "750,000" },
        { name: "برنز", urgent: "-", day3: "-", day5: "-", day10: "-" },
        { name: "دودی", urgent: "-", day3: "1,000,000", day5: "970,000", day10: "970,000" }
      ]
    },
    {
      thickness: "4 میل",
      types: [
        { name: "سوپرکلیر (شفاف)", urgent: "-", day3: "-", day5: "-", day10: "-" },
        { name: "فلوت (سفید)", urgent: "-", day3: "-", day5: "-", day10: "-" },
        { name: "برنز", urgent: "-", day3: "-", day5: "-", day10: "-" },
        { name: "دودی", urgent: "-", day3: "-", day5: "-", day10: "-" }
      ]
    }
  ];

  const serviceData = [
    { price: "50,000", description: "اجرت سوراخ ها از مته ۳۰ تا ۴۰" },
    { price: "70,000", description: "اجرت سوراخ ها از مته ۴۰ تا ۵۰" },
    { price: "70,000", description: "اجرت سوراخ ها از مته ۵۰ تا ۶۰" },
    { price: "استعلام بگیرید", description: "اجرت سوراخ ها بیشتر از مته ۶۰" },
    { price: "استعلام بگیرید", description: "اجرت جاساز گیشه" },
    { price: "مساحت شیشه * 200 هزار تومن", description: "اجرت جاساز گوشه ی شیشه" },
    { price: "مساحت شیشه * 300 هزار تومن", description: "اجرت جاساز وسط شیشه" }
  ];



  const tableLaminetData = [
    {
      thickness: "10 میل",
      types: [
        { name: "سوپرکلیر (شفاف)", urgent: "-", day3: "1,050,000", day5: "1,050,000", day10: "1,053,000" },
        { name: "فلوت (سفید)", urgent: "890,000", day3: "840,000", day5: "860,000", day10: "850,000" },
        { name: "برنز", urgent: "-", day3: "1,380,000", day5: "1,380,000", day10: "1,300,000" },
        { name: "دودی", urgent: "-", day3: "1,480,000", day5: "1,480,000", day10: "1,400,000" },
        { name: "ساتینا", urgent: "-", day3: "1,480,000", day5: "1,480,000", day10: "1,400,000" }
      ]
    },
    {
      thickness: "8 میل",
      types: [
        { name: "سوپرکلیر (شفاف)", urgent: "-", day3: "990,000", day5: "970,000", day10: "950,000" },
        { name: "فلوت (سفید)", urgent: "-", day3: "790,000", day5: "770,000", day10: "750,000" },
        { name: "برنز", urgent: "-", day3: "1,180,000", day5: "1,180,000", day10: "1,150,000" },
        { name: "دودی", urgent: "-", day3: "1,280,000", day5: "1,280,000", day10: "1,300,000" },
        { name: "ساتینا", urgent: "-", day3: "1,280,000", day5: "1,280,000", day10: "1,300,000" }
      ]
    },
    {
      thickness: "6 میل",
      types: [
        { name: "سوپرکلیر (شفاف)", urgent: "-", day3: "870,000", day5: "860,000", day10: "860,000" },
        { name: "فلوت (سفید)", urgent: "-", day3: "760,000", day5: "740,000", day10: "740,000" },
        { name: "برنز", urgent: "-", day3: "915,000", day5: "895,000", day10: "870,000" },
        { name: "دودی", urgent: "-", day3: "e;klmthm erljm rmyjl rmtjlm rtlyjmlr tmyjlrkyj", day5: "lwmne;thm ;wmeh;mw;tmj wemtjmlerwtjmlemrtj merltj m", day10: "970,000" },
        { name: "ساتینا", urgent: "-", day3: "1,200,000", day5: "1,200,000", day10: "1,130,000" }
      ]
    },
    {
      thickness: "5 میل",
      types: [
        { name: "سوپرکلیر (شفاف)", urgent: "-", day3: "840,000", day5: "860,000", day10: "850,000" },
        { name: "فلوت (سفید)", urgent: "-", day3: "740,000", day5: "740,000", day10: "750,000" },
        { name: "برنز", urgent: "-", day3: "-", day5: "-", day10: "-" },
        { name: "دودی", urgent: "-", day3: "1,000,000", day5: "970,000", day10: "970,000" }
      ]
    },
    {
      thickness: "4 میل",
      types: [
        { name: "سوپرکلیر (شفاف)", urgent: "-", day3: "-", day5: "-", day10: "-" },
        { name: "فلوت (سفید)", urgent: "-", day3: "-", day5: "-", day10: "-" },
        { name: "برنز", urgent: "-", day3: "-", day5: "-", day10: "-" },
        { name: "دودی", urgent: "-", day3: "-", day5: "-", day10: "-" }
      ]
    }
  ];

  const serviceLaminetData = [
    { price: "50,000", description: "طلق هوشمند" },
    { price: "70,000", description: "طلق ۱.۵۲" },
    { price: "70,000", description: "طلق ۰.۷۶" },
    { price: "استعلام بگیرید", description: "طلق مشکی" },
    { price: "استعلام بگیرید", description: "طلق رنگی" },
  ];


  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'فروش و نصب شیشه سکوریت و لمینت',
    description: 'لیست قیمت شیشه سکوریت و لمینت با نصب حرفه‌ای',
    provider: {
      '@type': 'LocalBusiness',
      name: 'اطلس در'
    }
  };

  const tabs = [
    {
      label: 'شیشه سکوریت',
      // icon: <FaHandshake className="w-4 h-4" />,
      content: (
        <>
        <div className="overflow-x-auto max-w-5xl mx-auto ">
          <table className="w-full border-collapse border border-lfont text-sm bg-lcard dark:bg-dcard">
            <thead>
            </thead>
              <tr className="bg-lbtn dark:bg-dbtn">
                <th className="border border-lfont p-2 font-bold">عنوان</th>
                <th className="border border-lfont p-2 font-bold">8 الی 10 روز </th>
                <th className="border border-lfont p-2 font-bold">4 الی 5 روز </th>
                <th className="border border-lfont p-2 font-bold">2 الی 3 روز </th>
                <th className="border border-lfont p-2 font-bold">فوری- ساعتی</th>
              </tr>
            <tbody>
              {tableData.map((section, sectionIndex) => (
                <React.Fragment key={sectionIndex}>
                  {section.types.map((type, typeIndex) => (
                    <tr key={`${sectionIndex}-${typeIndex}`} className="">
                      <td className="border border-lfont p-2">
                        {/* {typeIndex === 0 ? `شیشه سکوریت ${section.thickness} ${type.name}` : type.name} */}
                        { `شیشه سکوریت ${section.thickness} ${type.name}` }
                      </td>
                      <td className="border border-lfont p-2 text-center">{type.day10}</td>
                      <td className="border border-lfont p-2 text-center">{type.day5}</td>
                      <td className="border border-lfont p-2 text-center">{type.day3}</td>
                      <td className="border border-lfont p-2 text-center">{type.urgent}</td>
                    </tr>
                  ))}
                  {sectionIndex < tableData.length - 1 && (
              <tr className="bg-lbtn dark:bg-dbtn">
                <th className="border border-lfont p-2 font-bold">عنوان</th>
                <th className="border border-lfont p-2 font-bold">8 الی 10 روز </th>
                <th className="border border-lfont p-2 font-bold">4 الی 5 روز </th>
                <th className="border border-lfont p-2 font-bold">2 الی 3 روز </th>
                <th className="border border-lfont p-2 font-bold">فوری- ساعتی</th>
              </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-lcard dark:bg-dcard text-sm">
              <thead>
                <tr className="bg-lbtn dark:bg-dbtn">
                  <th className="border border-lfont p-2 font-bold">عنوان</th>
                  <th className="border border-lfont p-2 font-bold">اجرت</th>
                </tr>
              </thead>
              <tbody>
                {serviceData.map((service, index) => (
                  <tr key={index} className="hover:bg-green-50">
                    <td className="border border-lfont p-2">{service.description}</td>
                    <td className="border border-lfont p-2 text-center">{service.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </>
      ),
    },
    {
      label: 'شیشه لمینت',
      // icon: <FaHandshake className="w-4 h-4" />,
      content: (
        <>
        <div className="overflow-x-auto max-w-5xl mx-auto ">
          <table className="w-full border-collapse border border-lfont text-sm bg-lcard dark:bg-dcard">
            <thead>
            </thead>
              <tr className="bg-lbtn dark:bg-dbtn">
                <th className="border border-lfont p-2 font-bold">عنوان</th>
                <th className="border border-lfont p-2 font-bold">8 الی 10 روز </th>
                <th className="border border-lfont p-2 font-bold">4 الی 5 روز </th>
                <th className="border border-lfont p-2 font-bold">2 الی 3 روز </th>
                <th className="border border-lfont p-2 font-bold">فوری- ساعتی</th>
              </tr>
            <tbody>
              {tableLaminetData.map((section, sectionIndex) => (
                <React.Fragment key={sectionIndex}>
                  {section.types.map((type, typeIndex) => (
                    <tr key={`${sectionIndex}-${typeIndex}`} className="">
                    <td className="border border-lfont p-2">
                      {/* {typeIndex === 0 ? `شیشه سکوریت ${section.thickness} ${type.name}` : type.name} */}
                      { `شیشه سکوریت ${section.thickness} ${type.name}` }
                    </td>
                    <td className="border border-lfont p-2 text-center">{type.day10}</td>
                    {sectionIndex=== 0 && typeIndex === 0 &&
                    <>
                    <td className="border px-4 py-2 max-w-20" rowSpan={29}>۵٪ به قیمت هر متر شيشه لمينت اضافه ميگردد</td>
                    <td className="border px-4 py-2 max-w-20" rowSpan={29}>١٥٪ به قيمت هر متر شيشه لمينت اضافه ميگردد</td>
                    <td className="border px-4 py-2 max-w-20" rowSpan={29}>١٥٪ به قيمت هر متر شيشه لمينت اضافه ميكردد</td>
                    </>
                    }
                  </tr>
                  ))}
                  {sectionIndex < tableData.length - 1 && (
              <tr className="bg-lbtn dark:bg-dbtn">
                <th className="border border-lfont p-2 font-bold">عنوان</th>
                <th className="border border-lfont p-2 font-bold">8 الی 10 روز </th>
                {/* <th className="border border-lfont p-2 font-bold">4 الی 5 روز </th>
                <th className="border border-lfont p-2 font-bold">2 الی 3 روز </th>
                <th className="border border-lfont p-2 font-bold">فوری- ساعتی</th> */}
              </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-lcard dark:bg-dcard text-sm">
              <thead>
                <tr className="bg-lbtn dark:bg-dbtn">
                  <th className="border border-lfont p-2 font-bold">طلق</th>
                  <th className="border border-lfont p-2 font-bold">قیمت</th>
                </tr>
              </thead>
              <tbody>
                {serviceLaminetData.map((service, index) => (
                  <tr key={index} className="hover:bg-green-50">
                    <td className="border border-lfont p-2">{service.description}</td>
                    <td className="border border-lfont p-2 text-center">{service.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </>
      ),
    },
    // {
    //   label: 'Notifications',
    //   icon: <FaHandshake className="w-4 h-4" />,
    //   disabled: true,
    //   content: (
    //     <div className="p-6 bg-white rounded-lg shadow-sm border">
    //       <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
    //       <p className="text-gray-600">Manage your notification preferences.</p>
    //     </div>
    //   ),
    // },
  ];



  return (
    <>
          <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="min-h-screen  py-8">
      <div className="container mx-auto px-4 max-w-5xl">

        <header className="text-center mb-12">

          <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          <div className="flex justify-between  mt-16">
              <h1 className="text-2xl">لیست قیمت</h1>

                     <Link
 href="/" className="flex text-sm my-auto"
                               >
                                بازگشت
                                <FaArrowLeftLong className="my-auto "/>
                         </Link>
          </div>
          <h6 className='text-sm text-start'>تاریخ آخرین تغییر: 1404/07/02</h6>

        </header>

          <div>
            <Tabs tabs={tabs.slice(0, 3)} variant="pills" className={"w-full"}/>
          </div>

      </div>
    </div>
    </>
  );
}

