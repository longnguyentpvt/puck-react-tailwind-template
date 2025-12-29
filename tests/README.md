# Playwright Tests

This directory contains end-to-end tests for the Puck Dialog component using Playwright.

## Setup

Playwright is configured to run tests only with Chromium browser as specified.

## Test Files

### `dialog.spec.ts`
Tests the Dialog component workflow in multiple scenarios:

1. **Test 1**: Verifies Dialog component exists in the sidebar
2. **Test 2**: Adds Dialog component and adds Button to trigger slot
3. **Test 3**: Tests clicking the trigger to open dialog and adding content
4. **Test 4**: Complete end-to-end workflow test

Each test takes screenshots at key points to help with debugging.

## Running Tests

### Prerequisites
Make sure you have:
- Node modules installed: `npm install`
- Chromium browser installed: `npx playwright install chromium`

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

### Run a specific test
```bash
npx playwright test tests/dialog.spec.ts -g "should open Puck editor"
```

## Test Results

- Test reports are generated in `playwright-report/` directory
  - View with: `npx playwright show-report`
- Screenshots are saved in `tests/screenshots/` directory
- Videos (on failure) are saved in `test-results/` directory
- Traces (on retry) can be viewed with Playwright trace viewer

## Environment

Tests expect:
- Development server running on `http://localhost:3000` (auto-started by Playwright)
- Puck editor accessible at `/puck/edit`
- Dialog component available in the Components sidebar

## Test Flow

The tests simulate this workflow:
1. Opens Puck editor at `/puck/edit`
2. Verifies Dialog component is in the sidebar
3. Clicks Dialog to add it to the canvas
4. Verifies Dialog editor appears
5. Clicks Button component to add it to trigger slot
6. Attempts to click trigger to open dialog
7. If dialog opens, adds Heading and Text components
8. Closes dialog with ESC key
9. Takes screenshots at each step for verification

## Debugging Failed Tests

If tests fail:

1. Check screenshots in `tests/screenshots/` to see what happened
2. Run in headed mode: `npm run test:headed` to watch the browser
3. Use debug mode: `npm run test:debug` to step through
4. Check the HTML report: `npx playwright show-report`
5. Look for video recordings in `test-results/` if available

## Notes

- Tests are configured to run sequentially (one at a time) for reliability
- Each test has a 120-second timeout
- Screenshots are taken at every major step
- Tests automatically retry once on failure
- Chromium only (as specified in requirements)
- Dev server is automatically started before tests run
