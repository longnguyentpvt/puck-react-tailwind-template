# Template Syntax for Dynamic Data Binding

This guide explains how to use template syntax (`{{fieldPath}}`) in Heading and Text components to automatically display data from DataRepeater without needing separate DataBoundText components.

## Overview

Instead of using a separate DataBoundText component for each field, you can now use standard **Heading** and **Text** components with template syntax to dynamically bind data.

### Template Syntax

Use double curly braces `{{fieldPath}}` to reference data fields:

```
{{name}}                    → Displays the "name" field
{{species}}                 → Displays the "species" field  
Pet name is {{name}}        → Displays "Pet name is Buddy"
{{species}}: {{name}}       → Displays "Dog: Buddy"
```

### Nested Fields

Support for dot notation to access nested data:

```
{{owner.name}}              → Displays owner's name
{{address.city}}            → Displays city from address
```

## How It Works

### 1. DataRepeater provides Data Context

When you add pets to DataRepeater, each slot is wrapped with a `DataProvider` that makes the pet data available to all child components.

### 2. Components Process Templates

Heading and Text components automatically detect template syntax and replace placeholders with actual data from the context.

### 3. Dynamic Rendering

At render time, `{{name}}` is replaced with the actual pet name (e.g., "Buddy"), creating dynamic content without manual configuration.

## Usage Examples

### Example 1: Pet Name as Heading

**Setup:**
1. Add DataRepeater component
2. Click "+ Add item" → Select "Buddy" from External item
3. Drag a **Heading** component into Buddy's slot
4. In the Text field, enter: `{{name}}`

**Result:**
- Displays "Buddy" as a heading
- If you add another pet "Whiskers", the same heading configuration shows "Whiskers" in that slot

### Example 2: Custom Format with Multiple Fields

**Setup:**
1. Drag a **Heading** component into a pet slot
2. In the Text field, enter: `{{species}}: {{name}}`

**Result:**
- For Buddy: Displays "Dog: Buddy"
- For Whiskers: Displays "Cat: Whiskers"

### Example 3: Sentence with Data

**Setup:**
1. Drag a **Text** component into a pet slot
2. In the Text field, enter: `Meet {{name}}, a friendly {{species}}!`

**Result:**
- For Buddy: "Meet Buddy, a friendly Dog!"
- For Max: "Meet Max, a friendly Dog!"
- For Luna: "Meet Luna, a friendly Cat!"

### Example 4: Description

**Setup:**
1. Drag a **Text** component
2. In the Text field, enter: `{{description}}`

**Result:**
- Displays the full description for each pet

## Complete Example: Pet Card Layout

Here's how to create a complete pet card using template syntax:

**DataRepeater Slot for one pet:**
```
├─ Heading (size: XL, text: "{{name}}")
├─ Text (size: S, text: "{{species}}")
├─ Text (size: M, text: "{{description}}")
└─ Text (size: S, text: "Age: {{age}} years")
```

**Result for Buddy:**
```
Buddy                           (Heading)
Dog                             (Small text)
A friendly golden retriever...  (Medium text)
Age: 3 years                    (Small text)
```

**Result for Whiskers:**
```
Whiskers                        (Heading)
Cat                             (Small text)
A playful orange tabby...       (Medium text)
Age: 2 years                    (Small text)
```

## Advantages Over DataBoundText

### Using Template Syntax (NEW)

**Pros:**
- ✅ Use familiar Heading and Text components
- ✅ Full control over component styling (size, weight, color, alignment)
- ✅ Mix static text with dynamic data: "Name: {{name}}"
- ✅ Multiple fields in one component: "{{species}} - {{name}}"
- ✅ Fewer components in the component list
- ✅ More flexible and powerful

**Example:**
```
Heading: "{{species}}: {{name}}"
→ Displays: "Dog: Buddy"
```

### Using DataBoundText (OLD)

**Pros:**
- ✅ Field picker UI (dropdown)
- ✅ Clear separation of concerns

**Cons:**
- ❌ Need separate component for each field
- ❌ Can't mix static and dynamic text easily
- ❌ Limited to one field per component
- ❌ Extra component in the palette

**Example:**
```
DataBoundText (fieldPath: "name")
→ Displays: "Buddy"
```

## Comparison Table

