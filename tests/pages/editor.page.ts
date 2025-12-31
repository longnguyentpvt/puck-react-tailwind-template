import { type Page, type Locator, expect, FrameLocator } from "@playwright/test";
import { createFieldComponent, FieldType, InputFieldComponent, SelectFieldComponent, TextareaFieldComponent } from "@/tests/components/field.component";

type FieldComponentMap = {
  input: InputFieldComponent;
  select: SelectFieldComponent;
  textarea: TextareaFieldComponent;
};

export class EditorPage {
  readonly leftSidebar: Locator;
  readonly rightSidebar: Locator;
  readonly centerCanvas: Locator;
  readonly canvasIframe: FrameLocator;
  readonly publishButton: Locator;

  constructor(public readonly page: Page) {
    this.leftSidebar = page.locator('[class*="_Sidebar--left_"]');
    this.rightSidebar = page.locator('[class*="_Sidebar--right_"]');
    this.canvasIframe = page.frameLocator('#preview-frame');
    this.centerCanvas = this.canvasIframe.getByTestId('dropzone:root:default-zone');
    this.publishButton = page.locator('button:has-text("Publish")');
  }

  getDrawerLocator(drawerName: string): Locator {
    return this.leftSidebar.getByTestId(`drawer-item:${drawerName}`);
  }

  getPuckComponentLocator(componentName: string, idx: number): Locator {
    return this.centerCanvas.locator(`[data-puck-component^="${componentName}-"]`).nth(idx);
  }

  getPuckFieldLocator<T extends FieldType>(fieldName: string, type: T): FieldComponentMap[T] {
    const container = this.rightSidebar.locator(`[class*="_PuckFields-field"]:has([class*="_Input-label_"]:text-is("${fieldName}"))`);
    return createFieldComponent(container, type);
  }

  async dragComponentToEditor(componentName: string) {
    await expect(this.centerCanvas).toBeVisible({ timeout: 5_000 });
    const componentLocator = this.getDrawerLocator(componentName);
    
    // Get source element bounding box
    const sourceBox = await componentLocator.boundingBox();
    if (!sourceBox) throw new Error(`Could not get bounding box for ${componentName}`);
    
    // Get iframe element and its position
    const iframeElement = this.page.locator('#preview-frame');
    const iframeBox = await iframeElement.boundingBox();
    if (!iframeBox) throw new Error('Could not get iframe bounding box');
    
    // Get target element position within the iframe
    const targetBox = await this.centerCanvas.boundingBox();
    if (!targetBox) throw new Error('Could not get target bounding box');
    
    // Calculate absolute positions
    const sourceX = sourceBox.x + sourceBox.width / 2;
    const sourceY = sourceBox.y + sourceBox.height / 2;
    const targetX = iframeBox.x + targetBox.x + targetBox.width / 2;
    const targetY = iframeBox.y + targetBox.y + targetBox.height - 10; // Bottom center with small offset
    
    // Perform manual drag operation
    await this.page.mouse.move(sourceX, sourceY);
    await this.page.mouse.down();
    await this.page.mouse.move(targetX, targetY, { steps: 10 });
    await this.page.mouse.up();
  }

  async deleteAllComponents() {
    // Get all components in the canvas
    const components = this.centerCanvas.locator('[data-puck-component]');
    const count = await components.count();
    
    // Delete each component by clicking on it and pressing Delete/Backspace key
    for (let i = count - 1; i >= 0; i--) {
      const component = components.nth(i);
      await component.click();
      await this.page.keyboard.press('Backspace');
      // Wait a bit for the component to be removed
      await this.page.waitForTimeout(200);
    }
  }

  async publish() {
    await this.publishButton.click();
    // Wait for publish to complete
    await this.page.waitForTimeout(1000);
  }
}