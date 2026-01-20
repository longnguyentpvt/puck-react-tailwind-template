# Shadcn Pagination Integration with Server-Side Data Binding

This document describes the integration of the Shadcn UI Pagination component with the existing dynamic data binding pattern in this template, supporting server-side pagination.

## Overview

The pagination system integrates seamlessly with the existing `Flex` and `Grid` layout components (referred to as "Flayout" in the requirements) that support data binding. It provides:

1. **Server-side pagination** - Data is fetched page-by-page from the server
2. **URL-based state** - Page number is stored in URL query parameters
3. **Full Shadcn customization** - All styling and behavior options exposed
4. **Data binding integration** - Works with existing DataScopeProvider pattern

## Architecture

### Components

1. **Pagination Block** (`/config/blocks/Pagination/index.tsx`)
   - Puck component that renders pagination controls
   - Reads pagination metadata from DataScopeContext
   - Updates URL parameters for server-side pagination
   - Supports client-side event-based pagination mode

2. **Pagination Data Source** (`/lib/data-binding/pagination-data-source.ts`)
   - Utilities for fetching paginated data from Payload CMS
   - Mock data pagination for development/testing
   - Helper functions for calculating page ranges

3. **PaginatedData HOC** (`/config/components/PaginatedData/index.tsx`)
   - Higher-order component for layout components
   - Fetches paginated data based on URL parameters
   - Provides pagination metadata to DataScopeContext

### Data Flow

```
URL (?page=2) 
  ↓
PaginatedDataWrapper (reads page from URL)
  ↓
fetchPaginatedData() (fetches page 2 data)
  ↓
DataScopeProvider (provides { items: [...], pagination: {...} })
  ↓
Child Components (Card, etc. - render items)
  ↓
Pagination Component (reads pagination from scope, renders controls)
  ↓
User clicks page → URL updates → cycle repeats
```

## Usage Guide

### Basic Setup (Server-Side Pagination)

#### Step 1: Configure Layout with Paginated Data Binding

1. Drag a **Flex** or **Grid** component to your canvas
2. In the component configuration, expand **"Data Binding with Pagination"**
3. Configure:
   - **Data Source Collection**: Select "Products" (or your collection)
   - **Variable Name**: Enter "product" (variable name for data access)
   - **Enable Pagination**: Select "Yes"
   - **Items Per Page**: Enter 6 (or desired page size)

**Note**: The standard "Data Binding" section provides all data. Use "Data Binding with Pagination" for paginated subsets.

#### Step 2: Add Child Components

1. Drag **Card** components inside the Flex/Grid
2. Configure the Card:
   - **Loop through data**: Select "Yes"
   - **Max Items**: Leave at 0 (pagination controls the limit)
   - **Title**: `{{product.name}}`
   - **Description**: `Price: ${{product.price}}`

#### Step 3: Add Pagination Component

1. Drag **Pagination** component inside the same Flex/Grid (after Cards)
2. Configure options as desired (see Customization Options below)
3. The pagination automatically:
   - Reads pagination metadata from the data scope
   - Displays page numbers, prev/next buttons
   - Updates URL when pages are clicked

#### Step 4: Publish and Test

1. Click **Publish** to save the page
2. Navigate to the published page
3. Pagination controls should appear at the bottom
4. Clicking pages updates the URL (`?page=2`) and reloads data

### Example Configuration

#### Flex Component
```
Data Binding with Pagination:
  Data Source: products
  Variable Name: product
  Enable Pagination: Yes
  Items Per Page: 6
```

#### Card Component
```
Loop through data: Yes
Max Items: 0
Title: {{product.name}}
Description: {{product.category}} - ${{product.price}}
```

#### Pagination Component
```
Mode: Server-side (URL-based)
Sibling Page Count: 1
Show First/Last Buttons: No
Alignment: Center
```

### Result
- Shows 6 products per page
- Pagination controls at bottom
- Page 1 shows products 1-6, Page 2 shows 7-12, etc.
- URL updates: `/your-page?page=2`

## Customization Options

### Pagination Component Props

#### Behavior Options

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `mode` | "server" \| "client" | "server" | Server-side (URL) or client-side (event) pagination |
| `siblingCount` | number | 1 | Number of page buttons to show on each side of current page |
| `showFirstLast` | boolean | false | Show "First" and "Last" page buttons |

