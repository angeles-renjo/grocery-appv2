import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StorageKeys,
  StorageData,
  TodoList,
  TodoItem,
  ListId,
  ItemId,
} from "./types";

class StorageError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = "StorageError";
  }
}

export class TodoStorage {
  private static instance: TodoStorage;
  private readonly defaultData: StorageData = {
    lists: [],
    version: 1,
  };

  private constructor() {}

  static getInstance(): TodoStorage {
    if (!TodoStorage.instance) {
      TodoStorage.instance = new TodoStorage();
    }
    return TodoStorage.instance;
  }

  private async getStorageData(): Promise<StorageData> {
    try {
      const data = await AsyncStorage.getItem(StorageKeys.ROOT);
      return data ? JSON.parse(data) : this.defaultData;
    } catch (error) {
      throw new StorageError(
        "Failed to get storage data",
        "getStorageData",
        error as Error
      );
    }
  }

  private async saveStorageData(data: StorageData): Promise<void> {
    try {
      await AsyncStorage.setItem(StorageKeys.ROOT, JSON.stringify(data));
    } catch (error) {
      throw new StorageError(
        "Failed to save storage data",
        "saveStorageData",
        error as Error
      );
    }
  }

  private calculateListTotal(items: TodoItem[]): number {
    return items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
  }

  async getLists(): Promise<TodoList[]> {
    try {
      const { lists } = await this.getStorageData();
      return lists.map((list) => ({
        ...list,
        total: this.calculateListTotal(list.items),
        dueDate: new Date(list.dueDate),
        createdAt: new Date(list.createdAt),
        updatedAt: new Date(list.updatedAt),
      }));
    } catch (error) {
      throw new StorageError("Failed to get lists", "getLists", error as Error);
    }
  }

  async addList(params: { title: string; dueDate: Date }): Promise<TodoList> {
    const data = await this.getStorageData();
    const now = new Date();

    const newList: TodoList = {
      listId: ListId.create().getValue(),
      title: params.title,
      items: [],
      total: 0,
      dueDate: params.dueDate,
      createdAt: now,
      updatedAt: now,
    };

    data.lists.push(newList);
    await this.saveStorageData(data);
    return newList;
  }

  async addItem(params: {
    listId: number;
    name: string;
    price?: number;
    quantity?: number;
  }): Promise<TodoItem> {
    const data = await this.getStorageData();
    const listIndex = data.lists.findIndex(
      (list) => list.listId === params.listId
    );

    if (listIndex === -1) {
      throw new Error(`List with id ${params.listId} not found`);
    }

    const now = new Date();
    const newItem: TodoItem = {
      itemId: ItemId.create().getValue(),
      name: params.name,
      price: params.price || 0,
      quantity: params.quantity || 1,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    data.lists[listIndex].items.push(newItem);
    // Update list total with quantity
    data.lists[listIndex].total = this.calculateListTotal(
      data.lists[listIndex].items
    );
    data.lists[listIndex].updatedAt = now;

    await this.saveStorageData(data);
    return newItem;
  }

  async deleteList(listId: number): Promise<void> {
    const data = await this.getStorageData();
    data.lists = data.lists.filter((list) => list.listId !== listId);
    await this.saveStorageData(data);
  }

  async deleteItem(params: { listId: number; itemId: number }): Promise<void> {
    const data = await this.getStorageData();
    const list = data.lists.find((l) => l.listId === params.listId);
    if (list) {
      list.items = list.items.filter((item) => item.itemId !== params.itemId);
      // Update list total
      list.total = this.calculateListTotal(list.items);
      list.updatedAt = new Date();
      await this.saveStorageData(data);
    }
  }

  async updateList(params: {
    listId: number;
    updates: Partial<Omit<TodoList, "listId" | "items">>;
  }): Promise<void> {
    const data = await this.getStorageData();
    const list = data.lists.find((l) => l.listId === params.listId);
    if (list) {
      Object.assign(list, params.updates, { updatedAt: new Date() });
      await this.saveStorageData(data);
    }
  }

  async updateItem(params: {
    listId: number;
    itemId: number;
    updates: Partial<Omit<TodoItem, "itemId">>;
  }): Promise<void> {
    const data = await this.getStorageData();
    const list = data.lists.find((l) => l.listId === params.listId);
    if (list) {
      const item = list.items.find((i) => i.itemId === params.itemId);
      if (item) {
        Object.assign(item, params.updates, { updatedAt: new Date() });
        // Update list total if price or quantity changed
        if (
          params.updates.price !== undefined ||
          params.updates.quantity !== undefined
        ) {
          list.total = this.calculateListTotal(list.items);
        }
        list.updatedAt = new Date();
        await this.saveStorageData(data);
      }
    }
  }
}
