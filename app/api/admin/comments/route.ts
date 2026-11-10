import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/database';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') ?? 1);
  const pageSize = Number(searchParams.get('pageSize') ?? 20);

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        parent: { select: { id: true, content: true } },
        _count: { select: { replies: true } },
      },
    }),
    prisma.comment.count(),
  ]);

  return NextResponse.json({ comments, total });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { content, parentId, targetType, targetId, userId } = body;

  const comment = await prisma.comment.create({
    data: {
      content,
      parentId: parentId ?? null,
      targetType,
      targetId,
      userId,
    },
  });

  return NextResponse.json({ comment });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}