#### Styling Options

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `align` | "start" \| "center" \| "end" | "center" | Horizontal alignment of pagination controls |
| `className` | string | "" | Custom Tailwind CSS classes |
| `variant` | "default" \| "outline" \| "ghost" | "default" | Shadcn button variant |
| `size` | "default" \| "sm" \| "lg" \| "icon" | "default" | Shadcn button size |
| `disabledClassName` | string | "opacity-50 cursor-not-allowed" | Classes for disabled state |

#### Label Options (Accessibility)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `previousLabel` | string | "Previous" | Text for previous button |
| `nextLabel` | string | "Next" | Text for next button |
| `firstLabel` | string | "First" | Text for first button (if shown) |
| `lastLabel` | string | "Last" | Text for last button (if shown) |

### Styling Examples

#### Centered with outline style
```
align: center
variant: outline
size: default
className: "mt-8"
```

#### Right-aligned with custom colors
```
align: end
variant: ghost
className: "mt-4 text-blue-600"
```

#### Large buttons with first/last
```
size: lg
showFirstLast: true
siblingCount: 2
```

## Server-Side Implementation

### Mock Data Source (Development)

The system includes a mock paginated data source (`getMockPaginatedData`) that simulates server-side pagination:

```typescript
// Returns page 2 with 6 items
const result = getMockPaginatedData('products', 2, 6);
// result = {
//   data: [...], // Items 7-12
//   pagination: {
//     currentPage: 2,
//     pageSize: 6,
//     totalPages: 3,
//     totalItems: 15,
//     hasNextPage: true,
//     hasPrevPage: true,
//   }
// }
```

### Production Data Source (Payload CMS)

For production with Payload CMS, the `fetchPaginatedData` function calls your Payload API:

```typescript
// Fetches from /api/products?page=2&limit=6
const result = await fetchPaginatedData({
  collectionSlug: 'products',
  page: 2,
  pageSize: 6,
});
```

The API should return Payload's standard pagination format:
```json
{
  "docs": [...],
  "page": 2,
  "limit": 6,
  "totalPages": 3,
  "totalDocs": 15,
  "hasNextPage": true,
  "hasPrevPage": true
}
```

### Custom API Integration

To integrate with a custom API:

1. Update `fetchPaginatedData` in `/lib/data-binding/pagination-data-source.ts`
2. Map your API's response format to `PaginatedResponse`
3. Ensure pagination metadata is included

Example for custom API:
```typescript
export async function fetchPaginatedData(params: PaginationParams): Promise<PaginatedResponse> {
  const response = await fetch(`/api/custom/${params.collectionSlug}`, {
    method: 'POST',
    body: JSON.stringify({
      page: params.page,
      pageSize: params.pageSize,
    }),
  });
  
  const data = await response.json();
  
  return {
    data: data.items,
    pagination: {
      currentPage: data.currentPage,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
      totalItems: data.total,
      hasNextPage: data.currentPage < data.totalPages,
      hasPrevPage: data.currentPage > 1,
    },
  };
}
```

## Advanced Features

### Client-Side Pagination Mode

While server-side is the primary mode, client-side pagination is supported:

1. Set Pagination `mode` to "client"
2. Use the standard "Data Binding" (not paginated) on Flex/Grid
3. Pagination emits `pagination:change` events instead of updating URL
4. Listen to events to update component state:

```typescript
useEffect(() => {
  const handlePageChange = (e: CustomEvent) => {
    const newPage = e.detail.page;
    // Update your state/refetch data
  };
  
  window.addEventListener('pagination:change', handlePageChange);
  return () => window.removeEventListener('pagination:change', handlePageChange);
}, []);
```

### Page Size Selector

To add a page size selector:

1. Create a custom Select component
2. Update URL parameter `pageSize`
3. PaginatedDataWrapper will automatically refetch with new size

### URL Query Parameters

Supported URL parameters:
- `?page=2` - Current page number (1-indexed)
- `?pageSize=10` - Items per page (optional, uses component default)

### Pagination UI Behavior

The pagination component intelligently shows/hides page numbers:

- **1-7 pages**: Shows all page numbers
- **8+ pages**: Shows first, last, current +/- siblings, with ellipsis
- **Examples**:
  - Page 1 of 10: `1 2 3 ... 10`
  - Page 5 of 10: `1 ... 4 5 6 ... 10`
  - Page 10 of 10: `1 ... 8 9 10`

Controlled by `siblingCount` prop (default: 1).

## Data Scope Structure

When pagination is enabled, the data scope contains:

