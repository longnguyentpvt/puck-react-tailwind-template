import { type Locator } from "@playwright/test";

export type FieldType = 'input' | 'select' | 'textarea';

type FieldMethods<T extends FieldType> = T extends 'select'
  ? { selectOption: (value: string) => Promise<void>; input: Locator }
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

type FieldComponentMap = {
  input: InputFieldComponent;
  select: SelectFieldComponent;
  textarea: TextareaFieldComponent;
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
    default:
      throw new Error(`Unknown field type: ${type}`);
  }
}
