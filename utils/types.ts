// types.ts
export interface TodoItem {
  itemId: number;
  name: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoList {
  listId: number;
  title: string;
  items: TodoItem[];
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorageData {
  lists: TodoList[];
  version: number;
}

// Enums to replace string literals
export enum StorageKeys {
  ROOT = "@TodoApp",
  LISTS = "@TodoApp:lists",
  SETTINGS = "@TodoApp:settings",
}

// Value objects to address primitive obsession
export class ListId {
  private constructor(private value: number) {}

  static create(): ListId {
    return new ListId(Date.now());
  }

  static fromNumber(value: number): ListId {
    return new ListId(value);
  }

  getValue(): number {
    return this.value;
  }
}

export class ItemId {
  private constructor(private value: number) {}

  static create(): ItemId {
    return new ItemId(Date.now());
  }

  static fromNumber(value: number): ItemId {
    return new ItemId(value);
  }

  getValue(): number {
    return this.value;
  }
}
