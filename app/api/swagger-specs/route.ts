import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

/**
 * GET /api/swagger-specs - Get all swagger API configurations
 * GET /api/swagger-specs?id=xxx - Get specific swagger API by ID
 */
export async function GET(request: Request) {
  const payload = await getPayloadHMR({ config: configPromise })
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    if (id) {
      // Get specific API by ID
      const result = await payload.find({
        collection: 'swagger-apis' as any,
        where: {
          id: {
            equals: id,
          },
        },
        limit: 1,
      })

      if (result.docs.length === 0) {
        return NextResponse.json({ error: 'API not found' }, { status: 404 })
      }

      return NextResponse.json(result.docs[0])
    } else {
      // Get all enabled APIs
      const result = await payload.find({
        collection: 'swagger-apis' as any,
        where: {
          enabled: {
            not_equals: false,
          },
        },
        limit: 100,
      })

      return NextResponse.json({
        docs: result.docs,
        totalDocs: result.totalDocs,
      })
    }
  } catch (error) {
    console.error('Error fetching swagger APIs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch swagger APIs' },
      { status: 500 }
    )
  }
}
