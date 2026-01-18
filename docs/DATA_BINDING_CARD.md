# Data Binding Feature - Card Component Integration

This document describes the improved data binding approach implemented for the Card component and other child components, where **iteration control is now in the child component** based on user feedback.

## Overview

The data binding system provides a flexible way to work with data collections from Payload CMS in Puck:

1. **Layout Components (Flex/Grid)** have a "Data Binding" section where you can:
   - Select a data source from available Payload collections (using a dropdown)
   - Assign it to a variable name
   - **NO LONGER controls looping** - that's now in the child component

2. **Child Components (Card, etc.)** have:
   - **"Loop through data" checkbox** - Enable to iterate through array data
   - **"Max Items" field** - Control how many items to render
   - Available data payload hints in JSON format
   - Usage examples for binding syntax

## Configuration

### Bindable Collections

Collections available for data binding are configured in `/lib/data-binding/bindable-collections.ts`. To add a new collection:

1. Create the collection in `/collections/` (e.g., `Products.ts`)
2. Register it in `payload.config.ts`
3. Add it to the `BINDABLE_COLLECTIONS` array:

```typescript
export const BINDABLE_COLLECTIONS = [
  { slug: 'products', label: 'Products' },
  { slug: 'categories', label: 'Categories' },
  // Add more as needed
] as const;
```

### Data Sources

The system fetches data from Payload CMS collections via the API at `/api/{collectionSlug}`. If the collection is not available or there's an error, it falls back to mock data defined in `/lib/data-binding/payload-data-source.ts`.

## How to Use

### Step 1: Configure Data Binding on Layout Component

1. Drag a **Flex** or **Grid** component to your canvas
2. Select the component to view its configuration
3. Expand the **"Data Binding"** section
4. Configure the following fields:
   - **Data Source Collection**: Select from available collections in the dropdown (e.g., "Products")
   - **Variable Name**: Choose a name for accessing the data (e.g., "product", "user")

**Note**: The layout component only provides data to the scope. It does NOT control iteration anymore.

### Step 2: Add Child Components

1. Drag a **Card** component (or other component) inside the Flex/Grid
2. Select the Card component
3. You'll see an **"Available Data Payload"** hint showing:
   - The current data scope in JSON format
   - Example usage with `{{variable.property}}` syntax

### Step 3: Enable Iteration in Child Component

1. In the Card configuration, find the **"Loop through data"** option
2. Set it to **"Yes"** to enable iteration through array data
3. Set **"Max Items"** to control how many items to render (0 = unlimited)
4. The Card will now be repeated for each item in the array

### Step 4: Use Data Binding Syntax

In any text field of the Card component, you can use the binding syntax:

```
{{variableName.propertyName}}
```

**Examples:**
- Title: `{{product.name}}`
- Description: `Price: ${{product.price}}`
- Content: `ID: {{product.id}}`

The bindings will be automatically resolved when the page is rendered.

## Example Configuration

### Layout Component (Flex)
```
Data Binding:
  Data Source: products
  Variable Name: product
```

### Child Component (Card)
```
Loop through data: Yes
Max Items: 0 (unlimited)

Title: {{product.name}}
Description: Price: ${{product.price}}
```

### Result
The layout provides the data to the scope. The Card component handles its own iteration, creating one Card for each product with the title and price automatically populated.

## Key Difference from Previous Version

**Before**: Layout components (Flex/Grid) had a "Mode" field that controlled iteration
**Now**: Child components (Card) have a "Loop through data" checkbox that controls iteration

This gives more flexibility - you can have multiple child components in the same layout, and each can independently choose whether to loop through the data or not.

## Mock Data for Testing

The following mock data is available for testing in the editor:

```json
{
  "products": [
    { "id": 1, "name": "Product 1", "price": 99.99, "image": "..." },
    { "id": 2, "name": "Product 2", "price": 149.99, "image": "..." },
    { "id": 3, "name": "Product 3", "price": 199.99, "image": "..." },
    { "id": 4, "name": "Product 4", "price": 249.99, "image": "..." }
  ],
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "categories": [
    { "id": 1, "name": "Electronics", "icon": "📱" },
    { "id": 2, "name": "Clothing", "icon": "👕" },
    { "id": 3, "name": "Home & Garden", "icon": "🏠" }
  ]
}
```

## Technical Implementation

### Components Modified

1. **Flex Component** (`/config/blocks/Flex/index.tsx`)
   - Uses `withData` HOC to add data binding capabilities
   - **Simplified**: Only provides data to scope, no iteration control
   - Type updated to `WithLayout<WithData<{...}>>`

2. **Card Component** (`/config/blocks/Card/index.tsx`)
   - Uses `withDataPayloadHint` HOC to display data hints **and handle iteration**
   - New fields: "Loop through data" checkbox and "Max Items" number input
   - Works seamlessly with existing data binding via `wrapAllWithBindableProps`

3. **withDataPayloadHint HOC** (`/config/components/DataPayloadHint/index.tsx`)
   - Adds custom field showing available data payload
   - **NEW**: Adds "Loop through data" checkbox to enable iteration
   - **NEW**: Adds "Max Items" field to limit number of items
   - **NEW**: Includes `DataIterationWrapper` that handles the actual looping
   - Uses `useDataScope` hook to access parent's data context

4. **withData HOC** (`/config/components/Data/index.tsx`)
   - **Simplified**: Removed "Mode" field and iteration logic
   - Now only provides data to the scope via `DataScopeProvider`
   - Child components control their own iteration behavior

### Data Flow

1. Layout component (Flex/Grid) with data binding provides data to scope via `DataScopeProvider`
2. Data scope is passed down through React Context
3. Child components access scope via `useDataScope` hook
4. **NEW**: Child components with `withDataPayloadHint` control their own iteration with checkbox
5. Text properties are resolved using `{{}}` syntax through `wrapAllWithBindableProps`

## Testing

Integration tests are provided in `/tests/e2e/card-data-binding.spec.ts`. These tests need to be updated to reflect the new iteration control in child components.

To run the tests:

```bash
# Start the application
yarn dev

# In another terminal, run tests
yarn test:e2e tests/e2e/card-data-binding.spec.ts
```

## Benefits Over Previous Approach

1. **More Flexible**: Each child component controls its own iteration independently
2. **Clearer Separation**: Layout provides data, child controls how to use it
3. **Better User Experience**: Simple checkbox to enable/disable looping per component
4. **More Control**: Different children in same layout can iterate or not
5. **Consistent Pattern**: Same approach works for all components with `withDataPayloadHint`

## Future Enhancements

- Apply `withDataPayloadHint` to more components (Button, Heading, Text, etc.)
- Add more sophisticated data source selection (API endpoints, collections, etc.)
- Support nested data scopes with multiple levels
- Add data transformation options (filters, sorting, etc.)
- Add conditional rendering based on data values
