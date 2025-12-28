# Playwright Tests

This directory contains end-to-end tests for the Puck Dialog component using Playwright.

## Setup

Playwright is configured to run tests only with Chromium browser as specified.

## Test Files

### `dialog.spec.ts`
Tests the complete Dialog component workflow:
1. Opens the Puck editor
2. Drags the Dialog component to the canvas
3. Adds a Button component to the trigger slot
4. Clicks the trigger button to open the dialog
5. Adds Heading and Text components to the dialog content
6. Verifies the dialog functionality in both edit and runtime modes

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

### Run specific test file
```bash
npx playwright test tests/dialog.spec.ts
```

## Test Results

- Test reports are generated in `playwright-report/` directory
- Screenshots are saved in `tests/screenshots/` directory
- Videos and traces (on failure) are saved in `test-results/` directory

## Environment

Tests expect:
- Development server running on `http://localhost:3000`
- Puck editor accessible at `/puck/edit`
- Dialog component available in the Components sidebar

## Notes

- Tests automatically start the dev server before running (configured in `playwright.config.ts`)
- Tests use Chromium only as specified in requirements
- Screenshots are captured on failure and at key points in the workflow
