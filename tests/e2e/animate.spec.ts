import { test, expect, Page, BrowserContext } from "@playwright/test";
import { EditorPage } from "@/tests/pages/editor.page";

test.describe("Animate component", () => {
  let page: Page;
  let context: BrowserContext;
  let editorPage: EditorPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto("/test/edit");
    editorPage = new EditorPage(page);
  });

  test.afterAll(async () => {
    await context.close();
  });

  test("allows configuring default, hover, and click animations", async () => {
    await editorPage.dragComponentToEditor("Animate");

    const animateComponent = editorPage.getPuckComponentLocator("Animate", 0);
    await expect(animateComponent).toBeVisible({ timeout: 5_000 });

    await animateComponent.click();

    const defaultField = editorPage.getPuckFieldLocator("Default animation", "select");
    const hoverField = editorPage.getPuckFieldLocator("Hover animation", "select");
    const clickField = editorPage.getPuckFieldLocator("Click animation", "select");

    await defaultField.selectOptionByLabel("Spin");
    await hoverField.selectOptionByLabel("Ping");
    await clickField.selectOptionByLabel("Bounce");

    await expect(defaultField.input).toHaveValue("spin");
    await expect(hoverField.input).toHaveValue("ping");
    await expect(clickField.input).toHaveValue("bounce");
  });
});
