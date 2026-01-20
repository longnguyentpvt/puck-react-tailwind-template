/**
 * Swagger/OpenAPI parser for extracting API endpoint information
 */

import {
  ParsedSwagger,
  ApiEndpoint,
  ApiParameter,
  HttpMethod,
  ParameterLocation,
} from './types';

/**
 * Parse a Swagger 2.0 or OpenAPI 3.x specification
 * @param spec - The Swagger/OpenAPI JSON specification
 * @returns Parsed specification with endpoints
 */
export function parseSwaggerSpec(spec: any): ParsedSwagger {
  // Detect version
  const isOpenApi3 = spec.openapi && spec.openapi.startsWith('3.');
  const isSwagger2 = spec.swagger && spec.swagger.startsWith('2.');

  if (!isOpenApi3 && !isSwagger2) {
    throw new Error('Unsupported specification format. Only Swagger 2.0 and OpenAPI 3.x are supported.');
  }

  const title = spec.info?.title || 'API';
  const version = spec.info?.version || '1.0';
  const baseUrl = getBaseUrl(spec, isOpenApi3);
  const endpoints = parseEndpoints(spec, isOpenApi3);

  return {
    title,
    version,
    baseUrl,
    endpoints,
  };
}

/**
 * Extract base URL from specification
 */
function getBaseUrl(spec: any, isOpenApi3: boolean): string | undefined {
  if (isOpenApi3) {
    // OpenAPI 3.x uses servers array
    const server = spec.servers?.[0];
    if (server?.url) {
      return server.url;
    }
  } else {
    // Swagger 2.0 uses host, basePath, and schemes
    const scheme = spec.schemes?.[0] || 'https';
    const host = spec.host;
    const basePath = spec.basePath || '';
    
    if (host) {
      return `${scheme}://${host}${basePath}`;
    }
  }
  
  return undefined;
}

/**
 * Parse all endpoints from specification
 */
function parseEndpoints(spec: any, isOpenApi3: boolean): ApiEndpoint[] {
  const endpoints: ApiEndpoint[] = [];
  const paths = spec.paths || {};

  for (const [path, pathItem] of Object.entries(paths)) {
    const methods: HttpMethod[] = ['get', 'post', 'put', 'patch', 'delete'];
    
    for (const method of methods) {
      const operation = (pathItem as any)[method];
      
      if (operation) {
        const endpoint = parseOperation(
          path,
          method,
          operation,
          isOpenApi3,
          spec
        );
        endpoints.push(endpoint);
      }
    }
  }

  return endpoints;
}

/**
 * Parse a single operation (endpoint)
 */
function parseOperation(
  path: string,
  method: HttpMethod,
  operation: any,
  isOpenApi3: boolean,
  spec: any
): ApiEndpoint {
  const id = `${method.toUpperCase()} ${path}`;
  const summary = operation.summary;
  const description = operation.description;
  
  // Parse parameters
  const parameters = parseParameters(operation.parameters || [], isOpenApi3, spec);
  
  // Parse request body (OpenAPI 3.x)
  let requestBody = isOpenApi3 ? parseRequestBody(operation.requestBody, spec) : undefined;
  
  // If Swagger 2.0, check for body parameter
  if (!isOpenApi3) {
    const bodyParam = operation.parameters?.find((p: any) => p.in === 'body');
    if (bodyParam) {
      const schema = resolveSchema(bodyParam.schema, spec);
      requestBody = {
        required: bodyParam.required || false,
        contentType: 'application/json',
        schema,
      };
    }
  }
  
  // Parse responses
  const responses = parseResponses(operation.responses || {}, isOpenApi3, spec);

  return {
    id,
    path,
    method,
    summary,
    description,
    parameters,
    requestBody,
    responses,
  };
}

/**
 * Parse parameters
 */
function parseParameters(
  params: any[],
  isOpenApi3: boolean,
  spec: any
): ApiParameter[] {
  return params
    .filter((p) => p.in !== 'body') // Body handled separately
    .map((param): ApiParameter => {
      const location = param.in as ParameterLocation;
      const schema = isOpenApi3 ? param.schema : param;
      const type = getParameterType(schema, spec);
      
      return {
        name: param.name,
        location,
        required: param.required || false,
        type,
        description: param.description,
        default: param.default || schema?.default,
        enum: schema?.enum,
        schema: schema,
      };
    });
}

/**
 * Parse request body (OpenAPI 3.x)
 */
function parseRequestBody(requestBody: any, spec: any): any {
  if (!requestBody) return undefined;

  const content = requestBody.content || {};
  const contentType = Object.keys(content)[0] || 'application/json';
  const mediaType = content[contentType];
  const schema = resolveSchema(mediaType?.schema, spec);

  return {
    required: requestBody.required || false,
    contentType,
    schema,
  };
}

/**
 * Parse responses
 */
function parseResponses(responses: any, isOpenApi3: boolean, spec: any): any {
  const parsed: any = {};

  for (const [statusCode, response] of Object.entries(responses)) {
    const resp = response as any;
    let schema;
    let example;

    if (isOpenApi3) {
      const content = resp.content || {};
      const contentType = Object.keys(content)[0];
      if (contentType) {
        const mediaType = content[contentType];
        schema = resolveSchema(mediaType.schema, spec);
        example = mediaType.example || mediaType.examples;
      }
    } else {
      // Swagger 2.0
      schema = resolveSchema(resp.schema, spec);
      example = resp.examples?.['application/json'];
    }

    parsed[statusCode] = {
      description: resp.description || '',
      schema,
      example,
    };
  }

  return parsed;
}

/**
 * Get parameter type as string
 */
function getParameterType(schema: any, spec: any): string {
  if (!schema) return 'string';
  
  const resolved = resolveSchema(schema, spec);
  
  if (resolved.type) {
    if (resolved.type === 'array') {
      const itemType = resolved.items?.type || 'any';
      return `array<${itemType}>`;
    }
    return resolved.type;
  }
  
  return 'string';
}

/**
 * Resolve schema reference ($ref)
 */
function resolveSchema(schema: any, spec: any): any {
  if (!schema) return schema;
  
  if (schema.$ref) {
    const ref = schema.$ref;
    const parts = ref.split('/');
    let resolved = spec;
    
    for (let i = 1; i < parts.length; i++) {
      resolved = resolved[parts[i]];
      if (!resolved) break;
    }
    
    return resolved || schema;
  }
  
  return schema;
}

/**
 * Generate example data from schema
 */
export function generateExampleFromSchema(schema: any): any {
  if (!schema) return null;

  if (schema.example !== undefined) {
    return schema.example;
  }

  if (schema.type === 'object') {
    const example: any = {};
    const properties = schema.properties || {};
    
    for (const [key, prop] of Object.entries(properties)) {
      example[key] = generateExampleFromSchema(prop);
    }
    
    return example;
  }

  if (schema.type === 'array') {
    const item = generateExampleFromSchema(schema.items);
    return [item];
  }

  // Primitive types
  const typeDefaults: Record<string, any> = {
    string: 'example',
    number: 0,
    integer: 0,
    boolean: false,
  };

  return typeDefaults[schema.type] || null;
}

/**
 * Find endpoint by ID
 */
export function findEndpointById(
  parsedSwagger: ParsedSwagger,
  endpointId: string
): ApiEndpoint | undefined {
  return parsedSwagger.endpoints.find((e) => e.id === endpointId);
}
