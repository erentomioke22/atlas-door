"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import Darkmode from "./ui/darkmode";
import { HiMenuAlt4 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import Search from "@components/search";
import Button from "./ui/button";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from 'sonner'
// import Banner from "./ui/Banner";
import Offcanvas from "./ui/offcanvas";
import Banner from "./ui/Banner";
import Profile from "./profile";

const Navbar = () => {
  const { data: session } = useSession();
  const [menu, setMenu] = useState('');
  const path = usePathname();
  const url = path.split("/");
  const [isOnline, setIsOnline] = useState(true);
  const [close, setClose] = useState(false);
  const[isOpen,setIsOpen]=useState(false)
  
  // console.log(url,path);
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
      href:'/automatic-door',
    },
    { id: "2", 
      name: "کرکره برقی",
      href:'/roller-shutter',
    },
    { id: "3", 
      name: "شیشه بالکنی",
      href:'/balcony-glass',
    },
    { id: "4", 
      name: "شیشه سکوریت",
      href:'/tempered-glass',
    },
    { id: "5", 
      name: "پارتیشن",
      href:'/partition-glass',
    },
    { id: "6", 
      name: "مقاله ها",
      href:'/posts',
    },
    // { id: "11", 
    //   name: "آیینه",
    //   href:'/mirror',
    // },
    // { id: "10", 
    //   name: "UPVC",
    //   href:'/',
    // },
    // { id: "12", 
    //   name: "ضایعات شیشه",
    //   href:'/trash-glass',
    // },
    // { id: "12", 
    //   name: "پنل حورشیدی",
    //   href:'/sun-panel',
    // },
        // { id: "3", 
    //   name: "جک پارکینگ",
    //   href:'/',
    // },
    // { id: "4", 
    //   name: "راهبند پارکینگ",
    //   href:'/',
    // },
    // { id: "6", 
    //   name: "پرده برقی",
    //   href:'/electric-canopies',
    // },
    // { id: "7", 
    //   name: "سایبان برقی",
    //   href:'/electric-canopies',
    // },
    // { id: "13", 
    //   name: "ابزار و یراق",
    //   href:'/',
    // },

  ];

  return (
    <>
      <header className={`  w-full  `}>

        <nav className="fixed w-full backdrop-blur-sm  z-30">
         <Banner />
          <div className="flex  bg-white dark:bg-black  bg-opacity-85 dark:bg-opacity-75 justify-between md:justify-arround    px-2 md:px-3 xl-px-5 py-2 h-full">
          <div className="flex space-x-1 md:space-x-2 ">

                <Offcanvas       
                  title={<HiMenuAlt4/>}   
                  onClose={close}
                  btnStyle={"visible lg:hidden bg-lcard hover:bg-lbtn rounded-full px-3 py-1 duration-500 dark:bg-dcard dark:hover:bg-dbtn text-lfont border-lbtn border dark:border-dbtn"}
                  headerStyle={"flex justify-end"} 
                  position={"top-0 left-0"} size={"h-screen w-full "} openTransition={"translate-x-0"} closeTransition={"translate-x-full"}  navbarSetIsOpen={setIsOpen} setMenu={setMenu}>
                
                <Button
                    className={"my-2"}
                    onClick={() => {setClose(!close) ; setMenu('')}}
                    type="button"
                          >
                        <IoClose/>
                </Button>
      



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
                {/* <button className="text-2xl font-bold text-right  py-2 px-3 hover:bg-lcard hover:dark:bg-dbtn duration-500 rounded-lg capitalize  w-full">
                  TELEGRAM
                </button>
                <button className="text-2xl font-bold text-right  py-2 px-3 hover:bg-lcard hover:dark:bg-dbtn duration-500 rounded-lg capitalize  w-full">
                  INSTAGRAM
                </button>
                <button className="text-2xl font-bold text-right  py-2 px-3 hover:bg-lcard hover:dark:bg-dbtn duration-500 rounded-lg capitalize  w-full">
                  YOUTUBE
                </button> */}
              </div>

                </div>
                 


              





                 </Offcanvas>

              <div>
                <Darkmode />
              </div>

              {session?.user?.role === 'admin' &&   
              <Profile session={session} />
              }

              <Search/> 



            </div>


            
            <div className="max-lg:hidden lg:flex md:gap-4 my-auto   capitalize font-bold  md:text-sm">
                   {items.map((item,index) => (                   
                      <Link 
                      key={item.id}
                      href={item.href}
                      className={`  duration-300 ${path === item.href ? 'text-black dark:text-white':'text-lfont hover:text-black dark:hover:text-white'}`}
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
          </div>
         
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
        </nav>








      {/* <div
          className={` inset-0  transition-opcaity duration-500 ease-in-out max-md:hidden -z-20   ${
            menu ? "fixed backdrop-blur-sm overflow-hidden overscroll-none" : " invisible backdrop-blur-0"
        } `}
          onClick={() => setMenu('')}
       /> */}
      </header>

    </>
  );
};

export default Navbar;
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