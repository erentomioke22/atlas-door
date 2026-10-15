// app/(admin)/admin/users/page.tsx
import UsersManager from '@/components/admin/usersManager';

export const metadata = {
  title: 'مدیریت کاربران | ادمین',
};

export default function AdminUsersPage() {
  return <UsersManager />;
}