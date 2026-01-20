/**
 * Service for fetching data from Payload CMS collections and Swagger APIs.
 * 
 * This service provides a centralized way to fetch collection data
 * and API data for use in data binding within Puck components.
 */

import { fetchSwaggerApiData, generateMockDataFromEndpoint, findEndpointById, parseSwaggerSpec } from '@/lib/swagger';
import { ApiSourceConfig } from '@/lib/swagger/types';
import { SWAGGER_API_SOURCES } from './bindable-collections';

/**
 * Mock external data for demonstration when Payload is not available
 * or as fallback data.
 */
export const mockExternalData = {
  products: [
    { id: 1, name: "Product 1", price: 99.99, image: "https://picsum.photos/seed/p1/400/300" },
    { id: 2, name: "Product 2", price: 149.99, image: "https://picsum.photos/seed/p2/400/300" },
    { id: 3, name: "Product 3", price: 199.99, image: "https://picsum.photos/seed/p3/400/300" },
    { id: 4, name: "Product 4", price: 249.99, image: "https://picsum.photos/seed/p4/400/300" },
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

/**
 * Fetch data from a Swagger API endpoint
 * 
 * @param apiConfig - Configuration for the API source
 * @returns The API response data
 */
export async function fetchApiData(apiConfig: ApiSourceConfig): Promise<any> {
  try {
    return await fetchSwaggerApiData(apiConfig);
  } catch (error) {
    console.error('Error fetching API data:', error);
    // Fall back to mock data from endpoint schema
    return getMockApiData(apiConfig);
  }
}

/**
 * Get mock data from API endpoint schema for preview/fallback
 * 
 * @param apiConfig - Configuration for the API source
 * @returns Mock data generated from the endpoint schema
 */
export function getMockApiData(apiConfig: ApiSourceConfig): any {
  try {
    // Find the API source configuration
    const apiSource = SWAGGER_API_SOURCES.find((s) => 
      apiConfig.swaggerUrl?.includes(s.swaggerUrl)
    );

    if (!apiSource) {
      console.warn('API source not found in configuration');
      return null;
    }

    // For client-side mock data, we need the spec to be already loaded
    // In a real implementation, you might want to pre-load and cache these
    // For now, return a placeholder
    console.warn('Mock API data generation requires server-side spec loading');
    return null;
  } catch (error) {
    console.error('Error generating mock API data:', error);
    return null;
  }
}
