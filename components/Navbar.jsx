"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import Darkmode from "./ui/darkmode";
import { HiMenuAlt4 } from "react-icons/hi";
import { IoBag, IoClose } from "react-icons/io5";
import Search from "@components/search";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from 'sonner'
import Offcanvas from "./ui/offcanvas";
import Banner from "./ui/Banner";
import Profile from "./profile";
import Notifications from "./notifications";
import Sign from "./authenticate/sign";
import { useCart } from '@/hook/useCart';
import { IoPersonSharp } from "react-icons/io5";

const Navbar = () => {
  const { data: session } = useSession();
  const [menu, setMenu] = useState('');
  const path = usePathname();
  const url = path.split("/");
  const [isOnline, setIsOnline] = useState(true);
  const [close, setClose] = useState(false);
  const[isOpen,setIsOpen]=useState(false)
  const { totalItems, hasHydrated, isOnline: cartIsOnline, pendingSyncCount } = useCart();
  useEffect(() => {
    setIsOnline(window.navigator.onLine);
    const handleOnlineStatus = () => {
      setIsOnline(window.navigator.onLine);
    };
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      toast.error("لطفا از اتصال خود به اینترنت مطمئن شوید", {
        duration: 30000,
      });
    }
  }, [isOnline]);

  const items = [
    { id: "1", 
      name: "درب اتوماتیک",
      href:'/posts/درب-های-اتوماتیک_lxi5fhspu7',
    },
    { id: "2", 
      name: "شیشه سکوریت",
      href:'/posts/شیشه-سکوریت-چیست؟-مزایا،-کاربردها-و-تفاوت-با-شیشه-معمولی_b2qh02hbuv',
    },
    { id: "3", 
      name: "شیشه لمینت",
      href:'/posts/شیشه-لمینت:-انواع،-مزایا،-معایب-و-کاربردها-در-ساختمان-و-خودرو-|-راهنمای-جامع_jucfrkg1a7',
    },
    { id: "4", 
      name: "جام بالکن",
      href:'/posts/شیشه-های-بالکنی-و-شیشه-های-ایمنی-برای-پرتگاه-ها:-راهنمای-جامع_4unfbbxaua',
    },
    { id: "5", 
      name: "پارتیشن",
      href:'/posts/پارتیشن-شیشه‌ای:-راهنمای-کامل-نصب،-مزایا،-معایب-و-انواع-|-قیمت-و-طراحی_aqscgthk3m',
    },
    { id: "6", 
      name: "مقاله ها",
      href:'/posts',
    },
    { id: "7", 
      name: "فروشگاه",
      href:'/products',
    },
    { id: "8", 
      name: "درباره ما",
      href:'/about-us',
    },
    { id: "9", 
      name: "لیست قیمت",
      href:'/posts/لیست-قیمت-شیشه-سکوریت-و-شیشه-لمینت-|-۱۴۰۴-۲۰۲۵_skivln562f',
    },
  ];

  return (
      <header className={`  w-full   fixed top-0 z-50`}>

      <Banner />



       <nav className="flex  md:justify-arround bg-white dark:bg-black    justify-between w-full  px-1  lg:px-5 xl:px-14 py-2 border-b-2 border-lcard dark:border-dcard">
          {/* <div className="flex  bg-white dark:bg-black  bg-opacity-85 dark:bg-opacity-90 justify-between md:justify-arround    px-2 md:px-3 xl-px-5 py-2 h-full"> */}
      
            <div className="flex gap-1">

                 <Offcanvas       
                  title={<HiMenuAlt4/>}   
                  onClose={close}
                  btnStyle={"visible lg:hidden  bg-lcard dark:bg-dcard dark:text-white text-lg p-2  rounded-lg text-black"}
                  headerStyle={"flex justify-end"} 
                  position={"top-0 right-0"} size={"h-screen max-w-full w-96 border-l-2 border-l-lcard dark:border-l-dcard "} openTransition={"translate-x-0"} closeTransition={"translate-x-full"}  navbarSetIsOpen={setIsOpen} setMenu={setMenu}>
                
                <button
                     className={" text-lg bg-lcard dark:bg-dcard px-2 py-1  rounded-full border-2 text-lfont "}
                    onClick={() => {setClose(!close) ; setMenu('')}}
                    type="button"
                          >
                        <IoClose/>
                </button>
      



                 <div
            className={`transition-all   duration-[1200ms]  delay-100 ease-in-out w-full px-3 right-0 ${
              isOpen ? "opacity-100 translate-x-0  delay-100 " : "opacity-0 translate-x-full  "
            }`}
          >

              <div className=" flex flex-col space-y-2 w-full">
                {items.map((item,index) => {
                  return (
                      <Link
                        href={item.href}
                        key={item.id}
                        onClick={() => {
                          setClose(!close);
                        }}
                        // onClick={()=>menu === item.name ? setMenu('') :setMenu(item.name)}
                        className="text-2xl font-bold text-right  py-2 px-3 hover:bg-lcard hover:dark:bg-dbtn duration-500 rounded-lg capitalize  w-full"
                      >
                        {/* <FaCaretLeft className="my-auto"/> */}
                        {item.name}
                      </Link>
                  );
                })}

              </div>

                </div>
                 


              





                 </Offcanvas>
                    {/* {session?.user?.role === 'admin' &&   
                                  <>
                                    <div>
                                  <Profile session={session} />

                                    </div>
                                  </>
                    } */}

            {!session ? (
                <div className="my-auto">
                  {/* "h-9 w-9 rounded-xl bg-gradient-to-tr from-blue to-darkgreen cursor-pointer"*/}
                  <Sign session={session} title={<div className="bg-lcard dark:bg-dcard dark:text-white text-lg p-2  rounded-lg text-black"><IoPersonSharp/></div>}/>
                </div>
              ) : (
                <>
                <div className="my-auto">
                  <Profile session={session} />
                </div>
                
                <div>
                  <Notifications/>
                </div>

               <Link href={`/${session?.user.name}/bag`}>
                <div   className={`relative rounded-lg p-2 bg-lcard dark:bg-dcard text-black dark:text-white text-lg`} >       
                  <IoBag className={hasHydrated && totalItems > 0 ? "text-redorange animate-wiggle" : ""} />
 
            {hasHydrated && totalItems > 0 && (
              <div class="px-1 bg-redorange min-w-4 min-h-4 rounded-full text-center text-white text-[10px] leading-[16px] absolute -top-2 end-5 text-nowrap">
                  {totalItems}
              </div>
            )}

              
            {!cartIsOnline && pendingSyncCount > 0 && (
              <div className="px-1 bg-redorange min-w-4 min-h-4 rounded-full text-center text-white text-[10px] leading-[16px] absolute -top-2 end-5 text-nowrap">
              !
              </div>
              )}
                </div>
               </Link>



                </>
              )}






            {!session && 
              <div>
                <Darkmode />
              </div>
            }



           <div>
              <Search session={session}/> 
           </div>



            </div>
            
            <div className="max-lg:hidden lg:flex md:gap-4 my-auto   capitalize font-bold  md:text-sm">
                   {items.map((item,index) => (                   
                      <Link 
                      key={item.id}
                      href={item.href}
                      className={`  duration-300 ${decodeURIComponent(path) === item.href ? 'text-black dark:text-white':'text-lfont hover:text-black dark:hover:text-white'}`}
                      // onClick={()=>menu === item.name ? setMenu('') :setMenu(item.name)}
                      >
                        {item.name}
                      </Link>                    
                     )
                   )}
            </div>
    
            <div>
              <Link
                href="/"
                className="font-blanka text-md text-lfont hover:dark:text-white hover:text-black duration-300"
              >
                ATLAS DOOR
              </Link>
            </div>

          {/* </div> */}
         

        </nav> 





      </header>
  );
};

