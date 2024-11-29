import { TodoAction } from "./TodoTypes";
import { TodoState, TodoList, TodoItem } from "../../utils/types";

// Helper functions for calculations with quantity support
const calculateListTotal = (items: TodoItem[]): number => {
  return items
    .filter((item) => item.completed) // Only sum completed items
    .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
};

const calculateGrandTotal = (lists: TodoList[]): number => {
  // Sum up all completed items across all lists, regardless of list completion status
  return lists.reduce(
    (total, list) => total + calculateListTotal(list.items),
    0
  );
};

const updateListsWithTotals = (lists: TodoList[]): TodoList[] => {
  return lists.map((list) => ({
    ...list,
    total: calculateListTotal(list.items), // List total is sum of its completed items
  }));
};

export const initialState: TodoState = {
  lists: [],
  loading: false,
  error: null,
  grandTotal: 0,
};

export const todoReducer = (
  state: TodoState,
  action: TodoAction
): TodoState => {
  switch (action.type) {
    case "SET_LISTS": {
      const updatedLists = updateListsWithTotals(action.payload);
      return {
        ...state,
        lists: updatedLists,
        grandTotal: calculateGrandTotal(updatedLists),
      };
    }

    case "ADD_LIST": {
      const newList = {
        ...action.payload,
        total: 0,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedLists = [...state.lists, newList];
      const listsWithTotals = updateListsWithTotals(updatedLists);
      return {
        ...state,
        lists: listsWithTotals,
        grandTotal: calculateGrandTotal(listsWithTotals),
      };
    }

    case "UPDATE_LIST": {
      const updatedLists = state.lists.map((list) =>
        list.listId === action.payload.listId
          ? {
              ...list,
              ...action.payload.updates,
              updatedAt: new Date(),
              ...(action.payload.updates.isCompleted &&
                !action.payload.updates.completedAt && {
                  completedAt: new Date(),
                }),
            }
          : list
      );
      const listsWithTotals = updateListsWithTotals(updatedLists);
      return {
        ...state,
        lists: listsWithTotals,
        grandTotal: calculateGrandTotal(listsWithTotals),
      };
    }

    case "COMPLETE_LIST": {
      const updatedLists = state.lists.map((list) =>
        list.listId === action.payload.listId
          ? {
              ...list,
              isCompleted: true,
              completedAt: action.payload.completedAt,
              updatedAt: new Date(),
              // When list is completed, mark all items as completed
              items: list.items.map((item) => ({
                ...item,
                completed: true,
                updatedAt: new Date(),
              })),
            }
          : list
      );
      const listsWithTotals = updateListsWithTotals(updatedLists);
      return {
        ...state,
        lists: listsWithTotals,
        grandTotal: calculateGrandTotal(listsWithTotals),
      };
    }

    case "DELETE_LIST": {
      const updatedLists = state.lists.filter(
        (list) => list.listId !== action.payload
      );
      const listsWithTotals = updateListsWithTotals(updatedLists);
      return {
        ...state,
        lists: listsWithTotals,
        grandTotal: calculateGrandTotal(listsWithTotals),
      };
    }

    case "ADD_ITEM": {
      const updatedLists = state.lists.map((list) =>
        list.listId === action.payload.listId
          ? {
              ...list,
              updatedAt: new Date(),
              items: [
                ...list.items,
                {
                  ...action.payload.item,
                  quantity: action.payload.item.quantity || 1,
                  completed: false,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            }
          : list
      );
      const listsWithTotals = updateListsWithTotals(updatedLists);
      return {
        ...state,
        lists: listsWithTotals,
        grandTotal: calculateGrandTotal(listsWithTotals),
      };
    }

    case "UPDATE_ITEM": {
      const updatedLists = state.lists.map((list) =>
        list.listId === action.payload.listId
          ? {
              ...list,
              updatedAt: new Date(),
              items: list.items.map((item) =>
                item.itemId === action.payload.itemId
                  ? {
                      ...item,
                      ...action.payload.updates,
                      updatedAt: new Date(),
                      quantity:
                        action.payload.updates.quantity ?? item.quantity ?? 1,
                    }
                  : item
              ),
            }
          : list
      );
      const listsWithTotals = updateListsWithTotals(updatedLists);
      return {
        ...state,
        lists: listsWithTotals,
        grandTotal: calculateGrandTotal(listsWithTotals),
      };
    }

    case "DELETE_ITEM": {
      const updatedLists = state.lists.map((list) =>
        list.listId === action.payload.listId
          ? {
              ...list,
              updatedAt: new Date(),
              items: list.items.filter(
                (item) => item.itemId !== action.payload.itemId
              ),
            }
          : list
      );
      const listsWithTotals = updateListsWithTotals(updatedLists);
      return {
        ...state,
        lists: listsWithTotals,
        grandTotal: calculateGrandTotal(listsWithTotals),
      };
    }

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
