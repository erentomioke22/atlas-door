// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { getServerSession } from '@/lib/get-session';
import type {
  NotificationsPage,
  NotificationItem,
  NotificationTargetType,
} from '@/lib/types';

// helper: media → string url
function mediaUrl(media: any): string | undefined {
  if (!media) return undefined;
  if (typeof media === 'string') return media;
  if (typeof media === 'object' && media.url) return media.url;
  return undefined;
}

// helper: user → NotificationIssuer
function mapUser(u: any) {
  if (!u) return null;
  if (typeof u === 'string') return { id: u };
  return {
    id: String(u.id),
    name: u.name ?? null,
    displayName: u.displayName ?? null,
    image: mediaUrl(u.image) ?? null,
  };
}

export async function GET(
  req: NextRequest,
): Promise<NextResponse<NotificationsPage | { error: string }>> {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get('cursor') || undefined;
    const pageSize = 10;

    const payload = await getPayload({ config: configPromise });

    // 1. دریافت notification ها از Payload
    const result = await payload.find({
      collection: 'notifications',
      where: { recipient: { equals: session.user.id } },
      sort: '-createdAt',
      limit: pageSize + 1,
      depth: 2,
      ...(cursor ? { page: 1 } : {}), // cursor با Payload متفاوت است → پایین توضیح
    });

    // ⚠️ Payload از cursor پشتیبانی نمی‌کند؛ از page-based استفاده می‌کنیم
    // اگر می‌خواهید cursor داشته باشید، از `createdAt < lastCreatedAt` استفاده کنید:
    //
    // const realResult = cursor
    //   ? await payload.find({
    //       collection: 'notifications',
    //       where: {
    //         and: [
    //           { recipient: { equals: session.user.id } },
    //           { createdAt: { less_than: cursor } },
    //         ],
    //       },
    //       sort: '-createdAt',
    //       limit: pageSize + 1,
    //       depth: 2,
    //     })
    //   : await payload.find(...);

    const hasMore = result.docs.length > pageSize;
    const slicedDocs = result.docs.slice(0, pageSize);

    const nextCursor = hasMore
      ? new Date(slicedDocs[slicedDocs.length - 1].createdAt).toISOString()
      : null;

    // 2. unreadCount
    const { totalDocs: unreadCount } = await payload.count({
      collection: 'notifications',
      where: {
        and: [
          { recipient: { equals: session.user.id } },
          { read: { equals: false } },
        ],
      },
    });

    // 3. جمع‌آوری targetId ها
    const postIds: string[] = [];
    const productIds: string[] = [];
    const orderIds: string[] = [];

    for (const n of slicedDocs) {
      if (!n.targetId) continue;
      if (n.targetType === 'post') postIds.push(n.targetId);
      else if (n.targetType === 'product') productIds.push(n.targetId);
      else if (n.targetType === 'order') orderIds.push(n.targetId);
    }

    // 4. دریافت پست‌ها و محصولات از Payload
    const [postsRes, productsRes, ordersRes] = await Promise.all([
      postIds.length
        ? payload.find({
            collection: 'posts',
            where: { id: { in: postIds } },
            depth: 1,
            limit: postIds.length,
          })
        : Promise.resolve({ docs: [] as any[] }),

      productIds.length
        ? payload.find({
            collection: 'products',
            where: { id: { in: productIds } },
            depth: 1,
            limit: productIds.length,
          })
        : Promise.resolve({ docs: [] as any[] }),

      orderIds.length
        ? payload.find({
            collection: 'orders',
            where: { id: { in: orderIds } },
            depth: 0,
            limit: orderIds.length,
          })
        : Promise.resolve({ docs: [] as any[] }),
    ]);

    // 5. map برای دسترسی سریع
    const postsMap = new Map(postsRes.docs.map((p: any) => [String(p.id), p]));
    const productsMap = new Map(
      productsRes.docs.map((p: any) => [String(p.id), p]),
    );
    const ordersMap = new Map(
      ordersRes.docs.map((o: any) => [String(o.id), o]),
    );

    // 6. ساخت خروجی
    const formattedNotifications: NotificationItem[] = slicedDocs.map(
      (n: any) => {
        const issuer = mapUser(n.issuer);
        const recipient = mapUser(n.recipient);

        const base: NotificationItem = {
          id: String(n.id),
          type: n.type,
          read: !!n.read,
          createdAt: n.createdAt,
          targetType: n.targetType as NotificationTargetType | null,
          targetId: n.targetId,
          issuer,
          recipient,
          post: null,
          product: null,
          order: null,
        };

        if (n.targetType === 'post' && n.targetId) {
          const post = postsMap.get(String(n.targetId));
          if (post) {
            base.post = {
              slug: post.slug,
              title: post.title,
              images: post.mainImage
                ? [mediaUrl(post.mainImage)!].filter(Boolean)
                : [],
            };
          }
        }

        if (n.targetType === 'product' && n.targetId) {
          const product = productsMap.get(String(n.targetId));
          if (product) {
            const firstImage =
              mediaUrl(product.images?.[0]?.image) ??
              mediaUrl(product.images?.[0]) ??
              mediaUrl(product.mainImage);
            base.product = {
              slug: product.slug,
              name: product.name,
              images: firstImage ? [firstImage] : [],
            };
          }
        }

        if (n.targetType === 'order' && n.targetId) {
          const order = ordersMap.get(String(n.targetId));
          if (order) {
            base.order = {
              id: String(order.id),
              orderCode: order.orderCode,
              total: order.total,
              status: order.status,
            };
          }
        }

        return base;
      },
    );

    return NextResponse.json({
      notifications: formattedNotifications,
      nextCursor,
      unreadCount,
    });
  } catch (error) {
    console.error('Notifications GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(): Promise<NextResponse> {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await getPayload({ config: configPromise });

    // حذف همه‌ی اعلان‌های این کاربر
    await payload.delete({
      collection: 'notifications',
      where: { recipient: { equals: session.user.id } },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Notifications DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}