export default Navbar;





                {/* <div
                className={`transition-all  duration-[1200ms] delay-100 ease-in-out w-full px-5 right-0 ${
                  menu === 'درب اتوماتیک' ? "opacity-100 translate-x-0 fixed delay-1000 " : "opacity-0 translate-x-full absolute "
                }`}
              >
    
                  <div className="space-y-2">
                    <button onClick={()=>setMenu('')}
                      className="text-2xl font-bold text-right  flex justify-between py-2 px-3 hover:bg-lcard hover:dark:bg-dbtn duration-500 rounded-lg capitalize  w-full"
                      >
                        <FaCaretLeft className="my-auto"/>

                        
                     <span> برگشت به منو</span>
                    </button>
                   {items?.map((item)=>(
                     item.titles.map((title)=>(
                       <div className="">
                         <Link className="text-lfont text-sm w-full flex justify-end" href={'/'}>
                         {title.name}
                         </Link>
                         <div className="flex flex-col space-y-3 mt-3">
                      {title?.links?.map((link)=>(
                       <Link  className="text-2xl font-bold text-right  py-2 px-3 hover:bg-lcard hover:dark:bg-dbtn duration-500 rounded-lg capitalize  w-full" href={'/'}>
                         {link.name}
                       </Link>
                      ))}
                         </div>
                       </div>
                     ))
                   ))} 
                   </div>
                </div> */}



{/* <div
    className={` inset-0  transition-opcaity duration-500 ease-in-out max-md:hidden -z-20   ${
      menu ? "fixed backdrop-blur-sm overflow-hidden overscroll-none" : " invisible backdrop-blur-0"
  } `}
    onClick={() => setMenu('')}
 /> */}




{/* <Link
  href={item.link}
                             className={`${
                               path === item.link || url.includes(item.name)
                                 ? "text-purple"  
                                 : "text-lfont  hover:dark:text-white hover:text-black text-[10px] duration-300  "
                             }`}
                           >
                             {item.name}
                           </Link> */}


                                     {/* <div
                     className={`bg-white dark:bg-black  fixed top-0 left-0 p-4 transform space-y-7 offcanvas max-md:hidden
                         ${menu  ? ` translate-y-0 h-fit duration-300` : "-translate-y-full "}   w-full    bg-black transition-transform duration-[350ms] overflow-auto  -z-10 `}
                      >
                     <div className=" w-3/4  text-right mt-14">
                            <div className=" flex justify-end space-x-20  ">

                        {items?.map((item)=>(
                          menu === item.name &&
                          item.titles.map((title)=>(
                            <div className="">
                              <Link className="text-lfont text-sm" href={'/'}>{title.name}</Link>
                              <div className="flex flex-col space-y-3 mt-3">
                           {title.links?.map((link)=>(
                            <Link className="text-xl" href={'/'}>
                              {link?.name}
                            </Link>
                           ))}
                              </div>
                            </div>
                          ))
                        ))}           
                        </div>
                        </div>
          </div> */}
          