/**
 * Service for fetching data from Payload CMS collections.
 * 
 * This service provides a centralized way to fetch collection data
 * for use in data binding within Puck components.
 */

/**
 * Mock external data for demonstration when Payload is not available
 * or as fallback data.
 */
export const mockExternalData = {
  products: [
    { id: 1, name: "Product 1", price: 99.99, image: "https://picsum.photos/seed/p1/400/300", category: "Electronics" },
    { id: 2, name: "Product 2", price: 149.99, image: "https://picsum.photos/seed/p2/400/300", category: "Clothing" },
    { id: 3, name: "Product 3", price: 199.99, image: "https://picsum.photos/seed/p3/400/300", category: "Electronics" },
    { id: 4, name: "Product 4", price: 249.99, image: "https://picsum.photos/seed/p4/400/300", category: "Home & Garden" },
    { id: 5, name: "Product 5", price: 299.99, image: "https://picsum.photos/seed/p5/400/300", category: "Electronics" },
    { id: 6, name: "Product 6", price: 349.99, image: "https://picsum.photos/seed/p6/400/300", category: "Clothing" },
    { id: 7, name: "Product 7", price: 399.99, image: "https://picsum.photos/seed/p7/400/300", category: "Home & Garden" },
    { id: 8, name: "Product 8", price: 449.99, image: "https://picsum.photos/seed/p8/400/300", category: "Electronics" },
    { id: 9, name: "Product 9", price: 499.99, image: "https://picsum.photos/seed/p9/400/300", category: "Clothing" },
    { id: 10, name: "Product 10", price: 549.99, image: "https://picsum.photos/seed/p10/400/300", category: "Electronics" },
    { id: 11, name: "Product 11", price: 599.99, image: "https://picsum.photos/seed/p11/400/300", category: "Home & Garden" },
    { id: 12, name: "Product 12", price: 649.99, image: "https://picsum.photos/seed/p12/400/300", category: "Clothing" },
    { id: 13, name: "Product 13", price: 699.99, image: "https://picsum.photos/seed/p13/400/300", category: "Electronics" },
    { id: 14, name: "Product 14", price: 749.99, image: "https://picsum.photos/seed/p14/400/300", category: "Home & Garden" },
    { id: 15, name: "Product 15", price: 799.99, image: "https://picsum.photos/seed/p15/400/300", category: "Clothing" },
  ],
  user: {
    name: "John Doe",
    email: "john@example.com",
  },
  categories: [
    { id: 1, name: "Electronics", icon: "📱" },
    { id: 2, name: "Clothing", icon: "👕" },
    { id: 3, name: "Home & Garden", icon: "🏠" },
  ],
};

/**
 * Fetch data from a Payload collection.
 * Falls back to mock data if the collection is not available in Payload
 * or if there's an error fetching.
 * 
 * @param collectionSlug - The slug of the Payload collection to fetch
 * @returns The collection data, or mock data as fallback
 */
export async function fetchPayloadCollectionData(
  collectionSlug: string
): Promise<any> {
  try {
    // Try to fetch from Payload API
    const response = await fetch(`/api/${collectionSlug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache data binding queries
    });

    if (!response.ok) {
      console.warn(`Failed to fetch collection '${collectionSlug}' from Payload, falling back to mock data`);
      return getMockDataForCollection(collectionSlug);
    }

    const data = await response.json();
    
    // Handle Payload pagination response format
    if (data.docs) {
      return data.docs;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching collection '${collectionSlug}' from Payload:`, error);
    // Fall back to mock data
    return getMockDataForCollection(collectionSlug);
  }
}

/**
 * Get mock data for a specific collection slug.
 * 
 * @param collectionSlug - The collection slug to get mock data for
 * @returns Mock data for the collection, or null if not available
 */
function getMockDataForCollection(collectionSlug: string): any {
  const mockData = mockExternalData as Record<string, any>;
  
  if (collectionSlug in mockData) {
    return mockData[collectionSlug];
  }
  
  console.warn(`No mock data available for collection '${collectionSlug}'`);
  return null;
}

/**
 * Synchronous version that only uses mock data.
 * Used in client components where async fetching is not possible.
 * 
 * @param collectionSlug - The collection slug to get data for
 * @returns Mock data for the collection
 */
export function getMockData(collectionSlug: string): any {
  return getMockDataForCollection(collectionSlug);
}
