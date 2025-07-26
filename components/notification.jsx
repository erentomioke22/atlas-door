import Link from "next/link";
import { FaUserPlus } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import moment from "moment";
import { PiHeartFill } from "react-icons/pi";
import { FaUserGroup } from "react-icons/fa6";
import ImageCom from "./ui/Image";


export default function Notification({ notification }) {
const notificationTypeMap = {
    COMMENT: {
      message: (
        <p>
          به وبلاگ شما واكنش نشان داد
        </p>
      ),
      icon: <FaMessage className="text-[12px]  " />,
      href: `/posts/${notification.postId}`,
    },
    REPLY: {
      message: (
        <p>
          به بازخوزد شما واكنش نشان داد
        </p>
      ),
      icon: <FaMessage className="text-[12px]  " />,
      href: `/posts/${notification.postId}`,
    },
    POST: {
      message: (
        <p>
          وبلاگ جديد در وبسايت قرار گرفت
        </p>
      ),
      icon: <IoPencil className="text-[14px] " />,
      href: `/posts/${notification.postId}`,
    },
    PAID: {
      message: (
        <p>
          پرداخت سفارش شما انجام شد
        </p>
      ),
      icon: <IoPencil className="text-[14px] " />,
      href: `/posts/${notification.postId}`,
    },
    DELIVERED: {
      message: (
        <p>
          سفارش شما تحويل داده شد
        </p>
      ),
      icon: <IoPencil className="text-[14px] " />,
      href: `/posts/${notification.postId}`,
    },

  };
  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    <div className={` py-5 px-3  `}>
      <div className="flex  justify-between gap-3">
        <div className="flex gap-2 ">

            <div className="relative flex h-9 w-9  rounded-lg">
  <div className="relative h-full w-full">
  {notification?.issuer?.image === null ?
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-redorange to-yellow"></div>
                  :
    <ImageCom
      className="rounded-lg h-full w-full "
      src={notification.issuer.image}
      alt={notification.issuer.displayName}
    />
                  }
    <div className={`${!notification.read && 'animate-pulse absolute inset-0 border-[3px] border-redorange rounded-lg' } `}></div>
  </div>
</div>


          <div>
            <p className="text-sm gap-1 ">
              <h2 >
                {notification.issuer.displayName}
              </h2>
              <span className="text-lfont text-[12px]">{message}</span>
            </p>
            <div className=" text-[10px] text-lfont">
        <p>{moment(new Date(notification.createdAt), "YYYYMMDD").fromNow()}</p>
      </div>
          </div>
        </div>

      </div>
      {notification?.post && (
        <Link href={`/posts/${notification?.post.link}`}>
          <div className="text-sm bg-lcard bg-opacity-50 dark:bg-dcard p-2  rounded-xl mt-3">
            <div className="flex gap-2">
              <div className="relative w-7 h-7">
              <ImageCom
                src={notification.post?.images[0]}
                className="h-7 w-7 rounded-lg my-auto"
                alt={notification.post.title.slice(0,7)}
              />
              </div>
              <div className="flex flex-col ">
                <span className="text-sm  line-clamp-2">
                  {notification.post.title}
                </span>
                {/* <span className="flex text-[10px] space-x-1">
                      {notification.post?.tags.slice(0,notification.post?.tags?.length >= 3 ? 3 : notification.post?.tags?.length).map((tag)=>{return <p className='text-lfont'><span className=''>#</span>{tag?.name}</p>  })}         
                    </span>    */}
              </div>
            </div>
          </div>
        </Link>
      )}
      {notification?.product && (
        <Link href={`/products/${notification?.product.name}`}>
          <div className="text-sm bg-lcard bg-opacity-50 dark:bg-dcard p-2  rounded-xl mt-3">
            <div className="flex gap-2">
              <div className="relative w-7 h-7">
              <ImageCom
                src={notification.product?.images[0]}
                className="h-7 w-7 rounded-lg my-auto"
                alt={notification.product.name.slice(0,7)}
              />
              </div>
              <div className="flex flex-col ">
                <span className="text-sm  line-clamp-2">
                  {notification.product.name}
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}



    </div>
  );
}
