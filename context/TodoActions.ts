import { TodoStorage } from "../utils/storage";
import { TodoList, TodoItem } from "../utils/types";
import { TodoAction } from "./TodoTypes";

export const createTodoActions = (
  dispatch: React.Dispatch<TodoAction>,
  storage: TodoStorage
) => ({
  loadLists: async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const lists = await storage.getLists();
      dispatch({ type: "SET_LISTS", payload: lists });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load lists" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },

  addList: async (title: string, dueDate: Date) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const newList = await storage.addList({ title, dueDate });
      dispatch({ type: "ADD_LIST", payload: newList });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to add list" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },

  updateList: async (listId: number, updates: Partial<TodoList>) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await storage.updateList({ listId, updates });
      dispatch({ type: "UPDATE_LIST", payload: { listId, updates } });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update list" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },

  deleteList: async (listId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await storage.deleteList(listId);
      dispatch({ type: "DELETE_LIST", payload: listId });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to delete list" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },

  addItem: async (listId: number, name: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const newItem = await storage.addItem({ listId, name });
      dispatch({ type: "ADD_ITEM", payload: { listId, item: newItem } });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to add item" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },

  updateItem: async (
    listId: number,
    itemId: number,
    updates: Partial<TodoItem>
  ) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await storage.updateItem({ listId, itemId, updates });
      dispatch({ type: "UPDATE_ITEM", payload: { listId, itemId, updates } });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update item" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },

  deleteItem: async (listId: number, itemId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await storage.deleteItem({ listId, itemId });
      dispatch({ type: "DELETE_ITEM", payload: { listId, itemId } });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to delete item" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },
});
