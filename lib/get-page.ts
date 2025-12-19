import { Data } from "@measured/puck"
import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from 'react'

// Cache the payload instance
export const getCachedPayload = cache(async () => {
  return await getPayload({ config })
})

export const getPage = async (path: string): Promise<Data | null> => {
  try {
    const payload = await getCachedPayload()
    
    const result = await payload.find({
      collection: 'pages',
      where: {
        path: {
          equals: path,
        },
      },
      limit: 1,
    })

    if (result.docs.length > 0) {
      return result.docs[0].content as Data
    }

    return null
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}
