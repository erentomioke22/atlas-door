import Link from "next/link";
import { IoPencil } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import moment from "moment";
import {useQueryClient} from "@tanstack/react-query";
import ImageCom from "./ui/Image";

export default function Notification({ notification }) {
  


    const queryClient = useQueryClient();
    const queryKey = ["notifications"]



  const notificationTypeMap = {
    COMMENT: {
      message:<><span className="text-lfont">commented</span> on your post</> ,
      icon: <FaMessage className="text-[12px]  " />,
      href: `/posts/${notification.postId}`,
    },
    POST: {
      message:<><span className="text-lfont">Create</span> new  post</>,
      icon: <IoPencil className="text-[14px] " />,
      href: `/posts/${notification.postId}`,
    },
  };
  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    // <Link href={href} className="block">
        <div className={`  space-y-2 py-2 px-3  `}>
           <div className="flex  justify-between gap-3">
             <div  className="flex gap-2 "> 
              <div className="relative w-[40px] h-[40px]">
              <ImageCom
               className="rounded-lg "
               src={"/images/logo/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg"
               }
               alt={'avatar'}
             />
              </div>
             <div >
              <p>{notification.email}</p>
              <p>{notification.name}</p>
              <p className=" gap-1">
                            
                            
                <span>{message}</span>
              </p>
             </div>
             </div>
             {!notification.read && 
             <span className="relative flex  h-3 w-3 mt-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple opacity-75"></span>
                <span clasName="relative inline-flex rounded-full h-3 w-3 bg-purple"></span>
            </span>
             }
           </div>
           {notification.post && (
            <Link href={`/posts/${notification?.post.link}`} >
              <div className="text-sm bg-lcard dark:bg-dcard p-3 mt-3 rounded-xl">
                <div className="flex gap-2">
                  <div className="w-[35px] h-[35px] relative">
                   <ImageCom src={notification.post.images[0]} className="rounded-lg" alt={"avatar"}/>
                  </div>
                  <div className="flex flex-col ">
                    <span className="text-sm text-lfont " >{notification.post.title}</span>  
                    {/* <span className="flex text-[10px] space-x-1">
                      {notification.post?.tags.slice(0,notification.post?.tags?.length >= 3 ? 3 : notification.post?.tags?.length).map((tag)=>{return <p className='text-lfont'><span className=''>#</span>{tag?.name}</p>  })}         
                    </span>    */}
                  </div>
                </div>
              </div>
            </Link>
            )}



         <div className="flex justify-end text-[10px] text-lfont">
           <p>{moment(new Date(notification.createdAt), "YYYYMMDD").fromNow()}</p>
         </div>


        </div>
    // {/* </Link> */}
  );
}