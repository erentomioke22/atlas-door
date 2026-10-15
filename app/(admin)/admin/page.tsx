// app/(admin)/admin/page.tsx
import { prisma } from '@/utils/database';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import StatsCard from '@/components/admin/statsCard';
import Link from 'next/link';
import {
  IoCartOutline,
  IoPeopleOutline,
  IoChatbubbleOutline,
  IoBagOutline,
  IoDocumentTextOutline,
  IoWalletOutline,
} from 'react-icons/io5';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [
    totalOrders,
    pendingOrders,
    deliveredOrders,
    totalRevenue,
    totalUsers,
    totalComments,
    newComments,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'DELIVERED' } }),
    prisma.order.aggregate({
      where: { status: 'DELIVERED' },
      _sum: { total: true },
    }),
    prisma.user.count(),
    prisma.comment.count(),
    prisma.comment.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  // Sanity counts
  const [productsCount, postsCount] = await Promise.all([
    client.fetch<number>(groq`count(*[_type == "product"])`),
    client.fetch<number>(groq`count(*[_type == "post"])`),
  ]);

  return {
    totalOrders,
    pendingOrders,
    deliveredOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    totalUsers,
    totalComments,
    newComments,
    productsCount,
    postsCount,
  };
}

async function getRecentOrders() {
  return prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });
}

async function getRecentComments() {
  return prisma.comment.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, name: true, displayName: true, image: true },
      },
    },
  });
}

export default async function AdminDashboard() {
  const [stats, recentOrders, recentComments] = await Promise.all([
    getStats(),
    getRecentOrders(),
    getRecentComments(),
  ]);

  return (
    <div className="space-y-8">
      {/* ====== کارت‌های آمار ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatsCard
          title="کل سفارشات"
          value={stats.totalOrders}
          icon={<IoCartOutline />}
          color="blue"
          href="/admin/orders"
        />
        <StatsCard
          title="در انتظار پرداخت"
          value={stats.pendingOrders}
          icon={<IoCartOutline />}
          color="yellow"
          href="/admin/orders?status=PENDING"
        />
        <StatsCard
          title="تحویل داده شده"
          value={stats.deliveredOrders}
          icon={<IoCartOutline />}
          color="green"
          href="/admin/orders?status=DELIVERED"
        />
        <StatsCard
          title="درآمد کل"
          value={stats.totalRevenue.toLocaleString('fa-IR')}
          suffix="تومان"
          icon={<IoWalletOutline />}
          color="purple"
        />
        <StatsCard
          title="کاربران"
          value={stats.totalUsers}
          icon={<IoPeopleOutline />}
          color="blue"
          href="/admin/users"
        />
        <StatsCard
          title="کامنت‌ها"
          value={stats.totalComments}
          suffix={`(${stats.newComments} جدید)`}
          icon={<IoChatbubbleOutline />}
          color="purple"
          href="/admin/comments"
        />
        <StatsCard
          title="محصولات"
          value={stats.productsCount}
          icon={<IoBagOutline />}
          color="green"
          href="/admin/products"
        />
        <StatsCard
          title="مقالات"
          value={stats.postsCount}
          icon={<IoDocumentTextOutline />}
          color="orange"
          href="/admin/posts"
        />
      </div>

      {/* ====== دو ستون: سفارشات اخیر + کامنت‌های اخیر ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* سفارشات اخیر */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border-2 border-lcard dark:border-dcard">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">سفارشات اخیر</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-blue-500 hover:underline"
            >
              مشاهده همه →
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-4">
                سفارشی وجود ندارد
              </p>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex justify-between items-center p-3 rounded-xl hover:bg-lcard dark:hover:bg-dcard transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-mono truncate">{order.orderCode}</p>
                    <p className="text-xs text-neutral-500 truncate">
                      {order.recipient}
                    </p>
                  </div>
                  <div className="text-left flex-none">
                    <p className="text-sm font-medium">
                      {order.total.toLocaleString('fa-IR')} تومان
                    </p>
                    <p className="text-xs text-neutral-500">{order.status}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* کامنت‌های اخیر */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border-2 border-lcard dark:border-dcard">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">کامنت‌های اخیر</h2>
            <Link
              href="/admin/comments"
              className="text-xs text-blue-500 hover:underline"
            >
              مشاهده همه →
            </Link>
          </div>
          <div className="space-y-3">
            {recentComments.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-4">
                کامنتی وجود ندارد
              </p>
            ) : (
              recentComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 rounded-xl bg-lcard dark:bg-dcard"
                >
                  <p className="text-xs text-neutral-500 mb-1">
                    {comment.user?.displayName || comment.user?.name || 'ناشناس'}
                  </p>
                  <p className="text-sm line-clamp-2">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}