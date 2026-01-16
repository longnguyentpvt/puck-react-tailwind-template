import { type Page, type Locator, expect, FrameLocator } from "@playwright/test";
import { createFieldComponent, FieldType, InputFieldComponent, SelectFieldComponent, TextareaFieldComponent } from "@/tests/components/field.component";
import DropzoneComponent from "../components/dropzone.component";

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

  constructor(public readonly page: Page) {
    this.leftSidebar = page.locator('[class*="_Sidebar--left_"]');
    this.rightSidebar = page.locator('[class*="_Sidebar--right_"]');
    this.canvasIframe = page.frameLocator('#preview-frame');
    this.centerCanvas = this.canvasIframe.getByTestId('dropzone:root:default-zone');
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

    await componentLocator.scrollIntoViewIfNeeded();
    
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
    const targetY = iframeBox.y + targetBox.y + targetBox.height / 2; // Bottom center with small offset
    
    // Perform manual drag operation
    await this.page.mouse.move(sourceX, sourceY);
    await this.page.mouse.down();
    await this.page.mouse.move(targetX, targetY, { steps: 10 });
    await this.page.mouse.up();
  }

  async dragComponentToDropZone(componentName: string, dropzoneComponent: DropzoneComponent) {
    await expect(this.centerCanvas).toBeVisible({ timeout: 5_000 });
    const componentLocator = this.getDrawerLocator(componentName);

    await componentLocator.scrollIntoViewIfNeeded();
    
    // Get source element bounding box
    const sourceBox = await componentLocator.boundingBox();
    if (!sourceBox) throw new Error(`Could not get bounding box for ${componentName}`);
    
    // Get iframe element and its position
    const iframeElement = this.page.locator('#preview-frame');
    const iframeBox = await iframeElement.boundingBox();
    if (!iframeBox) throw new Error('Could not get iframe bounding box');
    
    // Get target element position within the iframe
    const dropzoneLocator = dropzoneComponent.getDropzoneArea();
    const targetBox = await dropzoneLocator.boundingBox();
    if (!targetBox) throw new Error('Could not get target bounding box');
    
    // Calculate absolute positions
    const sourceX = sourceBox.x + sourceBox.width / 2;
    const sourceY = sourceBox.y + sourceBox.height / 2;
    const targetX = iframeBox.x + targetBox.x + targetBox.width / 2;
    const targetY = targetBox.y + targetBox.height / 2;
    
    // Perform manual drag operation
    await this.page.mouse.move(sourceX, sourceY);
    await this.page.mouse.down();
    await this.page.mouse.move(targetX, targetY, { steps: 10 });
    await this.page.waitForTimeout(5_000);
    await this.page.mouse.up();
  }
}