// utils/types.ts
export interface TodoItem {
  itemId: number;
  name: string;
  completed: boolean;
  price: number;
  quantity: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface TodoList {
  listId: number;
  title: string;
  items: TodoItem[];
  total: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean; // New field
  completedAt?: Date; // New field
}

// Storage Types
export interface StorageData {
  lists: TodoList[];
  version: number;
}

// Storage Enums
export enum StorageKeys {
  ROOT = '@TodoApp',
  LISTS = '@TodoApp:lists',
  SETTINGS = '@TodoApp:settings',
}

// Value Objects
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

// Toast Types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ToastState {
  toasts: Toast[];
}

export type ToastAction =
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string };

export interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

export interface TodoState {
  lists: TodoList[];
  loading: boolean;
  error: string | null;
  grandTotal: number;
}

export type ItemUpdate = Partial<{
  completed: boolean;
  price: number;
  quantity: number;
  name: string;
}>;

export interface ChartDataPoint {
  value: number;
  label: string;
}
