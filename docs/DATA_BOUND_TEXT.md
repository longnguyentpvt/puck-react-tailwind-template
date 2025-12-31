# Automatic Data Binding with DataBoundText

## Overview

The **DataBoundText** component solves the manual configuration problem in DataRepeater by providing automatic data binding through React Context. Instead of manually typing field values, components can now automatically read and display data from their parent context.

## The Problem (Before)

Previously, when using DataRepeater, you had to manually configure each component:

1. Look at the JSON data in the collapsed section
2. Drag a Heading component into the slot  
3. Manually type the pet's name into the Text field
4. Repeat for every field and every pet

This was tedious and error-prone.

## The Solution (Now)

With **DataBoundText**, data binding is automatic:

1. Drag DataBoundText into a DataRepeater slot
2. Set the Field Path (e.g., "name", "species", "description")
3. Done! The component automatically displays that field's value

## How It Works

### Architecture

```
DataRepeater
  └─ DataProvider (provides pet data via React Context)
       └─ Slot Content
            └─ DataBoundText (consumes data from Context)
                 └─ Displays field value automatically
```

**Key Components:**

1. **DataContext** (`config/contexts/DataContext.tsx`):
   - React Context for passing data from parent to children
   - Provides hooks: `useDataContext()`, `useDataField()`
   - Supports nested fields with dot notation

2. **DataProvider** (used in DataRepeater):
   - Wraps each slot's content
   - Passes the pet data down to children
   - Makes data available to all components in the slot

3. **DataBoundText** (`config/blocks/DataBoundText/index.tsx`):
   - Component that displays data from context
   - Configurable field path, typography, styling
   - Shows helpful warnings if data not available

## Usage Guide

### Step-by-Step

1. **Add DataRepeater to your page**
   ```
   Components panel → Data category → DataRepeater
   ```

2. **Add pets**
   ```
   - Click "+ Add item" in the Pets field
   - Click "External item" button
   - Select a pet from the modal (e.g., Buddy)
   - Repeat to add more pets
   ```

3. **Add DataBoundText to a pet's slot**
   ```
   - Drag DataBoundText from the Data category
   - Drop it into a pet's slot
   ```

4. **Configure the Field Path**
   ```
   Field Path: name       → Shows "Buddy"
   Field Path: species    → Shows "Dog"
   Field Path: description → Shows pet description
   Field Path: age        → Shows pet age (if available)
   Field Path: breed      → Shows breed (if available)
   ```

5. **Customize appearance**
   ```
   - Size: XS, S, M, L, XL
   - Weight: Light, Normal, Medium, Semibold, Bold
   - Alignment: Left, Center, Right
   - Prefix: "Name: " → Shows "Name: Buddy"
   - Suffix: "!" → Shows "Buddy!"
   ```

### Example Layout

```
DataRepeater (3 pets)
├─ Buddy's Slot
│  ├─ DataBoundText (fieldPath: "name", size: "xl", weight: "bold")
│  ├─ DataBoundText (fieldPath: "species", size: "s", prefix: "Species: ")
│  └─ DataBoundText (fieldPath: "description", size: "m")
├─ Whiskers' Slot
│  ├─ DataBoundText (fieldPath: "name", size: "l")
│  └─ DataBoundText (fieldPath: "description")
└─ Max's Slot
   └─ DataBoundText (fieldPath: "name")
```

## Available Fields

When using the pet API, these fields are available:

- `name` - Pet's name (e.g., "Buddy")
- `species` - Type of animal (e.g., "Dog", "Cat")
- `description` - Description of the pet
- `age` - Pet's age (if available)
- `breed` - Pet's breed (if available)
- `id` - Unique identifier

### Nested Fields

DataBoundText supports dot notation for nested data:

```typescript
// If pet data has nested structure:
{
  "name": "Buddy",
  "owner": {
    "name": "John",
    "city": "Seattle"
  }
}

// You can access:
fieldPath: "name"           → "Buddy"
fieldPath: "owner.name"     → "John"
fieldPath: "owner.city"     → "Seattle"
```

## Comparison: Manual vs Automatic

### Manual Configuration (Old Way)

**With standard Heading/Text components:**

- ❌ Look at JSON in collapsed section
- ❌ Manually type "Buddy" into Heading
- ❌ Manually type description into Text
- ❌ Repeat for every pet
- ❌ Update manually if data changes
- ❌ Error-prone (typos, copy-paste errors)

**Time:** ~2-3 minutes per pet

### Automatic Binding (New Way)

**With DataBoundText:**

- ✅ Drag DataBoundText into slot
- ✅ Set fieldPath: "name"
- ✅ Done! Shows "Buddy" automatically
- ✅ Works for all pets instantly
- ✅ Updates automatically if data changes
- ✅ No typos or errors

**Time:** ~10 seconds per field

## Advanced Features

### Default Values

