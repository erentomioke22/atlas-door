import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BiSearchAlt } from "react-icons/bi";
import Dropdown from "./ui/dropdown";
import LoadingSearch from "./ui/loading/loadingSearch";
import Link from 'next/link';
import ImageCom from "./ui/Image";
import Input from "./ui/input";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  
useEffect(()=>{
  if(open){
    document.body.style.overflow = 'hidden'
  }
  else{
    document.body.style.overflow = 'auto'
  }
},[open])

// useEffect(()=>{
//  setOpen(false)
// },[onClose])


  const {
    data: posts,
    status,
    isFetching,
  } = useQuery({
    queryKey: ["post search", searchValue],
    enabled: searchValue.length >= 1,
    queryFn: async () => {
      const response = await axios.get(
        `/api/search?searchQuery=${searchValue}`
      );
      return response.data;
    },
  });
  // console.log(posts);

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target.value;
    // console.log(form);
  }

  return (

  <Dropdown title={<BiSearchAlt />} className={' -right-[90px] sm:right-0   bg-white dark:bg-black w-72 sm:w-96  border-2 border-lbtn dark:border-dbtn px-3 max-h-62 overflow-auto shadow-sm'} 
  btnStyle={'bg-lcard hover:bg-lbtn rounded-full px-3 py-1 duration-500 dark:bg-dcard dark:hover:bg-dbtn  border-lbtn border dark:border-dbtn'}>
  <div className="space-y-5">
  <h1 className={" text-xl "}>
            جستجو
          </h1>
     <form onSubmit={handleSubmit} className="bg-white dark:bg-black border-lbtn  rounded-lg space-x-1 ">
         {/* <span className="text-lfont max-md:text-sm  my-auto ml-2">
           <BiSearchAlt />
         </span> */}
         <Input
           placeholder="جستجو..."
           type="text"
           name="search"
           onChange={(e) => {
             setSearchValue(e.target.value);
           }}
           value={searchValue || ""}
         />
     </form>

     {status === "success" && !posts?.length  && (
       <p className="text-center text-sm text-lfont">
         هیچ پستی با این نام هنوز وجود ندارد
       </p>
     )}

     {searchValue?.length <= 0 && !posts?.length && (
       <p className="text-center text-sm text-lfont">
        اسم مطلب یا محصولی که دنبالش هستید رو بنویسید
       </p>
     )}

     {status === "error" && (
       <p className="text-center ttext-sm text-lfont">
         مشکلی در برقراری ارتباط پیش آمده
       </p>
     )}
     <div className="relative w-full  px-3 space-y-5 ">
       {status === "pending" && isFetching
         ? Array(3)
             .fill({})
             .map((_,index) => (
               <LoadingSearch key={index}/>
             )
             )
         : posts?.map((post) => (
             <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post?.link}`} key={post?.id}>
                <div className="p-2 w-full mx-auto ">
                          <div className=' flex gap-2'>
                            <div className="relative w-[40px] h-[40px]">
                              <ImageCom src={post?.images[0].startsWith('https://')?  `${post?.images[0]}` : `${process.env.NEXT_PUBLIC_BASE_URL}${post?.images[0]}`} className="rounded-lg bg-lbtn dark:bg-dbtn  h-10 w-10" alt={'thumnail'} />
                            </div>
                              
                              <div className="flex-1 space-y-1">
                                <p className="text-lfont text-sm">{post?.user.displayName}</p>      
                                <p className="text-sm line-clamp-1 hover:underline underline-offset-2 decoration-2 duration-100">{post?.title}</p>           
                              </div>
                          </div>
                     </div>
             </Link>
           ))}
     </div>
     </div>
  </Dropdown>


  );
};

export default Search;
