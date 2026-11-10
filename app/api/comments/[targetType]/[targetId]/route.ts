// app/api/comments/[targetType]/[targetId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getComments } from '@/lib/comments/action'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ targetType: string; targetId: string }> }
) {
  try {
    const { targetType, targetId } = await params
    const { searchParams } = new URL(req.url)
    const category = (searchParams.get('category') as 'latest' | 'oldest') || 'latest'
    const cursor = searchParams.get('cursor')

    const data = await getComments({
      targetType: targetType as 'post' | 'product',
      targetId,
      category,
      cursor,
    })

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || 'Server error' },
      { status: 500 }
    )
  }
}