```typescript
// Set a default value if field doesn't exist
fieldPath: "nickname"
defaultValue: "No nickname"

// If pet doesn't have "nickname" field, shows "No nickname"
```

### Prefix & Suffix

```typescript
// Add text before/after the field value
prefix: "Name: "
fieldPath: "name"
suffix: " (adopted)"

// Result: "Name: Buddy (adopted)"
```

### Styling

```typescript
// Customize appearance
size: "xl"              // Text size
weight: "bold"          // Font weight
align: "center"         // Text alignment
colorType: "preset"     // Color options
presetColor: "primary"  // Use theme colors
```

## Extending to Other Data Sources

DataBoundText works with ANY data source, not just pets:

### Example: Product Data

```typescript
// In a ProductRepeater component
<DataProvider data={product} dataType="product">
  <Content />
</DataProvider>

// DataBoundText can then show:
fieldPath: "productName"
fieldPath: "price"
fieldPath: "inStock"
fieldPath: "category"
```

### Example: User Data

```typescript
// In a UserRepeater component
<DataProvider data={user} dataType="user">
  <Content />
</DataProvider>

// DataBoundText can then show:
fieldPath: "firstName"
fieldPath: "lastName"
fieldPath: "email"
fieldPath: "role"
```

## Troubleshooting

### DataBoundText shows yellow warning

**Symptom:** Component shows yellow box saying "needs to be inside a DataRepeater slot"

**Cause:** DataBoundText is used outside of a DataRepeater (no data context available)

**Solution:** Only use DataBoundText inside DataRepeater slots

### Field shows "not found" message

**Symptom:** Component shows "Field 'xyz' not found"

**Cause:** The field path doesn't exist in the data

**Solutions:**
1. Check the JSON in the collapsed section for available fields
2. Verify field name spelling
3. Use dot notation for nested fields (e.g., "owner.name")
4. Set a default value to show something instead

### Data doesn't update

**Symptom:** Old data still showing after changing selection

**Cause:** Browser caching or stale context

**Solution:** Refresh the page in Puck editor

## Best Practices

### 1. Use Consistent Field Paths

```typescript
// Good - Consistent naming
fieldPath: "name"
fieldPath: "species"
fieldPath: "description"

// Avoid - Inconsistent capitalization
fieldPath: "Name"     // Won't work
fieldPath: "SPECIES"  // Won't work
```

### 2. Provide Default Values

```typescript
// Good - Graceful fallback
fieldPath: "nickname"
defaultValue: "No nickname"

// Avoid - Empty display
fieldPath: "nickname"  // Shows nothing if field missing
```

### 3. Combine with Layout Components

```typescript
// Wrap DataBoundText in Flex/Grid for layout:
Flex (horizontal)
├─ DataBoundText (fieldPath: "name", weight: "bold")
└─ DataBoundText (fieldPath: "species", size: "s")
```

### 4. Use Semantic Styling

```typescript
// Pet name - bold and large
size: "xl", weight: "bold"

// Species - smaller, lighter
size: "s", weight: "normal"

// Description - readable size
size: "m", weight: "light"
```

## Benefits

### For Content Editors

- ✅ **Faster workflow** - No manual data entry
- ✅ **No errors** - Data pulled directly from source
- ✅ **Consistent** - Same fields always show correctly
- ✅ **Flexible** - Easy to add/remove fields

### For Developers

- ✅ **Maintainable** - Data logic centralized
- ✅ **Extensible** - Works with any data type
- ✅ **Type-safe** - TypeScript support
- ✅ **Reusable** - One component for all fields

### For End Users

- ✅ **Accurate data** - No transcription errors
- ✅ **Up-to-date** - Changes reflect immediately
- ✅ **Professional** - Consistent formatting

## Migration Guide

### From Manual Configuration

**Before:**
1. DataRepeater with standard Heading/Text
2. Manual data entry per pet
3. Time-consuming updates

**After:**
1. Replace Heading/Text with DataBoundText
2. Configure field paths once
3. Automatic data binding forever

**Steps:**
1. Open page in Puck editor
2. For each pet slot:
   - Remove manually configured Heading/Text
   - Add DataBoundText components
   - Set field paths (name, species, etc.)
3. Save and publish

## Future Enhancements

Potential improvements for future versions:

1. **Field Selector UI** - Dropdown of available fields instead of text input
2. **Data Transformers** - Format data (uppercase, date formatting, etc.)
3. **Conditional Display** - Show/hide based on field values
4. **Multiple Fields** - Display multiple fields in one component
5. **Rich Formatting** - Bold, italic, links within text

## Summary

DataBoundText + DataRepeater provides a powerful, flexible solution for displaying external data in Puck:

- **Automatic data binding** via React Context
- **No manual configuration** required
- **Works with any data source** (pets, products, users, etc.)
- **Fully customizable** styling and formatting
- **Developer-friendly** and extensible

This approach combines the flexibility of DataRepeater slots with the convenience of automatic data binding, giving you the best of both worlds!
