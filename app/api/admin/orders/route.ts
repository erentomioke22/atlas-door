import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/database';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') ?? 1);
  const pageSize = Number(searchParams.get('pageSize') ?? 10);
  const status = searchParams.get('status');

  const where = status && status !== 'ALL' ? { status: status as any } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        items: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({ orders, total });
}