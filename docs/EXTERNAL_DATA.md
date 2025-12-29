# External Data in Puck Components

This guide explains how to load and use external data in Puck components, using the Pet List example as a reference.

## Overview

Puck supports loading external data through the `external` field type combined with arrays for multi-selection. This allows components to fetch and select data from external sources (APIs, databases, etc.) during the editing process.

## ⚠️ Important: Multi-Selection Pattern

**Key Insight**: Puck's `external` field type is designed for **single item selection**. For multiple items (like selecting several pets), you must use `type: "array"` with `arrayFields`:

```typescript
// ✅ CORRECT - For multiple items
pets: {
  type: "array",  // Array container
  getItemSummary: (item) => item.pet.name || "Pet",
  arrayFields: {
    pet: {
      type: "external",  // Single selection per array item
      fetchList: async ({ query }) => {
        // Fetch and return pet data
        return pets.map(p => ({
          value: p,
          label: `${p.name} (${p.species})`
        }));
      }
    }
  }
}

// ❌ WRONG - Dialog closes but selection doesn't persist
pets: {
  type: "external",  // Only works for single selection
  fetchList: async () => { ... }
}
```

**Why this matters**: 
- When users click on an item in the external field modal, Puck stores the selection
- With a single `external` field, only one item can be stored
- The dialog closes but the selection disappears because there's no place to store multiple items
- Using `array` creates individual array items, each with its own external selection

## Architecture

The external data implementation consists of three main parts:

1. **Data Source** - Where the data comes from (API, database, file, etc.)
2. **API Endpoint** - Server route that exposes the data
3. **Puck Component** - Component that uses the `external` field type to fetch and display data

## Implementation Example: Pet List

### 1. Data Source (`lib/external-data.ts`)

Create a module that provides your data. This can be:
- Mock data (for development/examples)
- Database queries
- External API calls

```typescript
export interface Pet {
  id: string;
  name: string;
  description: string;
  species: string;
}

export async function fetchPets(): Promise<Pet[]> {
  // Return data from your source
  return mockPets;
}
```

### 2. API Endpoint (`app/api/pets/route.ts`)

Create a Next.js API route to serve your data:

```typescript
import { NextResponse } from "next/server";
import { fetchPets } from "@/lib/external-data";

export async function GET() {
  try {
    const pets = await fetchPets();
    return NextResponse.json(pets);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch pets" },
      { status: 500 }
    );
  }
}
```

### 3. Puck Component (`config/blocks/PetList/index.tsx`)

Create a Puck component that uses the `array` + `external` pattern for multi-selection:

```typescript
export type PetListProps = WithLayout<{
  pets: Array<{ pet: Pet }>;  // Array of objects with pet field
  title?: string;
  showSpecies?: boolean;
}>;

const PetListInternal: ComponentConfig<PetListProps> = {
  fields: {
    pets: {
      type: "array",  // Array container for multiple selections
      label: "Pets",
      getItemSummary: (item: { pet: Pet }) => item.pet?.name || "Pet",
      arrayFields: {
        pet: {
          type: "external",  // External field per array item
          label: "Select Pet",
          fetchList: async ({ query }) => {
            try {
              // Try relative URL first (works in most cases)
              const response = await fetch('/api/pets');
              const pets = await response.json();
              
              // Filter by search query if provided
              const filteredPets = query
                ? pets.filter((pet: Pet) => 
                    pet.name.toLowerCase().includes(query.toLowerCase())
                  )
                : pets;
              
              // Return data in format expected by Puck
              return filteredPets.map((pet: Pet) => ({
                value: pet,  // The actual data object
                label: `${pet.name} (${pet.species})`,  // Display label
              }));
            } catch (error) {
              console.error("Error loading pets:", error);
              return [];
            }
          },
        },
      },
    },
  },
  render: ({ pets }) => {
    return (
      <div>
        {pets && pets.length > 0 ? (
          pets.map((item, index) => {
            const pet = item.pet;  // Extract pet from array item
            return (
              <div key={pet?.id || index}>
                <h3>{pet?.name}</h3>
                <p>{pet?.description}</p>
              </div>
            );
          })
        ) : (
          <p>No pets available</p>
        )}
      </div>
    );
  },
};
```

## Key Points

### Array + External Field Pattern

For multi-selection, use this configuration:

