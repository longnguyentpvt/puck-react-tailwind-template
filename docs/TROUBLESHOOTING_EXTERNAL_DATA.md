# Troubleshooting External Data in Puck

## Issue: External field shows "0 results" or pets cannot be selected

### Symptoms
- When clicking the "External item" button, the modal opens but shows "0 results"
- No pets appear in the selection list
- Console shows `fetchList called` but no subsequent logs

### Root Cause
The `fetchList` function in the external field is failing to fetch data from the API because:

1. **SSR/CSR URL Resolution**: The code needs to construct an absolute URL to fetch from `/api/pets`, but determining the correct base URL differs between server-side rendering (SSR) and client-side rendering (CSR)

2. **Environment Variable Not Set**: `process.env.NEXT_PUBLIC_SITE_URL` may not be configured in your environment

3. **Async Timing**: The fetch might be timing out or failing silently

### Solution

#### Option 1: Set Environment Variable (Recommended)
Create or update `.env.local` in your project root:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Then restart your dev server:
```bash
yarn dev
```

#### Option 2: Use Relative URLs (If API is same origin)
Since the API endpoint is on the same origin, you can simplify the fetch to use a relative URL:

```typescript
// Instead of:
const baseUrl = typeof window !== 'undefined' 
  ? window.location.origin 
  : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const response = await fetch(`${baseUrl}/api/pets`);

// Use:
const response = await fetch('/api/pets', {
  // Important: Add headers for server-side fetches
  headers: typeof window === 'undefined' ? {
    'Content-Type': 'application/json',
  } : undefined,
});
```

However, relative URLs don't work in all Next.js contexts, so environment variables are preferred.

#### Option 3: Enhanced Error Handling
Add better error handling to see what's actually failing:

```typescript
fetchList: async ({ query, filters }) => {
  try {
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    console.log('[DEBUG] Fetching from:', `${baseUrl}/api/pets`);
    
    const response = await fetch(`${baseUrl}/api/pets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('[DEBUG] Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[DEBUG] Response error:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const pets = await response.json();
    console.log('[DEBUG] Fetched pets count:', pets.length);
    
    // ... rest of the code
  } catch (error) {
    console.error('[DEBUG] Full error:', error);
    // Return empty array to prevent UI from breaking
    return [];
  }
},
```

### Testing the Fix

1. **Test API endpoint directly**:
   ```bash
   curl http://localhost:3000/api/pets
   ```
   You should see JSON with 5 pets.

2. **Check browser console** when clicking "External item":
   - Look for `[DEBUG]` or `[PetList]` logs
   - Check for any error messages

3. **Test in editor**:
   - Go to `/pets/edit`
   - Click on PetList in the outline
   - Click "External item" button
   - Modal should show 5 pets: Buddy, Whiskers, Max, Luna, Charlie

### Expected Behavior
When working correctly:
- Modal opens with "Select data" header
- Shows "5 results"
- Lists all pets with format: "Name (Species)"
- Click on pets to select them (supports multi-select)
- Selected pets appear as chips below the button

### Additional Notes

- **CORS**: If your API is on a different domain, you'll need to handle CORS headers
- **Authentication**: If your API requires auth, add appropriate headers to the fetch
- **Caching**: Consider adding caching to `fetchList` if the data doesn't change frequently
- **Loading States**: Puck handles loading states automatically, but large datasets may need pagination

### Related Files
- `/config/blocks/PetList/index.tsx` - Fixed PetList component
- `/config/blocks/DataRepeater/index.tsx` - Flexible DataRepeater component  
- `/app/api/pets/route.ts` - API endpoint
- `/lib/external-data.ts` - Mock data source
