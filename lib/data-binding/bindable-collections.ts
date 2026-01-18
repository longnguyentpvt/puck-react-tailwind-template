/**
 * Configuration for collections that can be used in data binding.
 * 
 * Add collection slugs here to make them available in the Data Binding
 * dropdown selector in layout components (Flex, Grid).
 * 
 * These collections will be fetched from Payload CMS and can be used
 * to dynamically populate component data using {{binding}} syntax.
 */
export const BINDABLE_COLLECTIONS = [
  { slug: 'products', label: 'Products' },
  // Add more collections as needed
  // { slug: 'categories', label: 'Categories' },
  // { slug: 'posts', label: 'Blog Posts' },
] as const;

/**
 * Type helper to get collection slugs
 */
export type BindableCollectionSlug = typeof BINDABLE_COLLECTIONS[number]['slug'];