```typescript
{
  [variableName]: [...items],  // Current page items
  pagination: {
    currentPage: 2,
    pageSize: 6,
    totalPages: 3,
    totalItems: 15,
    hasNextPage: true,
    hasPrevPage: true,
  }
}
```

Child components can access:
- `{{product.name}}` - Item properties
- `{{pagination.currentPage}}` - Current page (if needed)
- `{{pagination.totalItems}}` - Total item count

## Testing

### Mock Data

The system includes 15 mock products for testing pagination:
- Page 1 (size 6): Products 1-6
- Page 2 (size 6): Products 7-12
- Page 3 (size 6): Products 13-15

### End-to-End Tests

See `/tests/e2e/pagination.spec.ts` for comprehensive test coverage:
- Pagination controls rendering
- Page navigation
- Data updates on page change
- URL parameter updates
- Customization options

To run tests:
```bash
yarn dev  # Start development server
yarn test:e2e tests/e2e/pagination.spec.ts
```

## Migration from Non-Paginated

To add pagination to existing data-bound layouts:

1. **Replace data binding**:
   - Remove standard "Data Binding" configuration
   - Add "Data Binding with Pagination" configuration
   - Set same source and variable name
   - Enable pagination and set page size

2. **Add Pagination component**:
   - Drag Pagination block to layout
   - Configure as desired
   - Pagination auto-reads from data scope

3. **Test**:
   - Publish page
   - Verify pagination controls appear
   - Click through pages to verify data loads

## Troubleshooting

### Pagination doesn't appear
- Ensure parent Flex/Grid has "Data Binding with Pagination" configured
- Check "Enable Pagination" is set to "Yes"
- Verify pagination metadata is in data scope (check console)

### Page doesn't reload on click
- Ensure Pagination `mode` is "server" (URL-based)
- Check URL updates when clicking pages
- Verify PaginatedDataWrapper is reading URL params

### Wrong items displayed
- Check "Items Per Page" matches pagination configuration
- Verify Card "Loop through data" is enabled
- Check variable name matches between data binding and Card

### Pagination shows wrong total
- Verify mock data or API returns correct totalPages/totalItems
- Check pagination metadata in DataScopeContext

## Best Practices

1. **Consistent page sizes**: Use the same page size in data binding and any UI selectors
2. **Loading states**: Add loading indicators during page transitions
3. **URL persistence**: Server-side mode preserves page in URL for bookmarking/sharing
4. **Accessibility**: Use descriptive labels for screen readers
5. **Mobile-friendly**: Test pagination on mobile devices (buttons adapt to screen size)
6. **Error handling**: Handle cases where API fails or returns unexpected data

## API Reference

### Helper Functions

#### `getPageRange(currentPage, totalPages, siblingCount)`
Calculates which page numbers to show in pagination UI.

**Parameters:**
- `currentPage: number` - Current page (1-indexed)
- `totalPages: number` - Total number of pages
- `siblingCount: number` - Pages to show on each side of current

**Returns:** `(number | null)[]` - Array of page numbers (null = ellipsis)

**Example:**
```typescript
getPageRange(5, 10, 1)
// Returns: [1, null, 4, 5, 6, null, 10]
```

#### `getMockPaginatedData(slug, page, pageSize)`
Gets mock paginated data for testing.

**Parameters:**
- `slug: string` - Collection slug (e.g., "products")
- `page: number` - Page number (1-indexed)
- `pageSize: number` - Items per page

**Returns:** `PaginatedResponse` - Paginated data with metadata

#### `fetchPaginatedData(params)`
Fetches paginated data from Payload CMS or custom API.

**Parameters:**
- `params: PaginationParams` - Object with page, pageSize, collectionSlug

**Returns:** `Promise<PaginatedResponse>` - Paginated data with metadata

## Future Enhancements

Potential improvements for future versions:

1. **Page size selector component** - Built-in UI for changing items per page
2. **Jump to page input** - Text field to jump to specific page
3. **Keyboard navigation** - Arrow keys for prev/next
4. **Infinite scroll mode** - Load more on scroll instead of pages
5. **Virtual scrolling** - For large datasets
6. **Advanced filtering** - Combine with search/filter components
7. **Sorting integration** - Sort controls that preserve pagination
8. **Cache management** - Remember visited pages to avoid refetch

## Related Documentation

- [Data Binding Card Integration](./DATA_BINDING_CARD.md) - Core data binding system
- [Shadcn UI Pagination](https://ui.shadcn.com/docs/components/pagination) - Base component docs
- [Puck Documentation](https://puckeditor.com/docs) - Puck editor fundamentals
