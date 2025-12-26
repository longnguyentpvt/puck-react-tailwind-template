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

- **Heading component** → Configure with pet name
- **Text component** → Add pet description
- **Button component** → Add "Adopt" action
- **Space component** → Add spacing
- **Any other Puck component** → Fully extensible!

### Step 3: Configure Components

Each slot shows the pet's data in a collapsible section. Use this data to manually configure the components you dragged in:

```
Pet data available:
{
  "id": 1,
  "name": "Buddy",
  "species": "Dog",
  "description": "A friendly golden retriever..."
}
```

Copy values from the data and paste into your component configurations.

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

### Manual Data Entry
Currently, pet data is shown for reference but must be manually entered into components. The data is visible in the collapsed section of each slot.

**Workaround**: 
- View pet data in the slot's collapsed section
- Copy values (name, description, etc.)
- Paste into your component configurations

### Future Enhancements

To make this fully automatic, you would need to:
1. Extend Puck's zone context to pass data to child components
2. Create a resolver that injects data into component props
3. Use React Context API to share data with nested components
4. Add data binding expressions like `{{pet.name}}`

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
