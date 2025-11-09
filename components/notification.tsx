import Link from "next/link";
import { IoPencil } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import moment from "moment";
import ImageCom from "./ui/Image";
import { IoBag } from "react-icons/io5";
import { FaHandshakeSimple } from "react-icons/fa6";
import { JSX } from "react";

type NotificationType = "COMMENT" | "REPLY" | "POST" | "PAID" | "DELIVERED";

interface NotificationIssuer {
  image?: string | null;
  name?: string | null;
  displayName?: string | null;
}

interface NotificationPost {
  link: string;
  title: string;
  images: string[];
}

interface NotificationProduct {
  name: string;
  images: string[];
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  read: boolean;
  createdAt: string | Date;
  postId?: string | null;
  issuer: NotificationIssuer;
  post?: NotificationPost | null;
  product?: NotificationProduct | null;
}

interface Props {
  notification: NotificationItem;
}

export default function Notification({ notification }: Props) {
  const notificationTypeMap: Record<
    NotificationType,
    { message: JSX.Element; icon: JSX.Element; href: string }
  > = {
    COMMENT: { message: <p>به وبلاگ شما واكنش نشان داد</p>, icon: <FaMessage className="text-[12px]  " />, href: `/posts/${notification.postId}` },
    REPLY: { message: <p>به بازخوزد شما واكنش نشان داد</p>, icon: <FaMessage className="text-[12px]  " />, href: `/posts/${notification.postId}` },
    POST: { message: <p>وبلاگ جديد در وبسايت قرار گرفت</p>, icon: <IoPencil className="text-[14px] " />, href: `/posts/${notification.postId}` },
    PAID: { message: <p>خرید شما با موفقیت ثبت شد</p>, icon: <IoBag className="text-[14px] " />, href: `/posts/${notification.postId}` },
    DELIVERED: { message: <p>سفارش شما تحويل داده شد</p>, icon: <FaHandshakeSimple className="text-[14px] " />, href: `/posts/${notification.postId}` },
  };
  const { message, icon } = notificationTypeMap[notification.type];

  return (
    <div className={` py-5 px-3  `}>
      <div className="flex  justify-between gap-3">
        <div className="flex gap-2 ">
          <div className="relative flex h-9 w-9  rounded-lg">
            <div className="relative h-full w-full">
              {notification?.issuer?.image === null ? (
                <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-redorange to-yellow"></div>
              ) : (
                <ImageCom
                  className="rounded-lg h-full w-full "
                  src={notification.issuer.image as string}
                  alt={notification.issuer.displayName || notification.issuer.name || "issuer"}
                />
              )}
              <div className={`${!notification.read && 'animate-pulse absolute inset-0 border-[3px] border-redorange rounded-lg' } `}></div>
            </div>
          </div>

          <div>
            <div className="text-sm gap-1 ">
              <span>{notification.issuer.displayName || notification.issuer.name}</span>
              <div className="text-lfont text-[12px]">{message}</div>
            </div>
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
                <span className="text-sm  line-clamp-2">{notification.post.title}</span>
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
                <span className="text-sm  line-clamp-2">{notification.product.name}</span>
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
