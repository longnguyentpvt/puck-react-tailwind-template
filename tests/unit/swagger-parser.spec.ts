import { test, expect } from '@playwright/test';
import { parseSwaggerSpec, findEndpointById, generateExampleFromSchema } from '@/lib/swagger/parser';

/**
 * Unit tests for Swagger parser
 */

test.describe('Swagger Parser - Swagger 2.0', () => {
  const swagger2Spec = {
    swagger: '2.0',
    info: {
      title: 'Test API',
      version: '1.0.0',
    },
    host: 'api.example.com',
    basePath: '/v1',
    schemes: ['https'],
    paths: {
      '/users': {
        get: {
          summary: 'Get all users',
          parameters: [
            {
              name: 'limit',
              in: 'query',
              type: 'integer',
              required: false,
              default: 10,
            },
          ],
          responses: {
            '200': {
              description: 'Success',
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create user',
          parameters: [
            {
              name: 'body',
              in: 'body',
              required: true,
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                },
              },
            },
          ],
          responses: {
            '201': {
              description: 'Created',
            },
          },
        },
      },
      '/users/{id}': {
        get: {
          summary: 'Get user by ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              type: 'integer',
              required: true,
            },
          ],
          responses: {
            '200': {
              description: 'Success',
            },
          },
        },
      },
    },
  };

  test('should parse Swagger 2.0 specification', () => {
    const parsed = parseSwaggerSpec(swagger2Spec);

    expect(parsed.title).toBe('Test API');
    expect(parsed.version).toBe('1.0.0');
    expect(parsed.baseUrl).toBe('https://api.example.com/v1');
    expect(parsed.endpoints).toHaveLength(3);
  });

  test('should extract GET endpoint with query parameters', () => {
    const parsed = parseSwaggerSpec(swagger2Spec);
    const endpoint = findEndpointById(parsed, 'GET /users');

    expect(endpoint).toBeDefined();
    expect(endpoint?.method).toBe('get');
    expect(endpoint?.path).toBe('/users');
    expect(endpoint?.summary).toBe('Get all users');
    expect(endpoint?.parameters).toHaveLength(1);
    expect(endpoint?.parameters[0].name).toBe('limit');
    expect(endpoint?.parameters[0].location).toBe('query');
    expect(endpoint?.parameters[0].type).toBe('integer');
  });

  test('should extract POST endpoint with body parameter', () => {
    const parsed = parseSwaggerSpec(swagger2Spec);
    const endpoint = findEndpointById(parsed, 'POST /users');

    expect(endpoint).toBeDefined();
    expect(endpoint?.method).toBe('post');
    expect(endpoint?.requestBody).toBeDefined();
    expect(endpoint?.requestBody?.required).toBe(true);
    expect(endpoint?.requestBody?.schema).toBeDefined();
  });

  test('should extract path parameters', () => {
    const parsed = parseSwaggerSpec(swagger2Spec);
    const endpoint = findEndpointById(parsed, 'GET /users/{id}');

    expect(endpoint).toBeDefined();
    expect(endpoint?.parameters).toHaveLength(1);
    expect(endpoint?.parameters[0].name).toBe('id');
    expect(endpoint?.parameters[0].location).toBe('path');
    expect(endpoint?.parameters[0].required).toBe(true);
  });
});

test.describe('Swagger Parser - OpenAPI 3.x', () => {
  const openapi3Spec = {
    openapi: '3.0.0',
    info: {
      title: 'Test API',
      version: '2.0.0',
    },
    servers: [
      {
        url: 'https://api.example.com/v2',
      },
    ],
    paths: {
      '/products': {
        get: {
          summary: 'Get all products',
          parameters: [
            {
              name: 'category',
              in: 'query',
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        price: { type: 'number' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create product',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    price: { type: 'number' },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Created',
            },
          },
        },
      },
    },
  };

  test('should parse OpenAPI 3.x specification', () => {
    const parsed = parseSwaggerSpec(openapi3Spec);

    expect(parsed.title).toBe('Test API');
    expect(parsed.version).toBe('2.0.0');
    expect(parsed.baseUrl).toBe('https://api.example.com/v2');
    expect(parsed.endpoints).toHaveLength(2);
  });

  test('should extract GET endpoint with OpenAPI 3.x format', () => {
    const parsed = parseSwaggerSpec(openapi3Spec);
    const endpoint = findEndpointById(parsed, 'GET /products');

    expect(endpoint).toBeDefined();
    expect(endpoint?.method).toBe('get');
    expect(endpoint?.path).toBe('/products');
    expect(endpoint?.parameters).toHaveLength(1);
    expect(endpoint?.parameters[0].name).toBe('category');
    expect(endpoint?.parameters[0].location).toBe('query');
  });

  test('should extract POST endpoint with requestBody', () => {
    const parsed = parseSwaggerSpec(openapi3Spec);
    const endpoint = findEndpointById(parsed, 'POST /products');

    expect(endpoint).toBeDefined();
    expect(endpoint?.method).toBe('post');
    expect(endpoint?.requestBody).toBeDefined();
    expect(endpoint?.requestBody?.required).toBe(true);
    expect(endpoint?.requestBody?.contentType).toBe('application/json');
  });
});

test.describe('Swagger Parser - Schema Examples', () => {
  test('should generate example from object schema', () => {
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'Test' },
        active: { type: 'boolean', example: true },
      },
    };

    const example = generateExampleFromSchema(schema);

    expect(example).toEqual({
      id: 1,
      name: 'Test',
      active: true,
    });
  });

  test('should generate example from array schema', () => {
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
        },
      },
    };

    const example = generateExampleFromSchema(schema);

    expect(Array.isArray(example)).toBe(true);
    expect(example).toHaveLength(1);
    expect(example[0]).toHaveProperty('id');
    expect(example[0]).toHaveProperty('name');
  });

  test('should handle primitive types', () => {
    expect(generateExampleFromSchema({ type: 'string' })).toBe('example');
    expect(generateExampleFromSchema({ type: 'number' })).toBe(0);
    expect(generateExampleFromSchema({ type: 'integer' })).toBe(0);
    expect(generateExampleFromSchema({ type: 'boolean' })).toBe(false);
  });
});

test.describe('Swagger Parser - Error Handling', () => {
  test('should throw error for unsupported format', () => {
    const invalidSpec = {
      info: {
        title: 'Invalid',
      },
    };

    expect(() => parseSwaggerSpec(invalidSpec)).toThrow();
  });

  test('should return undefined for non-existent endpoint', () => {
    const spec = {
      swagger: '2.0',
      info: { title: 'Test', version: '1.0' },
      paths: {},
    };

    const parsed = parseSwaggerSpec(spec);
    const endpoint = findEndpointById(parsed, 'GET /nonexistent');

    expect(endpoint).toBeUndefined();
  });
});
