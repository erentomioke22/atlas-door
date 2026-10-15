// app/(admin)/admin/orders/page.tsx
import OrdersManager from '@/components/admin/ordersManager';

export const metadata = {
  title: 'مدیریت سفارشات | ادمین',
};

export default function AdminOrdersPage() {
  return <OrdersManager />;
}