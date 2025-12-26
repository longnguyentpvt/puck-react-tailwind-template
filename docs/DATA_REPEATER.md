# DataRepeater Component - Dynamic External Data Rendering

The `DataRepeater` component provides a flexible way to render external data with custom layouts. Unlike the fixed `PetList` component, `DataRepeater` creates a slot for each data item, allowing you to drag any components into each slot to build custom data displays.

## Overview

**DataRepeater** solves the problem of rigid, hardcoded data displays by:
1. Loading external data from any source (API, database, etc.)
2. Creating a separate slot/zone for each data item
3. Allowing users to compose custom layouts by dragging components into each slot
4. Supporting multiple layout modes (grid, flex, stack)

## Use Cases

- Display a list of products where you want custom layouts for each product
- Show team members with flexible component arrangements
- Create dynamic content sections from CMS data
- Build data-driven pages with user-controlled layouts

## How It Works

### 1. Select Your Data

In the Puck editor:
1. Add a `DataRepeater` component to your page
2. Click the "External item" button in the Data Source field
3. Select the data items you want to display (e.g., select 3 pets)

### 2. Compose Your Layout

For each data item:
1. The component creates a slot area (bordered box)
2. Drag any Puck components into that slot:
   - Add a `Heading` component to show the name
   - Add a `Text` component for the description  
   - Add a `DataField` component to show specific fields
   - Add any other components you need

### 3. Configure Layout Options

- **Layout Type**: Choose grid, flex row, or vertical stack
- **Columns** (Grid only): Set number of columns (1-6)
- **Gap**: Control spacing between items

## Example: Pet Directory with DataRepeater

Let's recreate the pet directory using DataRepeater for maximum flexibility:

### Step 1: Add DataRepeater Component
- Drag `DataRepeater` from the "Data" category
- Set title to "Our Pets"
- Click "External item" and select all 5 pets

### Step 2: Design Your Pet Card Layout
In each pet's slot area, drag:
1. **Heading** component
   - Manually type the pet name, OR
   - Use placeholder text like "Pet Name"
   
2. **Text** component  
   - Add the description manually, OR
   - Use placeholder text

3. **(Optional) DataField** component
   - Set Field Path to "species"
   - Display As: "Badge"
   - Badge Color: "Blue"

### Step 3: Style and Arrange
- Adjust layout, columns, and gap settings
- Rearrange components within each slot
- Add more components as needed (images, buttons, etc.)

## Advantages Over Fixed Components

### PetList (Fixed Component)
✅ Quick to set up
✅ Consistent styling
❌ Rigid layout - cannot customize per item
❌ Fixed rendering logic
❌ Can't add extra components

### DataRepeater (Flexible Component)
✅ Fully customizable layouts
✅ Add any components you want
✅ Different arrangements per use case
✅ Reusable across data sources
❌ Requires more setup time

## DataField Component

The `DataField` component works with `DataRepeater` to display specific fields from your data:

### Configuration Options

- **Field Path**: The data property to display (e.g., "name", "age", "species")
- **Display As**: 
  - Heading (with customizable size and level)
  - Text (with customizable size)
  - Badge (with color options)
  - Image

### Example DataField Usage

```
Field Path: name
Display As: Heading
Heading Size: L
Heading Level: H3
```

```
Field Path: species
Display As: Badge
Badge Color: Blue
```

```
Field Path: description
Display As: Text
Text Size: Base
```

## Current Limitations

### Data Context
The current implementation shows data items but doesn't automatically pass the data to child components. Each data item's JSON is visible in the collapsed section for reference.

To fully implement data binding to child components, you would need to:
1. Extend Puck's zone system to pass context
2. Create a custom resolver that injects data into child props
3. Use React Context API to share data with nested components

### Workaround
For now, you can:
- Use the DataField component which shows field paths as placeholders
- Manually enter data values into standard components
- Build the layout/structure, then programmatically inject data in production

## Future Enhancements

Potential improvements for production use:

1. **Auto-populate child components** with data from parent context
2. **Data binding expressions** like `{{pet.name}}` in text fields
3. **Conditional rendering** based on data values
4. **Custom transformers** for data formatting
5. **Multiple data sources** per repeater

## Code Example

See the implementation in:
- **Component**: `config/blocks/DataRepeater/index.tsx`
- **Helper**: `config/blocks/DataField/index.tsx`
- **API**: `app/api/pets/route.ts`
- **Data**: `lib/external-data.ts`

## Comparison with Other Approaches

| Approach | Flexibility | Setup Time | Reusability | Best For |
|----------|-------------|------------|-------------|----------|
| Fixed Component (PetList) | Low | Fast | Limited | Single use case, consistent design |
| DataRepeater | High | Medium | High | Multiple use cases, custom layouts |
| Custom per use case | High | Slow | Low | Unique, complex requirements |

## Tips

1. **Start with a single item** - Select just 1-2 data items first to design your layout
2. **Use descriptive titles** - Name your DataRepeater to remember what data it shows
3. **Leverage layout options** - Try different layout types for different screen sizes
4. **Combine approaches** - Use both fixed components and DataRepeater where appropriate
5. **Document your data** - Check the collapsed data section to see available fields

## See Also

- [External Data Guide](./EXTERNAL_DATA.md) - Basic external data concepts
- [PetList Component](../config/blocks/PetList/index.tsx) - Fixed component example
- [Puck Slots Documentation](https://puckeditor.com/) - Official slot documentation
