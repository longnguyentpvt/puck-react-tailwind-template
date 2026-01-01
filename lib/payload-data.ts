/**
 * Payload Data Fetching Utility
 * Fetches data from Payload CMS collections
 * Server-side only
 */

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from 'react'

// Cache the payload instance
const getCachedPayload = cache(async () => {
  return await getPayload({ config })
})

export type QueryMode = 'single' | 'multiple'

export interface FetchPayloadDataOptions {
  collection: string
  queryMode: QueryMode
  documentId?: string
  whereConditions?: Record<string, any>
  limit?: number
  page?: number
  sort?: string
}

export interface PayloadDataResult {
  data: any | any[]
  totalDocs?: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
}

/**
 * Fetch data from a Payload collection
 * @param options - The fetch options
 * @returns The fetched data
 */
export async function fetchPayloadData(
  options: FetchPayloadDataOptions
): Promise<PayloadDataResult | null> {
  try {
    const payload = await getCachedPayload()

    const {
      collection,
      queryMode,
      documentId,
      whereConditions,
      limit = 10,
      page = 1,
      sort,
    } = options

    if (queryMode === 'single' && documentId) {
      // Fetch a single document by ID
      const doc = await payload.findByID({
        collection: collection as any,
        id: documentId,
      })

      return {
        data: doc,
      }
    } else if (queryMode === 'multiple') {
      // Fetch multiple documents
      const result = await payload.find({
        collection: collection as any,
        where: whereConditions || {},
        limit,
        page,
        sort,
      })

      return {
        data: result.docs,
        totalDocs: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching Payload data:', error)
    return null
  }
}

/**
 * Get a list of available collections from Payload config
 * This is a placeholder that should be enhanced to dynamically read from Payload config
 */
export function getAvailableCollections(): string[] {
  // In a real implementation, this would read from the Payload config
  // For now, we'll return the known collections
  return ['users', 'media', 'pages']
}

/**
 * Check if a collection exists in Payload config
 */
export function isValidCollection(collection: string): boolean {
  return getAvailableCollections().includes(collection)
}
