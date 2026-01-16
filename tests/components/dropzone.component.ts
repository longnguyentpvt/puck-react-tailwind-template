import { Locator, Page } from "@playwright/test";

class DropzoneComponent {
    public readonly page: Page;
    public readonly component: Locator;
    public readonly componentName: string;

    constructor(component: Locator, componentName: string) {
        this.page = component.page();
        this.component = component;
        this.componentName = componentName;
    }

    get dropZoneSelector(): string {
        return `[data-testid^="dropzone:${this.componentName}-"]`;
    }

    getDropzoneArea(): Locator {
        return this.component.locator(this.dropZoneSelector).nth(0);
    }
}

export default DropzoneComponent;