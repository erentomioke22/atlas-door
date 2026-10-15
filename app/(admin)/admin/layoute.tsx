// app/(admin)/admin/layout.tsx
import { getServerSession } from '@/lib/get-session';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/adminSidebar';
import AdminHeader from '@/components/admin/adminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // ✅ چک لاگین
  if (!session) {
    redirect('/');
  }

  // ✅ چک ادمین بودن
  if (session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <AdminSidebar session={session} />
      <div className="lg:mr-64">
        <AdminHeader session={session} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}