# External Data in Puck Components

This guide explains how to load and use external data in Puck components, using the Pet List example as a reference.

## Overview

Puck supports loading external data through the `external` field type, which allows components to fetch and select data from external sources (APIs, databases, etc.) during the editing process.

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

Create a Puck component that uses the `external` field type:

```typescript
const PetListInternal: ComponentConfig<PetListProps> = {
  fields: {
    pets: {
      type: "external",
      label: "Pets",
      fetchList: async ({ query }) => {
        try {
          // Construct absolute URL for server-side rendering
          const baseUrl = typeof window !== 'undefined' 
            ? window.location.origin 
            : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
          
          const response = await fetch(`${baseUrl}/api/pets`);
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
  // ... other fields and render function
};
```

## Key Points

### External Field Configuration

The `external` field type requires:
- **type**: Must be `"external"`
- **fetchList**: Async function that returns an array of `{ value, label }` objects
  - `value`: The actual data to be stored in the component props
  - `label`: Human-readable text shown in the selection modal
  - `query`: Optional search parameter passed to filter results

### URL Handling

When fetching data, always use absolute URLs to support server-side rendering:

```typescript
const baseUrl = typeof window !== 'undefined' 
  ? window.location.origin 
  : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
```

### Rendering External Data

In your component's render function, iterate over the selected items:

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
