// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/utils/database';

// ====== GET — لیست کاربران ======
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 20);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';
    const verified = searchParams.get('verified') || '';

    const skip = (page - 1) * limit;
    const where: any = {};

    // ✅ جستجو
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    // ✅ فیلتر نقش
    if (role) {
      where.role = role;
    }

    // ✅ فیلتر وضعیت
    if (status) {
      where.status = status;
    }

    // ✅ فیلتر تایید ایمیل
    if (verified === 'true') where.emailVerified = true;
    if (verified === 'false') where.emailVerified = false;

    const [users, total, roleCounts, statusCounts] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          displayName: true,
          image: true,
          phone: true,
          address: true,
          role: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
      // ✅ شمارش نقش‌ها
      prisma.user.groupBy({
        by: ['role'],
        _count: { _all: true },
      }),
      // ✅ شمارش وضعیت‌ها
      prisma.user.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
    ]);

    return NextResponse.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      roleCounts: roleCounts.reduce(
        (acc, item) => {
          if (item.role) acc[item.role] = item._count._all;
          return acc;
        },
        {} as Record<string, number>
      ),
      statusCounts: statusCounts.reduce(
        (acc, item) => {
          if (item.status) acc[item.status] = item._count._all;
          return acc;
        },
        {} as Record<string, number>
      ),
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ====== PATCH — تغییر نقش یا وضعیت ======
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { userId, role, status } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // ✅ جلوگیری از تغییر نقش خود ادمین
    if (userId === session.user.id && role) {
      return NextResponse.json(
        { error: 'نمی‌توانید نقش خود را تغییر دهید' },
        { status: 400 }
      );
    }

    // ✅ اعتبارسنجی نقش
    const validRoles = ['user', 'admin', 'moderator'];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // ✅ اعتبارسنجی وضعیت
    const validStatuses = ['active', 'inactive', 'banned'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(role && { role }),
        ...(status && { status }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ====== DELETE — حذف کاربر ======
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // ✅ جلوگیری از حذف خود
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'نمی‌توانید حساب خود را حذف کنید' },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}