// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/utils/database';
import { notificationsInclude } from '@/lib/types';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

interface NotificationsResponse {
  notifications: any[];
  nextCursor: string | null;
  unreadCount: number;
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<NotificationsResponse | { error: string }>> {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get('cursor') || undefined;
    const pageSize = 10;

    // 1. دریافت notifications از Prisma
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: session.user.id,
      },
      include: notificationsInclude,
      orderBy: { createdAt: 'desc' },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: session.user.id,
        read: false,
      },
    });

    const hasMore = notifications.length > pageSize;
    const nextCursor = hasMore ? notifications[pageSize].id : null;
    const slicedNotifications = notifications.slice(0, pageSize);

    // 2. جمع‌آوری targetIdها بر اساس نوع
    const postIds: string[] = [];
    const productIds: string[] = [];
    const orderIds: string[] = [];

    slicedNotifications.forEach((n) => {
      if (!n.targetId) return;
      if (n.targetType === 'post') postIds.push(n.targetId);
      else if (n.targetType === 'product') productIds.push(n.targetId);
      else if (n.targetType === 'order') orderIds.push(n.targetId);
    });

    // 3. دریافت اطلاعات از Sanity (پست‌ها و محصولات)
    const [posts, products] = await Promise.all([
      postIds.length > 0
        ? client.fetch<
            Array<{
              _id: string;
              title: string;
              slug: string;
              mainImage: string;
            }>
          >(
            groq`*[_type == "post" && _id in $ids] {
              _id,
              title,
              "slug": slug.current,
              "mainImage": mainImage.asset->url
            }`,
            { ids: postIds }
          )
        : Promise.resolve([]),
      productIds.length > 0
        ? client.fetch<
            Array<{
              _id: string;
              name: string;
              slug: string;
              mainImage: string;
            }>
          >(
            groq`*[_type == "product" && _id in $ids] {
              _id,
              name,
              "slug": slug.current,
              "mainImage": images[0].asset->url
            }`,
            { ids: productIds }
          )
        : Promise.resolve([]),
    ]);

    // 4. دریافت اطلاعات Orderها از Prisma
    const orders =
      orderIds.length > 0
        ? await prisma.order.findMany({
            where: { id: { in: orderIds } },
            select: {
              id: true,
              orderCode: true,
              total: true,
              status: true,
            },
          })
        : [];

    // 5. ساخت map برای دسترسی سریع
    const postsMap = new Map(posts.map((p) => [p._id, p]));
    const productsMap = new Map(products.map((p) => [p._id, p]));
    const ordersMap = new Map(orders.map((o) => [o.id, o]));

    // 6. ترکیب داده‌ها
    const formattedNotifications = slicedNotifications.map((n) => {
      const base = {
        id: n.id,
        type: n.type,
        read: n.read,
        createdAt: n.createdAt,
        targetType: n.targetType,
        targetId: n.targetId,
        issuer: {
          id: n.issuer.id,
          name: n.issuer.name,
          displayName: n.issuer.displayName,
          image: n.issuer.image,
        },
        recipient: {
          id: n.recipient.id,
          name: n.recipient.name,    
          displayName: n.recipient.displayName,
          image: n.recipient.image,
        },
        post: null as any,
        product: null as any,
        order: null as any,
      };

      // اتصال به post
      if (n.targetType === 'post' && n.targetId) {
        const post = postsMap.get(n.targetId);
        if (post) {
          base.post = {
            slug: post.slug,
            title: post.title,
            images: post.mainImage ? [post.mainImage] : [],
          };
        }
      }

      // اتصال به product
      if (n.targetType === 'product' && n.targetId) {
        const product = productsMap.get(n.targetId);
        if (product) {
          base.product = {
            slug: product.slug,
            name: product.name,
            images: product.mainImage ? [product.mainImage] : [],
          };
        }
      }

      // اتصال به order
      if (n.targetType === 'order' && n.targetId) {
        const order = ordersMap.get(n.targetId);
        if (order) {
          base.order = {
            id: order.id,
            orderCode: order.orderCode,
            total: order.total,
            status: order.status,
          };
        }
      }

      return base;
    });

    return NextResponse.json({
      notifications: formattedNotifications,
      nextCursor,
      unreadCount,
    });
  } catch (error) {
    console.error('Notifications GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.notification.deleteMany({
      where: { recipientId: session.user.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Notifications DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}