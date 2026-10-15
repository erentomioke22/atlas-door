// app/api/admin/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/utils/database';
import { getCommentDataInclude } from '@/lib/types';

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
    const targetType = searchParams.get('targetType') || '';

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.content = { contains: search, mode: 'insensitive' };
    }

    if (targetType) {
      where.targetType = targetType;
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: getCommentDataInclude(),
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where }),
    ]);

    return NextResponse.json({
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin comments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// حذف کامنت توسط ادمین
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    await prisma.comment.delete({ where: { id: commentId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}