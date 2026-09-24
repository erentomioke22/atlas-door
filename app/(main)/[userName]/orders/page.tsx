// app/(main)/orders/page.tsx
import { Metadata } from 'next';
import { getServerSession } from '@/lib/get-session';
import OrderPage from '../../../../components/pages/orderPage';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'سفارشات من | اطلس در',
  description: 'مشاهده و مدیریت سفارشات',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  const session = await getServerSession();

  if (!session) {
    // redirect('/login?redirect=/orders');
  }

  return (
    <div className="container max-w-7xl mx-auto px-5">
      <OrderPage session={session} />
    </div>
  );
}
