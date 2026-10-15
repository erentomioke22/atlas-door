import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/utils/database';
import type { OrderStatus } from '@prisma/client';

const VALID_STATUSES: OrderStatus[] = [
  'PENDING',
  'PAID',
  'PROCESSING',
  'SENT_TO_FACTORY',
  'IN_PRODUCTION',
  'READY',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

// ====== GET — لیست سفارشات ======
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
    const statusParam = searchParams.get('status');
    const from = searchParams.get('from'); // تاریخ شروع
    const to = searchParams.get('to');     // تاریخ پایان

    const skip = (page - 1) * limit;
    const where: any = {};

    // ✅ جستجو
    if (search) {
      where.OR = [
        { orderCode: { contains: search, mode: 'insensitive' } },
        { recipient: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    // ✅ فیلتر وضعیت
    if (statusParam && statusParam !== 'ALL') {
      if (VALID_STATUSES.includes(statusParam as OrderStatus)) {
        where.status = statusParam as OrderStatus;
      }
    }

    // ✅ فیلتر تاریخ
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = toDate;
      }
    }

    const [orders, total, statusCounts] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              displayName: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
      // ✅ شمارش هر وضعیت برای تب‌ها
      prisma.order.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
    ]);

    return NextResponse.json({
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      statusCounts: statusCounts.reduce(
        (acc, item) => {
          acc[item.status] = item._count._all;
          return acc;
        },
        {} as Record<string, number>
      ),
    });
  } catch (error) {
    console.error('Admin orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ====== PATCH — تغییر وضعیت سفارش ======
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, status, adminNote } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(adminNote !== undefined && { adminNote }),
      },
      include: { items: true },
    });

    // ✅ نوتیفیکیشن برای کاربر
    await prisma.notification.create({
      data: {
        recipientId: order.userId,
        issuerId: session.user.id,
        type: status === 'DELIVERED' ? 'DELIVERED' : 'ORDER',
        targetType: 'order',
        targetId: order.id,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ====== DELETE — حذف سفارش ======
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    await prisma.order.delete({ where: { id: orderId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}