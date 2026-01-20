/**
 * Types for Swagger/OpenAPI specification support
 */

/**
 * Supported HTTP methods
 */
export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

/**
 * Parameter location
 */
export type ParameterLocation = 'query' | 'header' | 'path' | 'body';

/**
 * API parameter definition
 */
export interface ApiParameter {
  name: string;
  location: ParameterLocation;
  required: boolean;
  type: string;
  description?: string;
  default?: any;
  enum?: any[];
  schema?: any;
}

/**
 * API endpoint definition
 */
export interface ApiEndpoint {
  id: string;
  path: string;
  method: HttpMethod;
  summary?: string;
  description?: string;
  parameters: ApiParameter[];
  requestBody?: {
    required: boolean;
    contentType: string;
    schema: any;
  };
  responses: {
    [statusCode: string]: {
      description: string;
      schema?: any;
      example?: any;
    };
  };
}

/**
 * Parsed Swagger specification
 */
export interface ParsedSwagger {
  title: string;
  version: string;
  baseUrl?: string;
  endpoints: ApiEndpoint[];
}

/**
 * Configuration for an API source
 */
export interface ApiSourceConfig {
  type: 'swagger';
  swaggerUrl?: string;
  swaggerSpec?: any;
  endpointId: string;
  parameters?: Record<string, any>;
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Source configuration that can be either collection or API
 */
export type DataSourceConfig = 
  | { type: 'collection'; slug: string }
  | ApiSourceConfig;
