# Data Binding Feature - Card Component Integration & Swagger API Support

This document describes the data binding approach implemented for the Card component and other child components, including the new **Swagger API integration** feature.

## Overview

The data binding system provides a flexible way to work with data from multiple sources in Puck:

1. **Layout Components (Flex/Grid)** have a "Data Binding" section where you can:
   - Choose between **Payload Collection** or **Swagger API** as data source
   - For Collections: Select from available Payload collections
   - For APIs: Configure Swagger API endpoint, parameters, and authentication
   - Assign data to a variable name
   - **NO LONGER controls looping** - that's now in the child component

2. **Child Components (Card, etc.)** have:
   - **"Loop through data" checkbox** - Enable to iterate through array data
   - **"Max Items" field** - Control how many items to render
   - Available data payload hints showing data structure
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

### Swagger API Sources

API sources available for data binding are configured in `/lib/data-binding/bindable-collections.ts`. To add a new API:

1. Prepare your Swagger/OpenAPI JSON specification (2.0 or 3.x)
2. Host it at a publicly accessible URL or place it in `/public/examples/`
3. Add it to the `SWAGGER_API_SOURCES` array:

```typescript
export const SWAGGER_API_SOURCES = [
  {
    id: 'my-api',
    label: 'My Custom API',
    swaggerUrl: '/examples/my-swagger.json', // or https://...
  },
  // Add more as needed
] as const;
```

### Data Sources

The system supports two types of data sources:

1. **Payload Collections**: Fetches data from Payload CMS via `/api/{collectionSlug}`
2. **Swagger APIs**: Fetches data from API endpoints defined in Swagger/OpenAPI specifications

Both support fallback to mock data if the actual source is unavailable.

## How to Use - Payload Collections

### Step 1: Configure Data Binding on Layout Component

1. Drag a **Flex** or **Grid** component to your canvas
2. Select the component to view its configuration
3. Expand the **"Data Binding"** section
4. Select **"Payload Collection"** as Data Source Type
5. Configure the following fields:
   - **Data Source Collection**: Select from available collections in the dropdown (e.g., "Products")
   - **Variable Name**: Choose a name for accessing the data (e.g., "product", "user")

**Note**: The layout component only provides data to the scope. It does NOT control iteration anymore.

## How to Use - Swagger APIs

### Step 1: Configure API Data Binding on Layout Component

1. Drag a **Flex** or **Grid** component to your canvas
2. Select the component to view its configuration
3. Expand the **"Data Binding"** section
4. Select **"Swagger API"** as Data Source Type
5. Configure the following fields:
   - **API Source**: Select from available Swagger APIs (e.g., "Sample Products API")
   - **API Endpoint**: Enter the endpoint ID (format: "METHOD /path", e.g., "GET /products")
   - **API Parameters** (Optional): Enter parameters as JSON object
     ```json
     {
       "limit": 10,
       "category": "electronics"
     }
     ```
   - **Variable Name**: Choose a name for accessing the data (e.g., "product")

**Note**: The layout component fetches data from the API and provides it to the scope.

### Step 2: Configure API Parameters

API parameters are provided as a JSON object in the "API Parameters" textarea. You can specify:

- **Query Parameters**: Included in the URL query string
- **Path Parameters**: Replace `{param}` placeholders in the endpoint path
- **Header Parameters**: Added to request headers

Example for endpoint "GET /products/{id}":
```json
{
  "id": "123",
  "limit": 10,
  "Authorization": "Bearer token123"
}
```

### Step 3: Add Child Components

1. Drag a **Card** component (or other component) inside the Flex/Grid
2. Select the Card component
3. You'll see an **"Available Data Payload"** hint showing:
   - The data source type (API)
   - The API endpoint being used
   - Example usage with `{{variable.property}}` syntax

### Step 4: Use Data Binding Syntax

Same as with collections - use the binding syntax in any text field:

```
{{variableName.propertyName}}
```

**Examples for API data:**
- Title: `{{product.name}}`
- Description: `Price: ${{product.price}}`
- Category: `{{product.category}}`

The bindings will be automatically resolved with the API response data.

## Common Steps for Both Sources

### Enable Iteration in Child Component

1. In the Card configuration, find the **"Loop through data"** option
2. Set it to **"Yes"** to enable iteration through array data
3. Set **"Max Items"** to control how many items to render (0 = unlimited)
4. The Card will now be repeated for each item in the array

