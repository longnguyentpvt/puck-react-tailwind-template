/**
 * Template processor for handling dynamic data binding in text fields
 * 
 * Supports syntax like: "Pet name is {{name}}" or "{{species}} - {{name}}"
 * Can reference nested fields with dot notation: "{{owner.name}}"
 */

/**
 * Process a template string and replace placeholders with data values
 * 
 * @param template - Template string with {{fieldPath}} placeholders
 * @param data - Data object to extract values from
 * @returns Processed string with placeholders replaced
 * 
 * @example
 * processTemplate("Pet name is {{name}}", { name: "Buddy" })
 * // Returns: "Pet name is Buddy"
 * 
 * @example
 * processTemplate("{{species}}: {{name}}", { species: "Dog", name: "Buddy" })
 * // Returns: "Dog: Buddy"
 * 
 * @example
 * processTemplate("Owner: {{owner.name}}", { owner: { name: "John" } })
 * // Returns: "Owner: John"
 */
export function processTemplate(template: string | undefined, data: unknown): string {
  // Handle non-string templates by converting to string or returning empty
  if (template === null || template === undefined) {
    return '';
  }
  
  // Ensure template is a string
  const templateStr = typeof template === 'string' ? template : String(template);
  
  // If no data available, return template as-is
  if (!data) {
    return templateStr;
  }
  
  // Replace all {{fieldPath}} occurrences with actual values
  return templateStr.replace(/\{\{([^}]+)\}\}/g, (match, fieldPath) => {
    const trimmedPath = fieldPath.trim();
    const value = getNestedValue(data, trimmedPath);
    
    // Return the value if found, otherwise keep the placeholder
    return value !== undefined && value !== null ? String(value) : match;
  });
}

/**
 * Get a value from an object using dot notation path
 * 
 * @param obj - Object to extract value from
 * @param path - Dot notation path (e.g., "name", "owner.name", "address.city.zipCode")
 * @returns Value at the path or undefined if not found
 */
function getNestedValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') {
    return undefined;
  }
  
  const fields = path.split('.');
  let value = obj;
  
  for (const field of fields) {
    if (value && typeof value === 'object' && field in value) {
      value = value[field];
    } else {
      return undefined;
    }
  }
  
  return value;
}

/**
 * Check if a string contains template placeholders
 * 
 * @param text - Text to check
 * @returns true if text contains {{...}} placeholders
 */
export function hasTemplatePlaceholders(text: string | undefined): boolean {
  if (!text) {
    return false;
  }
  
  return /\{\{[^}]+\}\}/.test(text);
}

/**
 * Extract all field paths from a template string
 * 
 * @param template - Template string with {{fieldPath}} placeholders
 * @returns Array of field paths found in the template
 * 
 * @example
 * extractFieldPaths("Pet name is {{name}} and species is {{species}}")
 * // Returns: ["name", "species"]
 */
export function extractFieldPaths(template: string | undefined): string[] {
  if (!template) {
    return [];
  }
  
  const matches = template.matchAll(/\{\{([^}]+)\}\}/g);
  const paths: string[] = [];
  
  for (const match of matches) {
    if (match[1]) {
      paths.push(match[1].trim());
    }
  }
  
  return paths;
}
