// app/api/notifications/mark-as-read/route.ts
import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { getServerSession } from '@/lib/get-session';

export async function PATCH(): Promise<NextResponse> {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await getPayload({ config: configPromise });

    const result = await payload.update({
      collection: 'notifications',
      where: {
        and: [
          { recipient: { equals: session.user.id } },
          { read: { equals: false } },
        ],
      },
      data: { read: true },
    });

    return NextResponse.json({
      success: true,
      updated: result.docs.length,
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}