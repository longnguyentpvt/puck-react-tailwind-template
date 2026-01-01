# Implementation Plan: Payload Data Wrapper Component

## Overview
Create a wrapper component that allows users to select data from Payload CMS collections and render that data dynamically into child components using a template pattern `{{fieldPath}}`.

## Requirements Analysis
1. **Data Selection**: Wrapper component to select single or array data from any Payload collection
2. **Dynamic Rendering**: Children components should render dynamic data using `{{fieldPath}}` pattern
3. **Array Handling**: For array data, provide options to:
   - Repeat children for each item
   - Select specific item by index

## Architecture Design

### 1. PayloadData Wrapper Component
**Location**: `/config/blocks/PayloadData/index.tsx`

**Purpose**: Container component that fetches data from Payload and provides it to child components

**Key Features**:
- Collection selection dropdown (from available Payload collections)
- Data query mode: single document or multiple documents
- For single document: document ID selector
- For array data: rendering mode selector (repeat for each item OR select by index)
- Slot for child components
- Data context provider

**Field Configuration**:
```typescript
{
  collection: "select" // users, media, pages, etc.
  queryMode: "single" | "multiple"
  documentId: "text" // for single mode
  whereConditions: "json" // optional filters for multiple mode
  renderMode: "repeat" | "index" // for array results
  selectedIndex: "number" // for index mode
  items: "slot" // child components
}
```

### 2. Data Fetching Utility
**Location**: `/lib/payload-data.ts`

**Purpose**: Server-side utility to fetch data from Payload collections

**Functions**:
- `fetchPayloadData(collection, queryMode, options)` - Fetches data based on configuration
- Handles both single document and multiple documents queries
- Returns normalized data structure

### 3. Template Parser Utility
**Location**: `/utils/template-parser.ts`

**Purpose**: Parse and replace `{{fieldPath}}` patterns with actual data values

**Functions**:
- `parseTemplate(template, data)` - Replaces template placeholders with data
- `getValueByPath(data, path)` - Retrieves nested values using dot notation (e.g., `user.name`, `items.0.title`)
- Handles missing values gracefully

### 4. Data Context Provider
**Location**: `/config/blocks/PayloadData/context.tsx`

**Purpose**: React context to pass data down to child components

**Features**:
- Provides current data item to descendants
- Supports nested PayloadData components
- Makes data available for template parsing

### 5. Enhanced Child Component Rendering
**Modifications to existing components**: All text-based components (Heading, Text, RichText, Card, etc.)

**Changes**:
- Intercept render phase
- Check if component is within PayloadData context
- Apply template parsing to text fields
- Replace `{{fieldPath}}` with actual values

## Implementation Steps

### Phase 1: Core Infrastructure
1. Create `/lib/payload-data.ts` for data fetching
2. Create `/utils/template-parser.ts` for template parsing
3. Add utility functions and TypeScript types

### Phase 2: PayloadData Component
4. Create `/config/blocks/PayloadData/index.tsx`
5. Implement data fetching in component
6. Add collection selection field
7. Implement single/multiple query modes
8. Add repeat/index rendering modes
9. Create data context provider

### Phase 3: Template Support in Components
10. Create a Higher-Order Component (HOC) or hook to add template parsing support
11. Apply template parsing to text-based components:
    - Heading
    - Text
    - Card (title, description, content, footer)
    - Banner
    - Button (text)
    - Stats (items)
    - Logos (items)

### Phase 4: Configuration & Integration
12. Register PayloadData component in `/config/index.tsx`
13. Add to appropriate category (likely "content" or new "data" category)
14. Update TypeScript types in `/config/types.ts`

### Phase 5: Testing
15. Create E2E tests for PayloadData component
16. Test single document mode
17. Test array mode with repeat
18. Test array mode with index selection
19. Test template parsing in child components
20. Test nested data access with dot notation

## Data Flow

```
1. User adds PayloadData wrapper in Puck editor
2. User selects collection (e.g., "users")
3. User configures query (single ID or multiple with filters)
4. User selects render mode (repeat or index)
5. User adds child components inside PayloadData slot
6. User adds template patterns in child components (e.g., "{{name}}" in Heading)
7. At render time:
   a. PayloadData fetches data from Payload
   b. For repeat mode: renders children once per data item
   c. For index mode: renders children with selected item
   d. Each child component parses templates and replaces with data
8. Final output shows dynamic content from Payload
```

## Example Usage

### Example 1: Display Single User
```
PayloadData (collection: "users", mode: "single", documentId: "123")
  └─ Heading (text: "{{name}}")
  └─ Text (text: "Email: {{email}}")
```

### Example 2: List All Media Items
```
PayloadData (collection: "media", mode: "multiple", renderMode: "repeat")
  └─ Card
      ├─ title: "{{alt}}"
      ├─ description: "{{filename}}"
```

### Example 3: Display Third Item from Array
```
PayloadData (collection: "pages", mode: "multiple", renderMode: "index", index: 2)
  └─ Heading (text: "{{path}}")
```

## Technical Considerations

### Server vs Client
- Data fetching: Server-side (using Payload's server API)
- Template parsing: Runtime (both server and client)
- Context propagation: React context (works in both environments)

### Performance
- Cache Payload instance using React's `cache()` utility
- Implement data caching strategy for collection queries
- Consider pagination for large datasets

### Error Handling
- Gracefully handle missing collections
- Handle missing documents
- Handle invalid field paths in templates
- Show error states in editor

### Type Safety
- Generate types from Payload collections
- Type-safe field path validation
- TypeScript support for template parsing

## Files to Create
1. `/config/blocks/PayloadData/index.tsx` - Main component
2. `/config/blocks/PayloadData/context.tsx` - React context
3. `/lib/payload-data.ts` - Data fetching utilities
4. `/utils/template-parser.ts` - Template parsing utilities
5. `/tests/e2e/payload-data.spec.ts` - E2E tests

## Files to Modify
1. `/config/index.tsx` - Register new component
2. `/config/types.ts` - Add PayloadData types
3. Text-based block components - Add template parsing support

## Benefits
- **Flexibility**: Works with any Payload collection
- **Reusability**: Any component can render dynamic data
- **Simplicity**: Intuitive `{{fieldPath}}` syntax
- **Power**: Supports nested field access and array handling
- **Type Safety**: Leverages existing Payload types
