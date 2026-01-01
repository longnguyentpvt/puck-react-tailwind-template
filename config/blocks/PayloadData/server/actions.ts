/**
 * Server-side data fetching for PayloadData component
 */

'use server'

import { fetchPayloadData } from '@/lib/payload-data'

export async function fetchDataForPayloadComponent(props: {
  collection: string
  queryMode: 'single' | 'multiple'
  documentId?: string
  whereConditions?: Record<string, any>
  limit?: number
}) {
  return await fetchPayloadData({
    collection: props.collection,
    queryMode: props.queryMode,
    documentId: props.documentId,
    whereConditions: props.whereConditions,
    limit: props.limit,
  })
}
