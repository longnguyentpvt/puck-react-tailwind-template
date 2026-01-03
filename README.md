# Scope
This repository is to building a template for UI builder by drag and drop and simple traditional CMS. Techniques applied:
- Puck
- NextJS
- Tailwind
- Shadcn UI components


# Components

## CustomElement Component

The CustomElement component allows you to create custom wrapper elements with any Tailwind CSS classes you need, providing maximum flexibility when the existing components don't fit your requirements.

### Features

- **Custom Tailwind Classes**: Add any Tailwind CSS utility classes to style your wrapper element
- **HTML Element Selection**: Choose from various HTML semantic elements (div, span, section, article, aside, header, footer, nav, main)
- **Slot for Any Components**: Drag and drop any Puck components inside the CustomElement
- **Layout Support**: Includes full layout system support with padding, margins, flex, and grid options

### Usage

1. Drag the **CustomElement** component from the "Other" category in the Puck editor
2. Click on the component to configure it in the right sidebar:
   - **HTML Element**: Select the semantic HTML element type
   - **Custom Tailwind Classes**: Enter any Tailwind CSS classes (e.g., `bg-blue-500 text-white p-4 rounded-lg shadow-md`)
3. Drag other components (Text, Button, Heading, etc.) into the CustomElement's content area
4. Use the Layout tab to adjust spacing and positioning

### Example Use Cases

- Creating unique call-to-action sections with custom styling and nested components
- Building custom card layouts not covered by the Card component
- Adding custom-styled containers for grouping components
- Creating unique header or footer sections with specific Tailwind classes and nested elements


# CI/CD

This project includes automated CI checks for pull requests to the main branch:

## PR Checks Workflow

When you create a pull request to the `main` branch, the following checks will run automatically:

### 1. Lint and Build
- Installs dependencies using Yarn
- Runs ESLint to check code quality
- Builds the Next.js application to ensure no build errors

### 2. Docker Build and Playwright Tests
- Builds the Docker image for the application
- Starts a MongoDB container for testing
- Runs the application in a Docker container
- Executes Playwright end-to-end tests against the containerized application
- Uploads test reports as artifacts

All checks must pass before a pull request can be merged.

## Running Tests Locally

To run Playwright tests locally:

```bash
# Install dependencies
yarn install

# Install Playwright browsers
npx playwright install --with-deps chromium

# Run tests (requires the app to be running)
yarn test:e2e
```


# `next` recipe

The `next` recipe showcases one of the most powerful ways to implement Puck using to provide an authoring tool for any route in your Next app.

## Demonstrates

- Next.js App Router implementation
- JSON database implementation with HTTP API
- Catch-all routes to use puck for any route on the platform
- Incremental static regeneration (ISR) for all Puck pages

## Usage

Run the generator and enter `next` when prompted

```
npx create-puck-app my-app
```

Start the server

```
yarn dev
```

Navigate to the homepage at https://localhost:3000. To edit the homepage, access the Puck editor at https://localhost:3000/edit.

You can do this for any route on the application, **even if the page doesn't exist**. For example, visit https://localhost:3000/hello/world and you'll receive a 404. You can author and publish a page by visiting https://localhost:3000/hello/world/edit. After publishing, go back to the original URL to see your page.

## Using this recipe

To adopt this recipe you will need to:

- **IMPORTANT** Add authentication to `/edit` routes. This can be done by modifying the example API routes in `/app/puck/api/route.ts` and server component in `/app/puck/[...puckPath]/page.tsx`. **If you don't do this, Puck will be completely public.**
- Integrate your database into the API calls in `/app/puck/api/route.ts`
- Implement a custom puck configuration in `puck.config.tsx`

By default, this recipe will generate static pages by setting `dynamic` to [`force-static`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic) in the `/app/[...puckPath]/page.tsx`. This will strip headers and cookies. If you need dynamic pages, you can delete this.
