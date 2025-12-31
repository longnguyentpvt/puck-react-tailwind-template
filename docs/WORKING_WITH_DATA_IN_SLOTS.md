# Working with Data in DataRepeater Slots

## The Challenge

When you drag components (like Heading or Text) into DataRepeater slots, those components don't automatically have access to the pet data. This is a limitation of how Puck's slot system works - slots are independent component areas that don't inherit data context from their parents.

## Current Solution: Manual Configuration

### Step-by-Step Guide

1. **View the Pet Data**
   - Each pet slot shows its data in a collapsible section at the bottom
   - Click the collapsed section to see the JSON data
   - Example: `{"id": "1", "name": "Buddy", "species": "Dog", "description": "Friendly golden retriever"}`

2. **Configure Components Manually**
   - Drag a Heading component into the slot
   - Click on the Heading to select it
   - In the right panel, find the "Text" field
   - Type the pet's name (e.g., "Buddy")
   - Configure size, rank, and other styling options

3. **Add More Components**
   - Drag a Text component for the description
   - Type or copy-paste the description from the JSON
   - Add other components as needed

4. **Repeat for Each Pet**
   - Each pet slot requires manual configuration
   - You can copy-paste values from the collapsed JSON section

### Example Configuration

For a pet with this data:
```json
{
  "name": "Buddy",
  "species": "Dog",
  "description": "Friendly golden retriever",
  "age": 3
}
```

You would:
1. Drag **Heading** → Set text to "Buddy", size to "xl"
2. Drag **Text** → Set text to "Dog", size to "s" (for species badge effect)
3. Drag **Text** → Set text to "Friendly golden retriever"
4. Optionally drag **Text** → Set text to "Age: 3"

## Alternative: Use PetList Component

If manual configuration is too tedious, consider using the **PetList** component instead:

### PetList Advantages
- ✅ **Automatic data binding** - Pet name and description render automatically
- ✅ **Zero configuration** - Just select pets, they display immediately
- ✅ **Consistent styling** - Professional card layout out of the box
- ✅ **Faster setup** - No need to configure each pet individually

### PetList Limitations
- ❌ **Fixed layout** - Grid of cards, can't customize per-pet layout
- ❌ **Limited fields** - Only shows name, species badge, and description
- ❌ **No component flexibility** - Can't add buttons, images, or other elements per pet

## Comparison

| Feature | DataRepeater | PetList |
|---------|--------------|---------|
| Data Binding | ❌ Manual | ✅ Automatic |
| Setup Time | 📝 Slower | ⚡ Fast |
| Layout Flexibility | ✅ Full control | ❌ Fixed grid |
| Per-Pet Customization | ✅ Unique layouts | ❌ All same |
| Component Variety | ✅ Any components | ❌ Fixed components |
| Best For | Custom presentations | Quick, consistent listings |

## Future Improvements

Potential solutions being considered:

1. **Data Context Provider**
   - Add React Context to pass pet data to slot children
   - Components could access parent data automatically
   - Requires significant changes to architecture

2. **Template Variables**
   - Allow `{{pet.name}}` syntax in text fields
   - Components would resolve variables at render time
   - Would require custom text field implementation

3. **Data-Aware Components**
   - Create special components that can read from data context
   - Example: `DataHeading`, `DataText` components
   - Would work only inside DataRepeater slots

## Recommendations

**Choose DataRepeater when:**
- You need unique layouts for each data item
- You want to add buttons, images, or complex components
- You're okay with manual configuration
- You have a small number of items (< 10)

**Choose PetList when:**
- You have many items to display
- You want consistent, professional styling
- You need quick setup without configuration
- Standard fields (name, description) are sufficient

## Tips

1. **Copy-Paste Values**: Copy from the JSON in the collapsed section and paste into component fields
2. **Use Consistent Styling**: Set up one pet slot completely, then replicate the pattern for others
3. **Save as Template**: If you create a good layout, you could save it and reuse across pets
4. **Consider PetList First**: Start with PetList, only switch to DataRepeater if you need custom layouts

## Need Help?

If you're finding manual configuration too cumbersome, please provide feedback on what automatic data binding features would be most helpful. Future versions may include:
- Template variable syntax
- Data-aware components
- Visual data field selector
- Bulk configuration tools
