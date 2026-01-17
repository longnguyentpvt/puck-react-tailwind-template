# Data Binding Feature - Card Component Integration

This document describes the improved data binding approach implemented for the Card component and other child components, replacing the previous DataRender-centric workflow.

## Overview

The new data binding system provides a more intuitive and flexible way to work with data collections in Puck:

1. **Layout Components (Flex/Grid)** now have a "Data Binding" section where you can:
   - Select a data source (collection)
   - Assign it to a variable name
   - Configure list looping behavior

2. **Child Components (Card, etc.)** automatically display:
   - Available data payload from parent layout components
   - JSON format hints showing the data structure
   - Usage examples for binding syntax

## How to Use

### Step 1: Configure Data Binding on Layout Component

1. Drag a **Flex** or **Grid** component to your canvas
2. Select the component to view its configuration
3. Expand the **"Data Binding"** section
4. Configure the following fields:
   - **Mode**: Choose "List (loop)" to repeat child components for each data item
   - **Data Source**: Enter the path to your data (e.g., "products", "users")
   - **Variable Name**: Choose a name for accessing the data (e.g., "product", "user")

### Step 2: Add Child Components

1. Drag a **Card** component (or other component) inside the Flex/Grid
2. Select the Card component
3. You'll see an **"Available Data Payload"** hint at the top showing:
   - The current data scope in JSON format
   - Example usage with `{{variable.property}}` syntax

### Step 3: Use Data Binding Syntax

In any text field of the Card component (or other child components), you can use the binding syntax:

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
  Mode: List (loop)
  Data Source: products
  Variable Name: product
```

### Child Component (Card)
```
Title: {{product.name}}
Description: Price: ${{product.price}}
```

### Result
When rendered, this will create one Card for each product in the data source, with the title and price automatically populated.

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
   - Now uses `withData` HOC to add data binding capabilities
   - Type updated to `WithLayout<WithData<{...}>>`

2. **Card Component** (`/config/blocks/Card/index.tsx`)
   - Now uses `withDataPayloadHint` HOC to display data hints
   - Works seamlessly with existing data binding via `wrapAllWithBindableProps`

3. **New HOC: withDataPayloadHint** (`/config/components/DataPayloadHint/index.tsx`)
   - Adds a custom field showing available data payload
   - Uses `useDataScope` hook to access parent's data context
   - Displays JSON format with usage examples

### Data Flow

1. Layout component (Flex/Grid) with data binding wraps children with `DataScopeProvider`
2. Data scope is passed down through React Context
3. Child components access scope via `useDataScope` hook
4. Text properties are resolved using `{{}}` syntax through `wrapAllWithBindableProps`

## Testing

Integration tests are provided in `/tests/e2e/card-data-binding.spec.ts` covering:

- Adding Flex with data binding configuration
- Adding Card inside Flex
- Verifying payload hints display
- Configuring Card with binding syntax
- Publishing and validating rendered output
- Confirming multiple Card instances render for list data

To run the tests:

```bash
# Start the application
yarn dev

# In another terminal, run tests
yarn test:e2e tests/e2e/card-data-binding.spec.ts
```

## Benefits Over Previous Approach

1. **Clearer Data Flow**: Data configuration is on the layout component where looping happens
2. **Better User Experience**: Payload hints show users exactly what data is available
3. **More Flexible**: Any child component can access parent's data scope
4. **Consistent Pattern**: Same approach works for Flex, Grid, and future layout components
5. **Easier to Understand**: No need for separate DataRender wrapper component

## Future Enhancements

- Apply `withDataPayloadHint` to more components (Button, Heading, Text, etc.)
- Add more sophisticated data source selection (API endpoints, collections, etc.)
- Support nested data scopes with multiple levels
- Add data transformation options (filters, sorting, etc.)
