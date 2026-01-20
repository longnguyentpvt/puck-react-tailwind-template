/**
 * Pagination-aware data source for server-side pagination support.
 * 
 * This module provides utilities for fetching paginated data from
 * Payload CMS collections and managing pagination state.
 */

import { mockExternalData } from './payload-data-source';

export interface PaginationParams {
  page: number;
  pageSize: number;
  collectionSlug: string;
}

export interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: PaginationMetadata;
}

/**
 * Fetch paginated data from a Payload collection.
 * Falls back to mock paginated data if the collection is not available.
 * 
 * @param params - Pagination parameters (page, pageSize, collectionSlug)
 * @returns Paginated response with data and metadata
 */
export async function fetchPaginatedData(
  params: PaginationParams
): Promise<PaginatedResponse> {
  const { page, pageSize, collectionSlug } = params;
  
  try {
    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: pageSize.toString(),
    });
    
    // Try to fetch from Payload API
    const response = await fetch(`/api/${collectionSlug}?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache pagination queries
    });

    if (!response.ok) {
      console.warn(`Failed to fetch paginated collection '${collectionSlug}' from Payload, falling back to mock data`);
      return getMockPaginatedData(collectionSlug, page, pageSize);
    }

    const data = await response.json();
    
    // Handle Payload pagination response format
    if (data.docs && data.page && data.totalPages) {
      return {
        data: data.docs,
        pagination: {
          currentPage: data.page,
          pageSize: data.limit || pageSize,
          totalPages: data.totalPages,
          totalItems: data.totalDocs || data.docs.length,
          hasNextPage: data.hasNextPage || data.page < data.totalPages,
          hasPrevPage: data.hasPrevPage || data.page > 1,
        },
      };
    }
    
    // Fallback for non-paginated responses
    return getMockPaginatedData(collectionSlug, page, pageSize);
  } catch (error) {
    console.error(`Error fetching paginated collection '${collectionSlug}':`, error);
    // Fall back to mock data
    return getMockPaginatedData(collectionSlug, page, pageSize);
  }
}

/**
 * Get mock paginated data for a specific collection slug.
 * Simulates server-side pagination by slicing the mock data array.
 * 
 * @param collectionSlug - The collection slug to get mock data for
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Paginated response with mock data
 */
export function getMockPaginatedData(
  collectionSlug: string,
  page: number = 1,
  pageSize: number = 10
): PaginatedResponse {
  const mockData = mockExternalData as Record<string, any>;
  
  if (!(collectionSlug in mockData)) {
    console.warn(`No mock data available for collection '${collectionSlug}'`);
    return {
      data: [],
      pagination: {
        currentPage: page,
        pageSize,
        totalPages: 0,
        totalItems: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
  
  const allData = mockData[collectionSlug];
  
  // Handle single object (non-array) data
  if (!Array.isArray(allData)) {
    return {
      data: [allData],
      pagination: {
        currentPage: 1,
        pageSize: 1,
        totalPages: 1,
        totalItems: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
  
  // Calculate pagination for array data
  const totalItems = allData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageData = allData.slice(startIndex, endIndex);
  
  return {
    data: pageData,
    pagination: {
      currentPage,
      pageSize,
      totalPages,
      totalItems,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
}

/**
 * Calculate page range for pagination UI.
 * Returns an array of page numbers to display, with ellipsis indicators.
 * 
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @param siblingCount - Number of pages to show on each side of current page
 * @returns Array of page numbers and ellipsis indicators (null = ellipsis)
 */
export function getPageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
): (number | null)[] {
  if (totalPages <= 7) {
    // Show all pages if total is 7 or less
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
  
  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;
  
  // Case 1: No ellipsis on either side
  if (!shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  // Case 2: Only right ellipsis
  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftRange = Array.from(
      { length: 3 + 2 * siblingCount },
      (_, i) => i + 1
    );
    return [...leftRange, null, totalPages];
  }
  
  // Case 3: Only left ellipsis
  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightRange = Array.from(
      { length: 3 + 2 * siblingCount },
      (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1
    );
    return [1, null, ...rightRange];
  }
  
  // Case 4: Both ellipsis
  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, null, ...middleRange, null, totalPages];
}
