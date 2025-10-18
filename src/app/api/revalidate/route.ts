/**
 * On-Demand Revalidation API Route
 *
 * Allows triggering cache revalidation for specific pages
 *
 * Usage:
 *   POST /api/revalidate?secret=YOUR_SECRET&path=/galeria
 */

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const secret = searchParams.get('secret')
  const path = searchParams.get('path')
  const tag = searchParams.get('tag')

  // Check for secret to confirm this is a valid request
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { message: 'Invalid secret' },
      { status: 401 }
    )
  }

  try {
    if (path) {
      // Revalidate specific path
      revalidatePath(path)
      return NextResponse.json({
        revalidated: true,
        path,
        now: Date.now()
      })
    }

    if (tag) {
      // Revalidate by tag
      revalidateTag(tag)
      return NextResponse.json({
        revalidated: true,
        tag,
        now: Date.now()
      })
    }

    return NextResponse.json(
      { message: 'Missing path or tag parameter' },
      { status: 400 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    )
  }
}
