# Quick Start: Using Pagination with Data Binding

This guide shows you how to quickly set up pagination in the Puck editor.

## 5-Minute Setup

### Step 1: Add a Flex Layout
1. In the Puck editor, scroll to the **LAYOUT** section
2. Drag **Flex** into your canvas

### Step 2: Configure Paginated Data Binding
1. Click on the Flex component you just added
2. In the right sidebar, scroll down to find **"Data Binding with Pagination"**
3. Configure:
   ```
   Data Source Collection: Products
   Variable Name: product
   Enable Pagination: Yes
   Items Per Page: 6
   ```

### Step 3: Add Cards Inside Flex
1. Drag a **Card** component into the Flex container
2. Configure the Card:
   ```
   Loop through data: Yes
   Max Items: 0
   Title: {{product.name}}
   Description: {{product.category}} - ${{product.price}}
   ```

### Step 4: Add Pagination Controls
1. Scroll to the **NAVIGATION** category in the left sidebar
2. Drag **Pagination** into the Flex container (below the cards)
3. The pagination will automatically:
   - Read the total pages from data
   - Display page numbers
   - Update the URL when clicked

### Step 5: Publish and Test
1. Click **Publish** button
2. View your published page
3. Click through pages - the URL will update (e.g., `?page=2`)
4. Data will reload showing different products per page

## Expected Result

You should see:
- 6 product cards displayed
- Pagination controls at the bottom showing: `Previous 1 2 3 Next`
- Clicking page 2 updates URL to `?page=2` and shows products 7-12
- Clicking page 3 updates URL to `?page=3` and shows products 13-15

## Customization

### Change Pagination Appearance
Click on the Pagination component and adjust:
- **Alignment**: Center, Start, or End
- **Show First/Last Buttons**: Add "First" and "Last" buttons
- **Sibling Page Count**: How many pages to show around current page
- **Custom CSS Classes**: Add Tailwind classes for styling

### Change Items Per Page
1. Click on the Flex component
2. Change **Items Per Page** to 3, 6, 9, or any number
3. Pagination will automatically recalculate total pages

## Mock Data Available

For testing, the system includes 15 mock products:
- Page 1 (6 items): Products 1-6
- Page 2 (6 items): Products 7-12  
- Page 3 (6 items): Products 13-15

## Troubleshooting

**Pagination doesn't appear?**
- Ensure Flex has "Enable Pagination" set to "Yes"
- Check that you have more items than the page size

**Data doesn't update on page change?**
- Ensure Mode is set to "Server-side (URL-based)" in Pagination settings
- Check that the URL parameter is updating in the browser

**Wrong number of items showing?**
- Verify "Items Per Page" in Flex matches your expectation
- Check Card's "Loop through data" is set to "Yes"
- Ensure "Max Items" in Card is 0 (unlimited) or greater than page size

## Next Steps

- Read [full documentation](./PAGINATION.md) for advanced features
- Learn about [data binding](./DATA_BINDING_CARD.md) system
- Customize styling with Tailwind classes
- Integrate with real Payload CMS collections

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  Flex Component (with Paginated Data Binding)  │
│  • Fetches page 1 data (items 1-6)            │
│  • Provides pagination metadata to children    │
└─────────────────────┬───────────────────────────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
┌───────▼────────┐          ┌────────▼────────┐
│  Card (x6)     │          │  Pagination     │
│  • Loops data  │          │  • Shows 1 2 3  │
│  • Shows items │          │  • Page = 1     │
└────────────────┘          └─────────────────┘

User clicks page 2
        ↓
URL updates: ?page=2
        ↓
Flex refetches data (items 7-12)
        ↓
Cards update, Pagination shows page 2 active
```

## Key Features

✅ **Server-side pagination** - Only fetches current page from server  
✅ **URL-based state** - Page number in URL for bookmarking/sharing  
✅ **Automatic metadata** - Total pages calculated from data  
✅ **Full customization** - All Shadcn + Tailwind styling options  
✅ **Smart page ranges** - Shows ellipsis for many pages  
✅ **Responsive** - Works on mobile and desktop  
✅ **Accessible** - ARIA labels and keyboard navigation  

---

For complete documentation, see [PAGINATION.md](./PAGINATION.md)
