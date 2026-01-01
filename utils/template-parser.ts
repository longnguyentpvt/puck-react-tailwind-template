/**
 * Template Parser Utility
 * Parses {{fieldPath}} patterns and replaces them with actual data values
 */

/**
 * Get a nested value from an object using dot notation path
 * @param data - The data object
 * @param path - The path to the value (e.g., "user.name" or "items.0.title")
 * @returns The value at the path, or undefined if not found
 */
export function getValueByPath(data: any, path: string): any {
  if (!data || !path) return undefined;

  const keys = path.split('.');
  let current = data;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key];
  }

  return current;
}

/**
 * Parse a template string and replace {{fieldPath}} patterns with actual data
 * @param template - The template string (e.g., "Hello {{user.name}}")
 * @param data - The data object to extract values from
 * @returns The parsed string with values replaced
 */
export function parseTemplate(template: string | undefined, data: any): string {
  if (!template) return '';
  if (!data) return template;

  // Match {{...}} patterns
  const pattern = /\{\{([^}]+)\}\}/g;

  return template.replace(pattern, (match, fieldPath) => {
    const trimmedPath = fieldPath.trim();
    const value = getValueByPath(data, trimmedPath);

    // Handle different value types
    if (value === null || value === undefined) {
      return ''; // Return empty string for missing values
    }

    if (typeof value === 'object') {
      // For objects/arrays, return JSON string
      return JSON.stringify(value);
    }

    return String(value);
  });
}

/**
 * Check if a string contains template patterns
 * @param str - The string to check
 * @returns true if the string contains {{...}} patterns
 */
export function hasTemplatePatterns(str: string | undefined): boolean {
  if (!str) return false;
  return /\{\{[^}]+\}\}/.test(str);
}

/**
 * Extract all field paths from a template string
 * @param template - The template string
 * @returns Array of field paths found in the template
 */
export function extractFieldPaths(template: string | undefined): string[] {
  if (!template) return [];

  const pattern = /\{\{([^}]+)\}\}/g;
  const paths: string[] = [];
  let match;

  while ((match = pattern.exec(template)) !== null) {
    paths.push(match[1].trim());
  }

  return paths;
}
