// // app/api/comments/[targetType]/[targetId]/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/utils/database';
// import { getCommentDataInclude } from '@/lib/types';
// import { getServerSession } from '@/lib/get-session';
// import type { CommentTargetType, SortCategory } from '@/lib/types';

// interface RouteParams {
//   params: Promise<{
//     targetType: CommentTargetType;
//     targetId: string;
//   }>;
// }

// export async function GET(req: NextRequest, { params }: RouteParams) {
//   try {
//     const { targetType, targetId } = await params;
//     const category =
//       (req.nextUrl.searchParams.get('category') as SortCategory) || 'latest';
//     const cursor = req.nextUrl.searchParams.get('cursor') || undefined;
//     const pageSize = 10;

//     const session = await getServerSession();

//     if (!['post', 'product'].includes(targetType)) {
//       return NextResponse.json(
//         { error: 'Invalid target type' },
//         { status: 400 }
//       );
//     }

//     const whereClause = {
//       targetType,
//       targetId,
//     };

//     const orderBy: any =
//       category === 'toppest'
//         ? [{ replies: { _count: 'desc' } }, { createdAt: 'desc' }]
//         : category === 'oldest'
//           ? { createdAt: 'asc' }
//           : { createdAt: 'desc' };

//     const comments = await prisma.comment.findMany({
//       where: whereClause,
//       include: getCommentDataInclude(),
//       orderBy,
//       take: pageSize + 1,
//       cursor: cursor ? { id: cursor } : undefined,
//     });

//     const nextCursor =
//       comments.length > pageSize ? comments[pageSize].id : null;

//     return NextResponse.json({
//       comments: comments.slice(0, pageSize),
//       nextCursor,
//     });
//   } catch (error) {
//     console.error('Comments GET error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// app/api/comments/[targetType]/[targetId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/database';
import { getCommentDataInclude } from '@/lib/types';
import { getServerSession } from '@/lib/get-session';
import type { CommentTargetType, SortCategory } from '@/lib/types';

interface RouteParams {
  params: Promise<{
    targetType: string;   // ✅ string به جای CommentTargetType
    targetId: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { targetType, targetId } = await params;

    // ✅ Validate بعد از await
    if (targetType !== 'post' && targetType !== 'product') {
      return NextResponse.json(
        { error: 'Invalid target type' },
        { status: 400 }
      );
    }

    // ✅ الان TypeScript می‌دونه targetType از نوع CommentTargetType هست
    const validTargetType: CommentTargetType = targetType;

    const category =
      (req.nextUrl.searchParams.get('category') as SortCategory) || 'latest';
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined;
    const pageSize = 10;

    const session = await getServerSession();

    const whereClause = {
      targetType: validTargetType,
      targetId,
    };

    const orderBy: any =
      category === 'toppest'
        ? [{ replies: { _count: 'desc' } }, { createdAt: 'desc' }]
        : category === 'oldest'
          ? { createdAt: 'asc' }
          : { createdAt: 'desc' };

    const comments = await prisma.comment.findMany({
      where: whereClause,
      include: getCommentDataInclude(),
      orderBy,
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      comments.length > pageSize ? comments[pageSize].id : null;

    return NextResponse.json({
      comments: comments.slice(0, pageSize),
      nextCursor,
    });
  } catch (error) {
    console.error('Comments GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}