import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const payload = await request.json()
  const cms = await getPayload({ config })

  try {
    // Check if page exists
    const existingPage = await cms.find({
      collection: 'pages',
      where: {
        path: {
          equals: payload.path,
        },
      },
      limit: 1,
    })

    if (existingPage.docs.length > 0) {
      // Update existing page
      await cms.update({
        collection: 'pages',
        id: existingPage.docs[0].id,
        data: {
          path: payload.path,
          content: payload.data,
        },
      })
    } else {
      // Create new page
      await cms.create({
        collection: 'pages',
        data: {
          path: payload.path,
          content: payload.data,
        },
      })
    }

    // Purge Next.js cache
    revalidatePath(payload.path)

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error('Error saving page:', error)
    return NextResponse.json({ status: "error", error: String(error) }, { status: 500 })
  }
}
