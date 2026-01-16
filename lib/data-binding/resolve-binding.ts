/**
 * Binding Resolver Utility
 * 
 * Resolves `{{variableName.fieldPath}}` syntax against a scope object.
 * Supports nested paths and returns empty string for missing values.
 */

export type DataScope = Record<string, unknown>;

/**
 * Pattern to match binding expressions like {{variableName.path.to.field}}
 */
const BINDING_PATTERN = /\{\{([^}]+)\}\}/g;

/**
 * Get a value from an object using a dot-notation path.
 * Returns undefined if the path doesn't exist.
 * 
 * @param obj - The object to traverse
 * @param path - Dot-notation path (e.g., "user.profile.name")
 * @returns The value at the path, or undefined if not found
 */
export function getValueByPath(obj: unknown, path: string): unknown {
  if (obj === null || obj === undefined) {
    return undefined;
  }
  
  const parts = path.split('.');
  let current: unknown = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    
    // Handle array index access (e.g., "items.0.name")
    if (Array.isArray(current) && /^\d+$/.test(part)) {
      current = current[parseInt(part, 10)];
    } else if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  
  return current;
}

/**
 * Resolve a single binding expression against the scope.
 * 
 * @param expression - The binding expression without {{ }} (e.g., "product.name")
 * @param scope - The data scope containing variables
 * @returns The resolved value, or empty string if not found
 */
export function resolveSingleBinding(expression: string, scope: DataScope): string {
  const trimmedExpr = expression.trim();
  
  // Handle special "index" variable
  if (trimmedExpr === 'index') {
    const indexValue = scope['index'];
    return indexValue !== undefined ? String(indexValue) : '';
  }
  
  // Parse variable name and path
  const dotIndex = trimmedExpr.indexOf('.');
  let variableName: string;
  let fieldPath: string | undefined;
  
  if (dotIndex === -1) {
    variableName = trimmedExpr;
    fieldPath = undefined;
  } else {
    variableName = trimmedExpr.substring(0, dotIndex);
    fieldPath = trimmedExpr.substring(dotIndex + 1);
  }
  
  // Get the variable from scope
  const variable = scope[variableName];
  
  if (variable === undefined) {
    return '';
  }
  
  // If no field path, return the variable value
  if (!fieldPath) {
    if (typeof variable === 'object') {
      return JSON.stringify(variable);
    }
    return String(variable ?? '');
  }
  
  // Resolve the field path
  const value = getValueByPath(variable, fieldPath);
  
  if (value === undefined || value === null) {
    return '';
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
}

/**
 * Resolve all binding expressions in a string.
 * 
 * @param template - String containing {{binding}} expressions
 * @param scope - The data scope containing variables
 * @returns The string with all bindings resolved
 */
export function resolveBindings(template: string, scope: DataScope): string {
  if (!template || typeof template !== 'string') {
    return template ?? '';
  }
  
  // Check if the string contains any bindings
  if (!template.includes('{{')) {
    return template;
  }
  
  return template.replace(BINDING_PATTERN, (match, expression) => {
    return resolveSingleBinding(expression, scope);
  });
}

/**
 * Check if a string contains binding expressions.
 * 
 * @param value - The string to check
 * @returns True if the string contains {{binding}} patterns
 */
export function hasBindings(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }
  return BINDING_PATTERN.test(value);
}

/**
 * Extract all binding variable names from a string.
 * 
 * @param template - String containing {{binding}} expressions
 * @returns Array of variable names used in the bindings
 */
export function extractBindingVariables(template: string): string[] {
  if (!template || typeof template !== 'string') {
    return [];
  }
  
  const variables: Set<string> = new Set();
  let match: RegExpExecArray | null;
  
  // Create a new regex with global flag to avoid infinite loop
  const regex = new RegExp(BINDING_PATTERN.source, 'g');
  
  while ((match = regex.exec(template)) !== null) {
    const expression = match[1].trim();
    const dotIndex = expression.indexOf('.');
    const variableName = dotIndex === -1 ? expression : expression.substring(0, dotIndex);
    variables.add(variableName);
  }
  
  return Array.from(variables);
}
