import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BiSearchAlt } from "react-icons/bi";
import Dropdown from "./ui/dropdown";
import LoadingSearch from "./ui/loading/loadingSearch";
import Link from 'next/link';
import ImageCom from "./ui/Image";

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

  <Dropdown title={<BiSearchAlt />} className={' -right-[140px] sm:right-0   bg-lcard dark:bg-dcard w-72 sm:w-96  border border-lbtn dark:border-dbtn px-3 max-h-62 overflow-auto'} 
  btnStyle={'bg-lcard hover:bg-lbtn rounded-full px-3 py-1 duration-500 dark:bg-dcard dark:hover:bg-dbtn text-lfont border-lbtn border dark:border-dbtn'}>
  <div className="space-y-5">
     
     <form onSubmit={handleSubmit} className="bg-white dark:bg-black border-lbtn  rounded-lg space-x-1 flex">
         <span className="text-lfont max-md:text-sm  my-auto ml-2">
           <BiSearchAlt />
         </span>
         <input
           placeholder="اسم مطلب یا محصولی که دنبالش هستید رو بنویسید"
           type="text"
           name="search"
           onChange={(e) => {
             setSearchValue(e.target.value);
           }}
           value={searchValue || ""}
           className={`resize-none block text-right bg-white text-[13px] dark:bg-black px-2 py-3 rounded-lg focus:outline-none  w-full focus:ring-2 focus:ring-black dark:ring-white   duration-200 `}
         />
     </form>

     {status === "success" && !posts.length && (
       <p className="text-center text-muted-foreground">
         هیچ پستی با این نام هنوز وجود ندارد
       </p>
     )}

     {status === "error" && (
       <p className="text-center text-destructive">
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
             <Link href={`/${post?.user?.name}/${post?.link}`} key={post?.id}>
                <div className="p-2 w-full mx-auto ">
                          <div className=' flex gap-2'>
                            <div className="relative w-[40px] h-[40px]">
                              <ImageCom src={post?.images[0]} className="rounded-lg bg-lbtn dark:bg-dbtn  h-10 w-10" alt={'thumnail'} />
                            </div>
                              
                              <div className="flex-1 space-y-1">
                                <p className="text-lfont text-sm">{post?.user.displayName}</p>      
                                <p className="text-sm">{post?.title}</p>           
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
