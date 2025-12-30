# DataRepeater Component - Flexible External Data Rendering with Puck Components

The `DataRepeater` component provides a flexible way to render external data by creating slots for each data item. Unlike fixed components, DataRepeater lets you use any standard Puck components in each slot, ensuring true extensibility.

## Key Concept

**Problem**: Fixed components like `DataField` aren't extensible - when you update Puck's Heading component with new features, `DataField` doesn't know about them.

**Solution**: DataRepeater creates slots where you drag standard Puck components (Heading, Text, Button, etc.). When Puck components get updated, they automatically work in DataRepeater slots.

## Overview

**DataRepeater** enables truly flexible, composable data-driven layouts by:
1. Fetching external data from an API (e.g., pets)
2. Creating a separate slot for each selected data item
3. Allowing users to drag ANY Puck components into each slot
4. Supporting multiple layout modes (grid, flex, stack)

## Use Cases

- Display products where each product has a custom layout
- Show team members with flexible component arrangements
- Create dynamic content from CMS data
- Build data-driven pages with user-controlled layouts

## How It Works

### Step 1: Add DataRepeater and Select Data

1. Add a `DataRepeater` component to your page
2. Click the "External item" button in the "Select Pets" field
3. A modal appears showing all available pets from the API
4. Select the pets you want to display (e.g., Buddy, Whiskers, Max)
5. Click to confirm selection

### Step 2: Compose Your Layout with Standard Puck Components

For each selected pet, a slot area appears. Drag standard Puck components into each slot:

- **Heading component** → For displaying pet names
- **Text component** → For pet descriptions  
- **Button component** → For actions like "Adopt"
- **Space component** → For spacing
- **Any other Puck component** → Fully extensible!

### Step 3: Configure Components Manually

**Important**: Components in slots don't automatically access the pet data. You need to manually configure each component.

Each slot shows the pet's data in a collapsible section at the bottom:

```json
{
  "id": "1",
  "name": "Buddy",
  "species": "Dog", 
  "description": "A friendly golden retriever..."
}
```

