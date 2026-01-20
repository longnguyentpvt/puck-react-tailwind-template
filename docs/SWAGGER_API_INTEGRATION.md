# Swagger API Integration for Puck Data Binding

This feature extends Puck's data binding system to support dynamic API integration using Swagger/OpenAPI specifications.

## Features

✅ **Parse Swagger/OpenAPI Specifications**
- Supports Swagger 2.0 and OpenAPI 3.x formats
- Extracts endpoints, parameters, request bodies, and response schemas
- Handles schema references ($ref)

✅ **Configure API Data Sources**
- Select from predefined Swagger API sources
- Choose specific endpoints from parsed specifications
- Configure query parameters, path parameters, and request headers
- Support for GET, POST, PUT, PATCH, and DELETE methods

✅ **Dynamic Data Fetching**
- Fetch data from API endpoints at runtime
- Pass parameters dynamically via JSON configuration
- Automatic fallback to mock data on errors
- Response data available for binding in child components

✅ **UI Integration**
- Radio button to choose between Collection and API sources
- Dropdown to select API source
- Text field for endpoint ID
- Textarea for JSON parameter configuration
- Payload hints show API endpoint information

## Quick Start

### 1. Add a Swagger API Source

Edit `/lib/data-binding/bindable-collections.ts`:

```typescript
export const SWAGGER_API_SOURCES = [
  {
    id: 'my-api',
    label: 'My Custom API',
    swaggerUrl: 'https://api.example.com/swagger.json',
  },
] as const;
```

### 2. Use API in Puck Editor

1. Add a **Flex** or **Grid** layout component
2. In Data Binding section, select **"Swagger API"** as source type
3. Select your API from the **API Source** dropdown
4. Enter the endpoint ID (e.g., "GET /products")
5. (Optional) Add parameters as JSON:
   ```json
   {
     "limit": 10,
     "category": "electronics"
   }
   ```
6. Set a variable name (e.g., "product")

### 3. Bind Data in Child Components

Add a **Card** component inside the layout and use binding syntax:

- Title: `{{product.name}}`
- Description: `Price: ${{product.price}}`

Enable "Loop through data" to iterate through array responses.

## Swagger Specification Requirements

### Supported Formats

- **Swagger 2.0**: Full support
- **OpenAPI 3.0**: Full support
- **OpenAPI 3.1**: Should work (not extensively tested)

### Example Specification Structure

```json
{
  "swagger": "2.0",
  "info": {
    "title": "My API",
    "version": "1.0.0"
  },
  "host": "api.example.com",
  "basePath": "/v1",
  "paths": {
    "/products": {
      "get": {
        "summary": "Get products",
        "parameters": [...],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {...}
          }
        }
      }
    }
  }
}
```

## Parameter Configuration

Parameters are configured as a JSON object in the "API Parameters" field:

### Query Parameters

For endpoint `GET /products?limit=10&category=electronics`:

```json
{
  "limit": 10,
  "category": "electronics"
}
```

### Path Parameters

For endpoint `GET /products/{id}`:

```json
{
  "id": "123"
}
```

### Header Parameters

```json
{
  "Authorization": "Bearer token123",
  "X-Custom-Header": "value"
}
```

### Combined Parameters

```json
{
  "id": "123",
  "limit": 10,
  "Authorization": "Bearer token123"
}
```

The parser automatically places parameters in the correct location (query, path, header) based on the Swagger specification.

## API Module Structure

```
lib/swagger/
├── types.ts          - TypeScript type definitions
├── parser.ts         - Swagger/OpenAPI parser
├── api-fetcher.ts    - API data fetching logic
└── index.ts          - Module exports
```

### Key Functions

#### Parser

```typescript
import { parseSwaggerSpec, findEndpointById } from '@/lib/swagger';

const parsed = parseSwaggerSpec(swaggerJson);
const endpoint = findEndpointById(parsed, 'GET /products');
```

#### Data Fetching

```typescript
import { fetchSwaggerApiData } from '@/lib/swagger';

const data = await fetchSwaggerApiData({
  type: 'swagger',
  swaggerUrl: '/examples/sample-swagger.json',
  endpointId: 'GET /products',
  parameters: { limit: 10 },
});
```

## Testing

### Unit Tests

Run Swagger parser tests:

```bash
yarn test:e2e tests/unit/swagger-parser.spec.ts
```

Tests cover:
- Swagger 2.0 parsing
- OpenAPI 3.x parsing
- Parameter extraction
- Schema example generation
- Error handling

### E2E Tests

Run API integration tests:

```bash
yarn test:e2e tests/e2e/api-integration.spec.ts
```

Tests cover:
- UI configuration flow
- API source selection
- Endpoint configuration
- Parameter input
- Data binding with API responses

## Troubleshooting

### API not fetching data

1. Check browser console for errors
2. Verify Swagger specification URL is accessible
3. Check endpoint ID format (should be "METHOD /path")
4. Validate parameter JSON syntax

### CORS errors

If fetching from external APIs, ensure the API server allows CORS requests from your domain.

### Parameters not working

1. Check parameter names match those in Swagger spec
2. Verify JSON syntax in API Parameters field
3. Ensure parameter types match (string, number, boolean)

### Mock data not showing

Mock data is generated from response schemas. Ensure your Swagger spec includes:
- Response schemas for 200/201 status codes
- Property examples or types

## Limitations

- Authentication: Currently supports header-based authentication only (via parameters)
- OAuth flows not supported yet
- File uploads not supported
- Multipart form data not supported
- WebSocket endpoints not supported

## Future Enhancements

- [ ] OAuth 2.0 support
- [ ] API key management UI
- [ ] Request/response logging
- [ ] API response caching
- [ ] Support for file uploads
- [ ] GraphQL integration
- [ ] Real-time API monitoring

## Example Use Cases

1. **E-commerce Product Catalog**: Fetch products from external API
2. **User Profiles**: Display user data from authentication API
3. **Content Management**: Pull blog posts from headless CMS API
4. **Analytics Dashboards**: Display metrics from analytics API
5. **Dynamic Forms**: Populate dropdowns from API data

## Contributing

When adding new features:

1. Update type definitions in `types.ts`
2. Add parser logic in `parser.ts` if needed
3. Update data fetching in `api-fetcher.ts`
4. Add unit tests in `tests/unit/swagger-parser.spec.ts`
5. Add E2E tests in `tests/e2e/api-integration.spec.ts`
6. Update documentation

## References

- [Swagger 2.0 Specification](https://swagger.io/specification/v2/)
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Puck Documentation](https://puck.sh/docs)
- [Data Binding Documentation](./DATA_BINDING_CARD.md)
