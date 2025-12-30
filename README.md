# Scope
This repository is to building a template for UI builder by drag and drop and simple traditional CMS. Techniques applied:
- Puck
- NextJS
- Tailwind
- Shadcn UI components


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