**To display pet data:**
1. View the data in the collapsed section
2. Click on a component you dragged into the slot (e.g., Heading)
3. In the right panel, manually type the value (e.g., type "Buddy" into Heading's text field)
4. Repeat for other components (Text for description, etc.)

**See detailed guide**: [Working with Data in Slots](./WORKING_WITH_DATA_IN_SLOTS.md)

**Note**: This manual configuration is a limitation of Puck's slot system. Slots are independent and don't inherit parent data. If you need automatic data binding, use the `PetList` component instead.

## Why This Approach is Better

### ❌ Old Approach (DataField component):
- Hardcoded display types (heading, text, badge)
- When Heading component gets new features, DataField doesn't know
- Not extensible
- Doesn't follow Puck's philosophy

### ✅ New Approach (Slots with Standard Components):
- Use actual Puck components in slots
- Automatic updates when components change
- Truly extensible - use ANY component
- Follows composition over inheritance
- When you customize Heading, it works everywhere including DataRepeater

## Example: Pet Directory

### Setup
1. Add DataRepeater component
2. Set title to "Our Pets"
3. Click "External item", select Buddy, Whiskers, and Max
4. Choose layout: Grid, 3 columns

### For Each Pet Slot
Drag these components:
1. **Heading** (size="xl", rank="3") → Enter pet name manually
2. **Space** (size="2")
3. **Text** (size="base") → Enter pet description
4. **Button** (text="Learn More", variant="primary")

### Result
- 3 pet cards in a grid layout
- Each card uses standard Puck components
- If you later add custom styling to Heading, all pet cards get it
- Fully extensible and maintainable

## Configuration Options

### DataRepeater Props

- **Title**: Optional heading above the data items
- **Select Pets**: External field to fetch and select pets
- **Layout Type**: Grid, Flex Row, or Stack (Vertical)
- **Columns** (Grid only): 1-6 columns
- **Gap**: Spacing between items (None, Small, Medium, Large)
- **Item Template**: The slot where you drag components (repeated for each item)

## Advantages

| Feature | DataRepeater + Slots | Fixed Component |
|---------|---------------------|-----------------|
| Extensibility | ✅ Uses standard Puck components | ❌ Hardcoded rendering |
| Auto-updates | ✅ Component changes apply automatically | ❌ Must update each display type |
| Flexibility | ✅ Any component combination | ❌ Predefined layouts only |
| Maintainability | ✅ Single source of truth (Puck components) | ❌ Duplicate logic |
| Learning Curve | ✅ Use familiar Puck components | ⚠️ Learn custom field types |

## Current Limitations

### Manual Data Configuration Required

**Important**: Components in DataRepeater slots don't automatically access pet data. This is a limitation of Puck's slot system - slots are independent component areas without parent data context.

**How it works:**
1. Pet data is shown in the collapsed section of each slot (JSON format)
2. You manually configure each component with values from that JSON
3. Copy pet name → paste into Heading's text field
4. Copy description → paste into Text component
5. Repeat for each pet and each field

**See**: [Working with Data in Slots](./WORKING_WITH_DATA_IN_SLOTS.md) for detailed guide

### When to Use DataRepeater vs PetList

**Use DataRepeater when:**
- ✅ You need unique, custom layouts per item
- ✅ You want full component flexibility (buttons, images, custom elements)
- ✅ You're okay with manual configuration
- ✅ You have fewer items (< 10 pets)

**Use PetList when:**
- ✅ You want automatic data binding (zero configuration)
- ✅ You need consistent styling across all items
- ✅ Standard fields (name, description) are sufficient
- ✅ You have many items to display quickly

### Potential Future Enhancements

Possible solutions to enable automatic data binding:

1. **Template Variables**: Allow `{{pet.name}}` syntax in text fields
2. **Data Context Provider**: Pass pet data via React Context to slot children
3. **Data-Aware Components**: Create special components that can read from parent data
4. **Visual Field Picker**: UI to select which data fields to bind to components

These would require significant changes to Puck's architecture or custom extensions.

For now, the manual approach ensures:
- Complete flexibility
- No custom Puck modifications needed
- Works with standard Puck installation
- Users have full control

## Tips

1. **Start small** - Select 1-2 items first to design your layout
2. **Use descriptive titles** - Name your DataRepeater to remember its purpose
3. **Leverage layout options** - Try different layout types for different contexts
4. **Check the data** - Expand the collapsed section to see available fields
5. **Compose freely** - Mix any Puck components you want in each slot

## Comparison with PetList

| Aspect | PetList | DataRepeater |
|--------|---------|--------------|
| Setup Time | ⚡ Fast | 📝 Medium |
| Flexibility | ❌ Fixed layout | ✅ Any layout |
| Extensibility | ❌ Hardcoded | ✅ Uses Puck components |
| Component Updates | ❌ Doesn't benefit | ✅ Auto-benefits |
| Use Case | Single fixed design | Multiple custom designs |
| Recommended For | Quick demos | Production flexibility |

## See Also

- [External Data Guide](./EXTERNAL_DATA.md) - Basic external data concepts
- [PetList Component](../config/blocks/PetList/index.tsx) - Fixed component example
- [Puck Slots Documentation](https://puckeditor.com/) - Official slot documentation

## Conclusion

DataRepeater demonstrates the power of composition over configuration. By using standard Puck components in slots instead of creating custom field types, you get:

- **True extensibility** - Component improvements apply everywhere
- **Maintainability** - Single source of truth for component behavior  
- **Flexibility** - Unlimited combinations of components
- **Future-proof** - Works with current and future Puck components

This approach follows Puck's design philosophy and ensures your data-driven layouts remain flexible and maintainable as your component library evolves.
