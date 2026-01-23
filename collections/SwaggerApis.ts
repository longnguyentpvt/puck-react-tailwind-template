import type { CollectionConfig } from 'payload'

export const SwaggerApis: CollectionConfig = {
  slug: 'swagger-apis',
  admin: {
    useAsTitle: 'label',
    description: 'Manage Swagger/OpenAPI specifications for data binding',
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique identifier for this API source (e.g., "my-api")',
      },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name shown in the API Source dropdown',
      },
    },
    {
      name: 'swaggerUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'URL to the Swagger/OpenAPI JSON specification (can be relative like "/examples/my-swagger.json" or absolute URL)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description of this API source',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable/disable this API source',
      },
    },
  ],
}
