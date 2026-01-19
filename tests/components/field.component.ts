import { type Locator } from "@playwright/test";

export type FieldType = 'input' | 'select' | 'textarea' | 'radio';

type FieldMethods<T extends FieldType> = T extends 'select'
  ? { selectOption: (value: string) => Promise<void>; input: Locator }
  : T extends 'radio'
  ? { selectOption: (label: string) => Promise<void>; input: Locator }
  : { fill: (value: string) => Promise<void>; input: Locator };

class BaseFieldComponent {
  readonly container: Locator;
  readonly label: Locator;
  readonly input: Locator;

  constructor(container: Locator) {
    this.container = container;
    this.label = container.locator('[class*="_Input-label_"]');
    this.input = container.locator('[class*="_Input-input_"]');
  }
}

export class InputFieldComponent extends BaseFieldComponent {
  constructor(container: Locator) {
    super(container);
  }

  async fill(value: string) {
    await this.input.fill(value);
  }
}

export class TextareaFieldComponent extends BaseFieldComponent {

  constructor(container: Locator) {
    super(container);
  }

  async fill(value: string) {
    await this.input.fill(value);
  }
}

export class SelectFieldComponent extends BaseFieldComponent {
  constructor(container: Locator) {
    super(container);
  }

  async selectOption(value: string) {
    await this.input.selectOption(value, { timeout: 5_000 });
  }

  async selectOptionByLabel(label: string) {
    await this.input.selectOption({ label }, { timeout: 5_000 });
  }

  async selectOptionByIndex(index: number) {
    await this.input.selectOption({ index }, { timeout: 5_000 });
  }
}

export class RadioFieldComponent extends BaseFieldComponent {
  constructor(container: Locator) {
    super(container);
    // For radio buttons, the "input" locator points to the radio group container
    this.input = container.locator('[class*="_Input-radioGroupItems_"]');
  }

  /**
   * Select a radio option by clicking on its label
   * @param labelText - The text of the label to click (e.g., "Yes", "No")
   */
  async selectOption(labelText: string) {
    // Find the label with the matching text and click it
    const label = this.container.locator('label').filter({ hasText: new RegExp(`^"?${labelText}"?$`) });
    await label.click({ timeout: 5_000 });
  }

  /**
   * Get the currently selected radio value
   */
  async getSelectedValue(): Promise<string | null> {
    const checkedRadio = this.container.locator('input[type="radio"]:checked');
    const value = await checkedRadio.getAttribute('value').catch(() => null);
    
    if (!value) return null;
    
    // Parse the JSON value format used by Puck
    try {
      const parsed = JSON.parse(value);
      return parsed.value?.toString() || value;
    } catch {
      return value;
    }
  }

  /**
   * Check if a specific option is selected
   * @param labelText - The label text to check
   */
  async isOptionSelected(labelText: string): Promise<boolean> {
    const label = this.container.locator('label').filter({ hasText: new RegExp(`^"?${labelText}"?$`) });
    const labelFor = await label.getAttribute('for').catch(() => null);
    
    if (labelFor) {
      const radio = this.container.locator(`input[id="${labelFor}"]`);
      return await radio.isChecked().catch(() => false);
    }
    
    // Fallback: check by finding the radio near the label
    const parentDiv = label.locator('..');
    const radio = parentDiv.locator('input[type="radio"]');
    return await radio.isChecked().catch(() => false);
  }
}

type FieldComponentMap = {
  input: InputFieldComponent;
  select: SelectFieldComponent;
  textarea: TextareaFieldComponent;
  radio: RadioFieldComponent;
};

export function createFieldComponent<T extends FieldType>(
  container: Locator,
  type: T
): FieldComponentMap[T] {
  switch (type) {
    case 'input':
      return new InputFieldComponent(container) as FieldComponentMap[T];
    case 'select':
      return new SelectFieldComponent(container) as FieldComponentMap[T];
    case 'textarea':
      return new TextareaFieldComponent(container) as FieldComponentMap[T];
    case 'radio':
      return new RadioFieldComponent(container) as FieldComponentMap[T];
    default:
      throw new Error(`Unknown field type: ${type}`);
  }
}
