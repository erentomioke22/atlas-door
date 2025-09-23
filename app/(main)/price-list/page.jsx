// app/about-us/page.js
import ImageCom from '@components/ui/Image';
import Image from 'next/image';
import Link from 'next/link';
import { FaBolt,FaLightbulb ,FaHandshake ,FaWandMagicSparkles ,FaStar ,FaArrowLeftLong } from "react-icons/fa6";
import Tabs from '@components/ui/tabs';
import { notFound } from 'next/navigation';


export const metadata = {
  title: ' لیست قیمت شیشه سکوریت و لمینت - اطلس در',
  description: 'لیست قیمت شیشه سکوریت و شیشه لمینت',
};

export default function PriceList() {

  notFound()

  const tabs = [
    {
      label: 'شیشه سکوریت',
      // icon: <FaHandshake className="w-4 h-4" />,
      content: (
        <div className="relative w-full h-[1200px]">
          <ImageCom src="/images/logo/atlasDoor.png"/>
        </div>
      ),
    },
    {
      label: 'شیشه لمینت',
      // icon: <FaHandshake className="w-4 h-4" />,
      content: (
        <div className="relative w-full h-[1200px]">
          <ImageCom src="/images/logo/atlasDoor.png"/>
        </div>
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
    <div className="min-h-screen  py-8">
      <div className="container mx-auto px-4 max-w-6xl">

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
        </header>

          <div>
            <Tabs tabs={tabs.slice(0, 3)} variant="pills" className={"w-full"}/>
          </div>

      </div>
    </div>
  );
}