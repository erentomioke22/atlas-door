// components/notification.tsx
import Link from 'next/link';
import { IoPencil, IoBag } from 'react-icons/io5';
import { FaMessage, FaHandshakeSimple, FaTruckFast } from 'react-icons/fa6';
import moment from 'moment-jalaali';
import ImageCom from './ui/Image';
import { JSX } from 'react';

moment.loadPersian({ usePersianDigits: true });

// ✅ انواع Notification
export type NotificationType =
  | 'COMMENT'
  | 'REPLY'
  | 'POST'
  | 'PAID'
  | 'DELIVERED'
  | 'ORDER'
  | 'PRODUCT';

  interface NotificationIssuer {
    id: string;
    name?: string | null;
    displayName?: string | null;
    image?: string | null;
  }

interface NotificationPost {
  slug: string;
  title: string;
  images: string[];
}

interface NotificationProduct {
  slug: string;
  name: string;
  images: string[];
}

interface NotificationOrder {
  id: string;
  orderCode: string;
  total: number;
  status: string;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  read: boolean;
  createdAt: string | Date;
  targetType?: string | null;
  targetId?: string | null;
  issuer: NotificationIssuer | null;
  recipient?: NotificationIssuer | null;
  post?: NotificationPost | null;
  product?: NotificationProduct | null;
  order?: NotificationOrder | null;
}

interface Props {
  notification: NotificationItem;
}

export default function Notification({ notification }: Props) {
  // ✅ نقشه کامل NotificationType ها
  const notificationTypeMap: Partial<
    Record<
      NotificationType,
      {
        message: JSX.Element;
        icon: JSX.Element;
      }
    >
  > = {
    COMMENT: {
      message: <span>به وبلاگ شما واکنش نشان داد</span>,
      icon: <FaMessage className="text-[12px]" />,
    },
    REPLY: {
      message: <span>به بازخورد شما واکنش نشان داد</span>,
      icon: <FaMessage className="text-[12px]" />,
    },
    POST: {
      message: <span>وبلاگ جدید در وبسایت قرار گرفت</span>,
      icon: <IoPencil className="text-[14px]" />,
    },
    PAID: {
      message: <span>خرید شما با موفقیت ثبت شد</span>,
      icon: <IoBag className="text-[14px]" />,
    },
    DELIVERED: {
      message: <span>سفارش شما تحویل داده شد</span>,
      icon: <FaHandshakeSimple className="text-[14px]" />,
    },
    ORDER: {
      message: <span>وضعیت سفارش شما تغییر کرد</span>,
      icon: <FaTruckFast className="text-[14px]" />,
    },
    PRODUCT: {
      message: <span>محصول جدید در فروشگاه قرار گرفت</span>,
      icon: <IoBag className="text-[14px]" />,
    },
  };

  // ✅ Fallback برای type های ناشناس
  const typeData = notificationTypeMap[notification.type] ?? {
    message: <span>یک اعلان جدید دارید</span>,
    icon: <FaMessage className="text-[12px]" />,
  };
 console.log(notification)
  const { message, icon } = typeData;

  const formattedDate = moment(new Date(notification.createdAt))
    .locale('fa')
    .fromNow();

  return (
    <div className="py-5 px-3">
      <div className="flex justify-between gap-3">
        <div className="flex gap-2">
          {/* ====== آواتار ====== */}
          <div className="relative flex h-9 w-9 rounded-lg flex-none">
            <div className="relative h-full w-full">
              {!notification?.issuer?.image ? (
                <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-redorange to-yellow" />
              ) : (
                <ImageCom
                  className="rounded-lg h-full w-full"
                  src={notification.issuer.image}
                  alt={
                    notification.issuer.displayName ||
                    notification.issuer.name ||
                    'issuer'
                  }
                />
              )}
              {!notification.read && (
                <div className="absolute inset-0 border-[3px] border-redorange rounded-lg animate-pulse" />
              )}
            </div>
          </div>

          {/* ====== متن اعلان ====== */}
          <div>
            <div className="text-sm gap-1 flex items-center flex-wrap">
              <span className="font-medium">
                {notification.issuer?.displayName ||
                  notification.issuer?.name ||
                  'کاربر'}
              </span>
              <span className="text-neutral-500 dark:text-neutral-300 text-[12px] flex items-center gap-1">
                {icon}
                {message}
              </span>
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-300">
              <p>{formattedDate}</p>
            </div>
          </div>
        </div>
      </div>

      {notification?.post && (
        <Link href={`/posts/${notification.post.slug}`}>
          <div className="text-sm bg-lcard opacity-70 hover:opacity-100 dark:bg-dcard p-2 rounded-xl mt-3 transition-opacity">
            <div className="flex gap-2">
              {notification.post.images?.[0] && (
                <ImageCom
                  src={notification.post.images[0]}
                  className="h-7 w-7 rounded-lg my-auto flex-none"
                  alt={notification.post.title.slice(0, 7)}
                />
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm line-clamp-2">
                  {notification.post.title}
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {notification?.product && (
        <Link href={`/products/${notification.product.slug}`}>
          <div className="text-sm bg-lcard opacity-70 hover:opacity-100 dark:bg-dcard p-2 rounded-xl mt-3 transition-opacity">
            <div className="flex gap-2">
              {notification.product.images?.[0] && (
                <ImageCom
                  src={notification.product.images[0]}
                  className="h-7 w-7 rounded-lg my-auto flex-none"
                  alt={notification.product.name.slice(0, 7)}
                />
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm line-clamp-2">
                  {notification.product.name}
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {notification?.order && (
        <Link href={`/${notification.recipient?.name}/orders`}>
          <div className="text-sm bg-lcard opacity-70 hover:opacity-100 dark:bg-dcard p-2 rounded-xl mt-3 transition-opacity">
            <div className="flex gap-2 items-center">
              <IoBag className="text-lg flex-none text-blue-500" />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-mono">
                  {notification.order.orderCode}
                </span>
                <span className="text-xs text-neutral-500">
                  کد سفارش - کلیک کنید
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}