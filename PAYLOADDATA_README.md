# PayloadData Wrapper Component

## Overview

The `PayloadData` component is a powerful wrapper that allows you to fetch data from any Payload CMS collection and dynamically render it in child components using template patterns.

## Features

- ✅ Select data from any Payload collection (Users, Media, Pages, or custom collections)
- ✅ Support for both single document and multiple documents queries
- ✅ Dynamic template rendering using `{{fieldPath}}` pattern
- ✅ Array handling with two modes:
  - **Repeat mode**: Renders children for each item in the array
  - **Index mode**: Renders children for a specific item by index
- ✅ Nested field access using dot notation (e.g., `{{user.profile.name}}`)
- ✅ Works with all text-based components (Heading, Text, Card, Button)

## Usage

### Basic Example: Display Single User

1. Add a `PayloadData` component to your page in the Puck editor
2. Configure it:
   - Collection: `users`
   - Query Mode: `Single Document`
   - Document ID: `[user-id]`
   - Render Mode: (not applicable for single document)

3. Add child components inside PayloadData:
   - Heading: `{{name}}`
   - Text: `Email: {{email}}`

The result will display the user's name and email dynamically from Payload.

### Example: List All Media Items

1. Add a `PayloadData` component
2. Configure it:
   - Collection: `media`
   - Query Mode: `Multiple Documents`
   - Limit: `10`
   - Render Mode: `Repeat for each item`

3. Add child components:
   - Card with:
     - Title: `{{alt}}`
     - Description: `Uploaded: {{createdAt}}`

This will render a Card for each media item in your collection.

### Example: Display Specific Item from Array

1. Add a `PayloadData` component
2. Configure it:
   - Collection: `pages`
   - Query Mode: `Multiple Documents`
   - Render Mode: `Select by index`
   - Selected Index: `2` (third item, 0-based indexing)

3. Add child components:
   - Heading: `{{path}}`
   - Text: `{{content.title}}`

This will render only the third page from your pages collection.

## Template Pattern Syntax

### Basic Field Access
```
{{fieldName}}
```
Example: `{{name}}`, `{{email}}`, `{{alt}}`

### Nested Field Access
```
{{parent.child.field}}
```
Example: `{{user.profile.name}}`, `{{content.title}}`

### Array Element Access
```
{{items.0.title}}
```
Example: `{{images.0.url}}`, `{{tags.2.name}}`

## Supported Components

The following components support template parsing:

### Text Components
- **Heading**: `text` field
- **Text**: `text` field

### Card Component
- `title` field
- `description` field
- `content` field
- `footer` field
- `actionText` field
- `href` field
- `actionHref` field

### Button Component
- `label` field
- `href` field

## Component Configuration

### Collection
Select which Payload collection to fetch data from:
- `users` - User accounts
- `media` - Media files
- `pages` - Page content
- Custom collections (if defined in your Payload config)

### Query Mode

#### Single Document
Fetches one specific document by ID.
- **Document ID**: Enter the ID of the document to fetch

#### Multiple Documents
Fetches multiple documents from the collection.
- **Limit**: Maximum number of documents to fetch (1-100)
- **Where Conditions**: Optional JSON filters (advanced)

Example where conditions:
```json
{
  "status": {
    "equals": "published"
  }
}
```

### Render Mode (for arrays)

#### Repeat for Each Item
Renders child components once for each item in the data array.

**Use case**: Display a list of cards, one for each user or media item.

#### Select by Index
Renders child components only for the item at the specified index.
- **Selected Index**: 0-based index (0 = first item, 1 = second item, etc.)

**Use case**: Display a featured item or a specific entry from a list.

## Technical Implementation

### Architecture

```
PayloadData Component
├── Server Action (fetchDataForPayloadComponent)
├── Payload Data Utility (fetchPayloadData)
├── Context Provider (PayloadDataProvider)
└── Template Parser (parseTemplate, useTemplateParsing)
```

### Data Flow

1. User configures PayloadData in Puck editor
2. `resolveData` function fetches data via server action
3. Data is stored in component props (`_payloadData`)
4. `render` function provides data via React Context
5. Child components use `useTemplateParsing` hook
6. Template patterns are replaced with actual data values

### Files Created

- `/config/blocks/PayloadData/index.tsx` - Main component
- `/config/blocks/PayloadData/context.tsx` - React context provider
- `/config/blocks/PayloadData/server/actions.ts` - Server action for data fetching
- `/config/components/TemplateParsing.tsx` - Template parsing hook
- `/lib/payload-data.ts` - Payload data fetching utility
- `/utils/template-parser.ts` - Template pattern parser

### Files Modified

- `/config/index.tsx` - Added PayloadData to components
- `/config/server.tsx` - Added PayloadData to server config
- `/config/types.ts` - Added PayloadData type
- `/config/blocks/Heading/index.tsx` - Added template parsing
- `/config/blocks/Text/index.tsx` - Added template parsing
- `/config/blocks/Card/index.tsx` - Added template parsing
- `/config/blocks/Button/index.tsx` - Added template parsing

## Error Handling

### No Data Available
If the collection query returns no results, PayloadData displays:
> "No data available. Check your collection and query settings."

### Invalid Index
If using index mode with an invalid index, PayloadData displays:
> "No item at index {X}. Available items: {Y}"

### Invalid JSON in Where Conditions
Invalid JSON in the where conditions field will log an error to the console and use an empty filter.

## Best Practices

1. **Use Single Mode for Known IDs**: If you know the document ID, use Single Document mode for better performance.

2. **Limit Results**: When using Multiple Documents mode, set an appropriate limit to avoid fetching too much data.

3. **Clear Field Names**: Use descriptive template patterns that match your Payload field names exactly.

4. **Test with Real Data**: Always test your templates with actual Payload data to ensure field names are correct.

5. **Handle Missing Fields**: The template parser returns an empty string for missing/undefined fields, so your layout won't break.

## Extending

### Adding More Components

To add template parsing support to additional components:

1. Import the hook:
```typescript
import { useTemplateParsing } from "@/config/components/TemplateParsing";
```

2. Use it in your render function:
```typescript
render: ({ text }) => {
  const parsedText = useTemplateParsing(text);
  return <div>{parsedText}</div>;
}
```

### Adding More Collections

To support additional collections:

1. Update the `availableCollections` array in `/config/blocks/PayloadData/index.tsx`
2. Ensure your collection is defined in `/payload.config.ts`

## Troubleshooting

### Template patterns not being replaced

- Verify the field name matches your Payload collection schema exactly
- Check that the component supports template parsing (see Supported Components)
- Ensure PayloadData component has valid data (check query settings)

### Build errors related to server-only code

- Ensure `server-only` package is installed
- Verify `/lib/payload-data.ts` has `import 'server-only'` at the top
- Check that Payload imports are only in server-side files

### Component not showing in editor

- Verify PayloadData is registered in both `/config/index.tsx` and `/config/server.tsx`
- Check that the "data" category exists in the categories configuration
- Rebuild the project after making config changes

## Future Enhancements

Potential improvements for future versions:

- [ ] GraphQL query support
- [ ] Real-time data updates
- [ ] Pagination controls
- [ ] Filtering UI for where conditions
- [ ] Template autocomplete based on collection schema
- [ ] Support for relationships and populated fields
- [ ] Caching strategies for improved performance
- [ ] Error boundaries for better error display

## License

This component follows the same license as the parent project.
