// context/todo/TodoActions.ts
import { TodoStorage } from "../../utils/storage";
import { TodoList, TodoItem, ToastContextType } from "../../utils/types";
import { TodoAction } from "./TodoTypes";

export const createTodoActions = (
  dispatch: React.Dispatch<TodoAction>,
  storage: TodoStorage,
  toast: ToastContextType
) => ({
  loadLists: async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const lists = await storage.getLists();
      dispatch({ type: "SET_LISTS", payload: lists });
      toast.showToast("Lists loaded successfully", "success");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load lists" });
      toast.showToast("Failed to load lists", "error");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },

  addList: async (title: string, dueDate: Date) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const newList = await storage.addList({ title, dueDate });
      dispatch({ type: "ADD_LIST", payload: newList });
      toast.showToast("List added successfully", "success");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to add list" });
      toast.showToast("Failed to add list", "error");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },

  updateList: async (listId: number, updates: Partial<TodoList>) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await storage.updateList({ listId, updates });
      dispatch({ type: "UPDATE_LIST", payload: { listId, updates } });
      toast.showToast("List updated successfully", "success");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update list" });
      toast.showToast("Failed to update list", "error");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },

  deleteList: async (listId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await storage.deleteList(listId);
      dispatch({ type: "DELETE_LIST", payload: listId });
      toast.showToast("List deleted successfully", "success");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to delete list" });
      toast.showToast("Failed to delete list", "error");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },

  addItem: async (listId: number, name: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const newItem = await storage.addItem({ listId, name });
      dispatch({ type: "ADD_ITEM", payload: { listId, item: newItem } });
      toast.showToast("Item added successfully", "success");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to add item" });
      toast.showToast("Failed to add item", "error");
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
      toast.showToast("Item updated successfully", "success");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update item" });
      toast.showToast("Failed to update item", "error");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },

  deleteItem: async (listId: number, itemId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await storage.deleteItem({ listId, itemId });
      dispatch({ type: "DELETE_ITEM", payload: { listId, itemId } });
      toast.showToast("Item deleted successfully", "success");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to delete item" });
      toast.showToast("Failed to delete item", "error");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },
});
