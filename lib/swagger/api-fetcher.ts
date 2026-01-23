/**
 * Service for fetching data from Swagger-defined APIs
 */

import { ParsedSwagger, ApiEndpoint, ApiSourceConfig } from './types';
import { parseSwaggerSpec, findEndpointById, generateExampleFromSchema } from './parser';

/**
 * Cache for parsed Swagger specifications
 */
const swaggerCache = new Map<string, ParsedSwagger>();

/**
 * Fetch and parse a Swagger specification from URL
 */
export async function fetchSwaggerSpec(url: string): Promise<ParsedSwagger> {
  // Check cache first
  if (swaggerCache.has(url)) {
    return swaggerCache.get(url)!;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Swagger spec: ${response.statusText}`);
    }

    const spec = await response.json();
    const parsed = parseSwaggerSpec(spec, url);
    
    // Cache the parsed spec
    swaggerCache.set(url, parsed);
    
    return parsed;
  } catch (error) {
    console.error('Error fetching Swagger specification:', error);
    throw error;
  }
}

/**
 * Parse a Swagger specification from inline JSON
 */
export function parseInlineSwaggerSpec(spec: any): ParsedSwagger {
  return parseSwaggerSpec(spec);
}

/**
 * Build request URL with path and query parameters
 */
function buildRequestUrl(
  baseUrl: string,
  endpoint: ApiEndpoint,
  parameters: Record<string, any>
): string {
  let url = baseUrl;
  let path = endpoint.path;

  // Replace path parameters
  const pathParams = endpoint.parameters.filter((p) => p.location === 'path');
  for (const param of pathParams) {
    const value = parameters[param.name];
    if (value !== undefined) {
      path = path.replace(`{${param.name}}`, encodeURIComponent(String(value)));
    }
  }

  url += path;

  // Add query parameters
  const queryParams = endpoint.parameters.filter((p) => p.location === 'query');
  const queryString = queryParams
    .map((param) => {
      const value = parameters[param.name];
      if (value !== undefined) {
        return `${encodeURIComponent(param.name)}=${encodeURIComponent(String(value))}`;
      }
      return null;
    })
    .filter(Boolean)
    .join('&');

  if (queryString) {
    url += `?${queryString}`;
  }

  return url;
}

/**
 * Build request headers
 */
function buildRequestHeaders(
  endpoint: ApiEndpoint,
  parameters: Record<string, any>,
  customHeaders?: Record<string, string>
): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  // Add header parameters
  const headerParams = endpoint.parameters.filter((p) => p.location === 'header');
  for (const param of headerParams) {
    const value = parameters[param.name];
    if (value !== undefined) {
      headers[param.name] = String(value);
    }
  }

  return headers;
}

/**
 * Fetch data from a Swagger-defined API endpoint
 */
export async function fetchSwaggerApiData(config: ApiSourceConfig): Promise<any> {
  try {
    // Get the Swagger specification
    let parsedSwagger: ParsedSwagger;
    
    if (config.swaggerUrl) {
      parsedSwagger = await fetchSwaggerSpec(config.swaggerUrl);
    } else if (config.swaggerSpec) {
      parsedSwagger = parseInlineSwaggerSpec(config.swaggerSpec);
    } else {
      throw new Error('Either swaggerUrl or swaggerSpec must be provided');
    }

    // Find the endpoint
    const endpoint = findEndpointById(parsedSwagger, config.endpointId);
    if (!endpoint) {
      throw new Error(`Endpoint not found: ${config.endpointId}`);
    }

    // Build request URL
    const baseUrl = parsedSwagger.baseUrl || '';
    const url = buildRequestUrl(baseUrl, endpoint, config.parameters || {});

    // Build headers
    const headers = buildRequestHeaders(endpoint, config.parameters || {}, config.headers);

    // Prepare request options
    const requestOptions: RequestInit = {
      method: endpoint.method.toUpperCase(),
      headers,
      cache: 'no-store', // Don't cache API data binding queries
    };

    // Add body for POST/PUT/PATCH requests
    if (
      (endpoint.method === 'post' || endpoint.method === 'put' || endpoint.method === 'patch') &&
      config.body
    ) {
      requestOptions.body = JSON.stringify(config.body);
    }

    // Make the request
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from Swagger API:', error);
    throw error;
  }
}

/**
 * Generate mock data from endpoint response schema for preview
 */
export function generateMockDataFromEndpoint(endpoint: ApiEndpoint): any {
  const successResponse = endpoint.responses['200'] || endpoint.responses['201'];
  
  if (!successResponse) {
    return null;
  }

  if (successResponse.example) {
    return successResponse.example;
  }

  if (successResponse.schema) {
    return generateExampleFromSchema(successResponse.schema);
  }

  return null;
}

/**
 * Clear the Swagger specification cache
 */
export function clearSwaggerCache(): void {
  swaggerCache.clear();
}