```typescript
{
  type: "array",  // Container for multiple items
  getItemSummary: (item) => item.fieldName.displayProperty,  // Summary shown in UI
  arrayFields: {
    fieldName: {
      type: "external",  // External selector per item
      fetchList: async ({ query }) => {
        // Return array of { value, label } objects
      }
    }
  }
}
```

**Key requirements:**
- **type**: `"array"` for container, `"external"` for each item's field
- **getItemSummary**: Function that returns display text for each array item
- **arrayFields**: Defines fields for each array item
- **fetchList**: Async function that returns `Array<{ value, label }>`
  - `value`: The actual data object to store
  - `label`: Human-readable text shown in selection modal
  - `query`: Optional search parameter for filtering

### Single Selection

If you only need single item selection (not common), use:

```typescript
{
  type: "external",
  fetchList: async ({ query }) => { ... }
}
```

### URL Handling

When fetching data, try relative URLs first (works in most cases):

```typescript
try {
  // Try relative URL first
  const response = await fetch('/api/pets');
  if (response.ok) {
    const pets = await response.json();
    // Process and return
  }
} catch (error) {
  // Fallback to absolute URL if needed
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const response = await fetch(`${baseUrl}/api/pets`);
  // Process and return
}
```

### Rendering External Data

With the array + external pattern, iterate over the array and extract the data:

```typescript
render: ({ pets }) => {
  return (
    <div>
      {pets && pets.length > 0 ? (
        pets.map((item, index) => {
          const pet = item.pet;  // Extract from array item
          return (
            <div key={pet?.id || index}>
              <h3>{pet?.name}</h3>
              <p>{pet?.description}</p>
            </div>
          );
        })
      ) : (
        <p>No items selected</p>
      )}
    </div>
  );
}
```

```typescript
render: ({ pets }) => {
  return (
    <div>
      {pets && pets.length > 0 ? (
        pets.map((pet) => (
          <div key={pet.id}>
            <Heading>{pet.name}</Heading>
            <Text>{pet.description}</Text>
          </div>
        ))
      ) : (
        <div>No pets available</div>
      )}
    </div>
  );
}
```

## Usage in Puck Editor

1. **Add Component**: Drag the PetList component to your page
2. **Select Data**: Click the "External item" button in the component properties
3. **Choose Items**: Select one or more items from the modal that appears
4. **Preview**: See the selected data rendered in real-time in the editor

## Benefits

- **Separation of Concerns**: Data fetching logic is separate from component rendering
- **Type Safety**: Full TypeScript support for data structures
- **Flexible**: Works with any data source (APIs, databases, CMS, etc.)
- **User-Friendly**: Non-technical users can select data without knowing about APIs
- **Real-time**: Data can be refreshed each time the editor loads

## Advanced Patterns

### Search/Filtering

The `query` parameter in `fetchList` allows implementing search:

```typescript
fetchList: async ({ query }) => {
  const response = await fetch(`${baseUrl}/api/pets?search=${query}`);
  // ...
}
```

### Pagination

For large datasets, implement pagination in your API:

```typescript
fetchList: async ({ query, page = 1 }) => {
  const response = await fetch(`${baseUrl}/api/pets?page=${page}&q=${query}`);
  // ...
}
```

### Caching

Implement caching to improve performance:

```typescript
const cache = new Map();

fetchList: async ({ query }) => {
  const cacheKey = query || 'all';
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const data = await fetchData();
  cache.set(cacheKey, data);
  return data;
}
```

## Troubleshooting

### "0 results" in modal

- Check that your API endpoint is accessible
- Verify the URL construction (absolute vs relative)
- Check browser console for fetch errors
- Ensure data is returned in correct format: `{ value, label }`

### Data not rendering

- Verify the component's props type matches the data structure
- Check that the render function handles empty/null data
- Ensure the data is being passed correctly from props

### Server-side vs Client-side

- Use absolute URLs for fetchList to work in both contexts
- Set `NEXT_PUBLIC_SITE_URL` environment variable for production
- Test in both editor and published page views

## Examples

See the complete implementation in:
- **Data Source**: `lib/external-data.ts`
- **API**: `app/api/pets/route.ts`
- **Component**: `config/blocks/PetList/index.tsx`
- **Demo Page**: Visit `/pets` and `/pets/edit`

## Resources

- [Puck Documentation](https://puckeditor.com/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
