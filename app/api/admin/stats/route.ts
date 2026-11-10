import { NextResponse } from 'next/server';
import { prisma } from '@/utils/database';

export async function GET() {
  const [users, orders, comments, glassOrder, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.comment.count(),
    prisma.glassOrder.count(),
    prisma.order.aggregate({
      where: { status: 'DELIVERED' },
      _sum: { total: true },
    }),
  ]);

  return NextResponse.json({
    users,
    orders,
    comments,
    glassOrder,
    revenue: revenue._sum.total ?? 0,
  });
}