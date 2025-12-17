import { randomUUID } from "crypto";

export const generateId = (type?: string | number) =>
  type ? `${type}-${randomUUID()}` : randomUUID();