| Feature | Template Syntax (`{{}}`) | DataBoundText |
|---------|--------------------------|---------------|
| Component Used | Heading, Text | DataBoundText |
| Field Selection | Type field path | Dropdown picker |
| Mix Static/Dynamic | ✅ "Name: {{name}}" | ❌ One or the other |
| Multiple Fields | ✅ "{{species}} - {{name}}" | ❌ One field only |
| Styling Options | ✅ Full component options | ✅ Typography options |
| Nested Fields | ✅ `{{owner.name}}` | ✅ Dot notation |
| Complexity | Simple syntax | Extra component |

## Available Fields for Pets

When working with pet data in DataRepeater, these fields are available:

- `{{name}}` - Pet's name (e.g., "Buddy")
- `{{species}}` - Dog or Cat
- `{{description}}` - Full description text
- `{{age}}` - Age in years (if available)
- `{{breed}}` - Breed information (if available)

## Tips and Best Practices

### 1. Check Available Fields

Look at the collapsed JSON section in each DataRepeater slot to see what fields are available.

### 2. Use Template Syntax for Flexibility

Template syntax is more powerful when you need to combine multiple fields or add context:

```
"Pet Profile: {{name}} ({{species}})"
"About {{name}}: {{description}}"
```

### 3. Use DataBoundText for Simple Cases

If you just need to display one field with no surrounding text, DataBoundText might be simpler:

```
DataBoundText (fieldPath: "name")
```

### 4. Combine Both Approaches

You can use both in the same slot:

```
├─ Heading (text: "{{name}}")                    ← Template syntax
├─ DataBoundText (fieldPath: "species")          ← DataBoundText
└─ Text (text: "Description: {{description}}")   ← Template syntax
```

### 5. Test with Multiple Pets

Add 2-3 different pets to ensure your template works for all data variations.

## Troubleshooting

### Placeholder Not Replaced

**Symptom:** See `{{name}}` instead of "Buddy"

**Causes:**
1. Component not inside a DataRepeater slot
2. Typo in field name (case-sensitive)
3. Field doesn't exist in data

**Solution:**
- Verify you're inside a DataRepeater slot
- Check the JSON data in collapsed section for correct field name
- Try `{{name}}` instead of `{{Name}}`

### Empty Output

**Symptom:** Nothing displays

**Causes:**
1. Field value is null or undefined
2. Nested path incorrect

**Solution:**
- Check JSON data to verify field has a value
- For nested fields, verify full path: `{{owner.name}}`

### Multiple Placeholders Not Working

**Symptom:** Only first placeholder replaced

**Causes:**
- This shouldn't happen, but if it does, report as bug

**Solution:**
- Try separating into multiple components
- Use spaces between placeholders: `{{name}} - {{species}}`

## Migration Guide

### From DataBoundText to Template Syntax

**Old Way:**
```
Slot Content:
├─ DataBoundText (fieldPath: "name", size: "xl")
├─ DataBoundText (fieldPath: "species", size: "s")
└─ DataBoundText (fieldPath: "description")
```

**New Way:**
```
Slot Content:
├─ Heading (text: "{{name}}", size: "xl")
├─ Text (text: "{{species}}", size: "s")
└─ Text (text: "{{description}}")
```

**Benefits:**
- Fewer components (3 vs 3, but more familiar components)
- More flexibility (can customize Heading vs Text styling)
- Can enhance with static text: "Species: {{species}}"

## Advanced Usage

### Conditional Display with Default Values

While template syntax doesn't support conditionals directly, missing fields simply show the placeholder. You can handle this in your data source or use DataBoundText for defaults.

### Complex Formatting

For complex formatting needs (dates, currencies, etc.), consider:
1. Format data on the server side before sending
2. Use DataBoundText with formatting options
3. Create custom components

### Dynamic Styling

Template syntax only replaces text content. For dynamic styling based on data:
1. Use separate components with conditional field paths
2. Handle in data preprocessing
3. Create custom components with logic

## Summary

Template syntax (`{{fieldPath}}`) provides a powerful, flexible way to display dynamic data in DataRepeater slots using standard Heading and Text components. It's:

- ✅ **Simple**: Just wrap field names in `{{}}`
- ✅ **Flexible**: Mix static and dynamic text
- ✅ **Powerful**: Multiple fields, nested paths
- ✅ **Familiar**: Use existing components
- ✅ **Efficient**: Less configuration needed

Use it when you want maximum flexibility and control over your content layout!
