import { TodoList, TodoItem, TodoState } from "../../utils/types";

export type TodoAction =
  | { type: "SET_LISTS"; payload: TodoList[] }
  | { type: "ADD_LIST"; payload: TodoList }
  | {
      type: "UPDATE_LIST";
      payload: { listId: number; updates: Partial<TodoList> };
    }
  | { type: "DELETE_LIST"; payload: number }
  | { type: "ADD_ITEM"; payload: { listId: number; item: TodoItem } }
  | {
      type: "UPDATE_ITEM";
      payload: { listId: number; itemId: number; updates: Partial<TodoItem> };
    }
  | { type: "DELETE_ITEM"; payload: { listId: number; itemId: number } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "COMPLETE_LIST";
      payload: {
        listId: number;
        completedAt: Date;
      };
    };

export interface TodoContextType {
  state: TodoState;
  loadLists: () => Promise<void>;
  addList: (title: string, dueDate: Date) => Promise<void>;
  updateList: (listId: number, updates: Partial<TodoList>) => Promise<void>;
  deleteList: (listId: number) => Promise<void>;
  addItem: (
    listId: number,
    name: string,
    initialData?: Partial<TodoItem>
  ) => Promise<void>;
  updateItem: (
    listId: number,
    itemId: number,
    updates: Partial<TodoItem>
  ) => Promise<void>;
  deleteItem: (listId: number, itemId: number) => Promise<void>;
  completeList: (listId: number) => Promise<void>; // Added this method
}