### Use Data Binding Syntax

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

### Payload Collections Mock Data

The following mock data is available for testing collections in the editor:

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

### Sample Swagger API

A sample Swagger 2.0 specification is provided at `/public/examples/sample-swagger.json` for testing API integration. It includes:

- **GET /products** - Returns a list of products with optional category and limit parameters
- **POST /products** - Create a new product
- **GET /products/{id}** - Get a specific product by ID
- **GET /categories** - Returns a list of categories

Example response from GET /products:
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 999.99,
    "category": "electronics",
    "inStock": true
  },
  {
    "id": 2,
    "name": "T-Shirt",
    "price": 19.99,
    "category": "clothing",
    "inStock": true
  }
]
```

## Swagger API Integration Architecture

### Parser Module (`/lib/swagger/`)

The Swagger integration is implemented in a separate module with the following components:

1. **types.ts** - TypeScript type definitions
   - `ApiEndpoint` - Represents a parsed API endpoint
   - `ApiParameter` - Parameter definition
   - `ParsedSwagger` - Complete parsed specification
   - `ApiSourceConfig` - Configuration for API data source

2. **parser.ts** - Swagger/OpenAPI parser
   - `parseSwaggerSpec()` - Parse Swagger 2.0 or OpenAPI 3.x specs
   - `findEndpointById()` - Find endpoint by ID
   - `generateExampleFromSchema()` - Generate example data from JSON schema
   - Supports both Swagger 2.0 and OpenAPI 3.x formats
   - Handles $ref schema references
   - Extracts parameters, request bodies, and response schemas

3. **api-fetcher.ts** - API data fetching
   - `fetchSwaggerSpec()` - Fetch and cache Swagger specifications
   - `fetchSwaggerApiData()` - Fetch data from API endpoint
   - `generateMockDataFromEndpoint()` - Generate mock data from schema
   - Builds request URLs with path and query parameters
   - Handles request headers and body
   - Supports GET, POST, PUT, PATCH, DELETE methods

### Integration Points

1. **bindable-collections.ts**
   - Added `SWAGGER_API_SOURCES` array for configuring API sources
   - Each entry includes: id, label, and swaggerUrl

2. **payload-data-source.ts**
   - Extended with `fetchApiData()` for API requests
   - Extended with `getMockApiData()` for fallback data

3. **Data component** (`/config/components/Data/index.tsx`)
   - Extended `DataFieldProps` to support both source types
   - Added `sourceType` field (collection or api)
   - Added API-specific fields: apiSource, apiEndpoint, apiParameters
   - `DataWrapper` component uses useEffect to fetch API data asynchronously
   - Supports dynamic parameter configuration via JSON

4. **DataPayloadHint component** (`/config/components/DataPayloadHint/index.tsx`)
   - Updated to detect and display API source information
   - Shows API endpoint and source in hints
   - Maintains support for collection hints

## Technical Implementation

### Components Modified

1. **Flex Component** (`/config/blocks/Flex/index.tsx`)
   - Uses `withData` HOC to add data binding capabilities
   - **Simplified**: Only provides data to scope, no iteration control
   - Supports both collection and API sources
   - Type updated to `WithLayout<WithData<{...}>>`

2. **Card Component** (`/config/blocks/Card/index.tsx`)
   - Uses `withDataPayloadHint` HOC to display data hints **and handle iteration**
   - New fields: "Loop through data" checkbox and "Max Items" number input
   - Works seamlessly with existing data binding via `wrapAllWithBindableProps`

3. **withDataPayloadHint HOC** (`/config/components/DataPayloadHint/index.tsx`)
   - Adds custom field showing available data payload
   - Adds "Loop through data" checkbox to enable iteration
   - Adds "Max Items" field to limit number of items
   - Includes `DataIterationWrapper` that handles the actual looping
   - Uses `useDataScope` hook to access parent's data context
   - **NEW**: Detects and displays API source information

4. **withData HOC** (`/config/components/Data/index.tsx`)
   - **Enhanced**: Now supports both collection and API sources
   - Added source type selection (radio buttons)
   - Added API configuration fields
   - `DataWrapper` component handles async API data fetching
   - Maintains backward compatibility with collection sources

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
