// storage.ts
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

  async initialize(): Promise<void> {
    try {
      const existingData = await AsyncStorage.getItem(StorageKeys.ROOT);
      if (!existingData) {
        await this.saveStorageData(this.defaultData);
      }
    } catch (error) {
      throw new StorageError(
        "Failed to initialize storage",
        "initialize",
        error as Error
      );
    }
  }

  async getLists(): Promise<TodoList[]> {
    try {
      const { lists } = await this.getStorageData();
      return lists.map((list) => ({
        ...list,
        dueDate: new Date(list.dueDate),
        createdAt: new Date(list.createdAt),
        updatedAt: new Date(list.updatedAt),
      }));
    } catch (error) {
      throw new StorageError("Failed to get lists", "getLists", error as Error);
    }
  }

  async addList(params: { title: string; dueDate: Date }): Promise<TodoList> {
    try {
      const data = await this.getStorageData();
      const now = new Date();

      const newList: TodoList = {
        listId: ListId.create().getValue(),
        title: params.title,
        items: [],
        dueDate: params.dueDate,
        createdAt: now,
        updatedAt: now,
      };

      data.lists.push(newList);
      await this.saveStorageData(data);
      return newList;
    } catch (error) {
      throw new StorageError("Failed to add list", "addList", error as Error);
    }
  }

  async addItem(params: { listId: number; name: string }): Promise<TodoItem> {
    try {
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
        completed: false,
        createdAt: now,
        updatedAt: now,
      };

      data.lists[listIndex].items.push(newItem);
      await this.saveStorageData(data);
      return newItem;
    } catch (error) {
      throw new StorageError("Failed to add item", "addItem", error as Error);
    }
  }

  private async updateStorageData(
    operation: (data: StorageData) => Promise<void> | void
  ): Promise<void> {
    try {
      const data = await this.getStorageData();
      await operation(data);
      await this.saveStorageData(data);
    } catch (error) {
      throw new StorageError(
        "Failed to update storage data",
        "updateStorageData",
        error as Error
      );
    }
  }

  async deleteList(listId: number): Promise<void> {
    await this.updateStorageData((data) => {
      data.lists = data.lists.filter((list) => list.listId !== listId);
    });
  }

  async deleteItem(params: { listId: number; itemId: number }): Promise<void> {
    await this.updateStorageData((data) => {
      const list = data.lists.find((l) => l.listId === params.listId);
      if (list) {
        list.items = list.items.filter((item) => item.itemId !== params.itemId);
        list.updatedAt = new Date();
      }
    });
  }

  async updateList(params: {
    listId: number;
    updates: Partial<Omit<TodoList, "listId" | "items">>;
  }): Promise<void> {
    await this.updateStorageData((data) => {
      const list = data.lists.find((l) => l.listId === params.listId);
      if (list) {
        Object.assign(list, params.updates, { updatedAt: new Date() });
      }
    });
  }

  async updateItem(params: {
    listId: number;
    itemId: number;
    updates: Partial<Omit<TodoItem, "itemId">>;
  }): Promise<void> {
    await this.updateStorageData((data) => {
      const list = data.lists.find((l) => l.listId === params.listId);
      if (list) {
        const item = list.items.find((i) => i.itemId === params.itemId);
        if (item) {
          Object.assign(item, params.updates, { updatedAt: new Date() });
        }
      }
    });
  }
}
