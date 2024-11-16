import { TodoAction } from "./TodoTypes";
import { TodoState, TodoList, TodoItem } from "../../utils/types";

// Helper functions for calculations
const calculateListTotal = (items: TodoItem[]): number => {
  return items.reduce((sum, item) => sum + (item.price || 0), 0);
};

const calculateGrandTotal = (lists: TodoList[]): number => {
  return lists.reduce((sum, list) => sum + calculateListTotal(list.items), 0);
};

const updateListsWithTotals = (lists: TodoList[]): TodoList[] => {
  return lists.map((list) => ({
    ...list,
    total: calculateListTotal(list.items),
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
      };
      const updatedLists = [...state.lists, newList];
      return {
        ...state,
        lists: updatedLists,
        grandTotal: calculateGrandTotal(updatedLists),
      };
    }

    case "UPDATE_LIST": {
      const updatedLists = state.lists.map((list) =>
        list.listId === action.payload.listId
          ? { ...list, ...action.payload.updates }
          : list
      );
      return {
        ...state,
        lists: updateListsWithTotals(updatedLists),
        grandTotal: calculateGrandTotal(updatedLists),
      };
    }

    case "DELETE_LIST": {
      const updatedLists = state.lists.filter(
        (list) => list.listId !== action.payload
      );
      return {
        ...state,
        lists: updatedLists,
        grandTotal: calculateGrandTotal(updatedLists),
      };
    }

    case "ADD_ITEM": {
      const updatedLists = state.lists.map((list) =>
        list.listId === action.payload.listId
          ? {
              ...list,
              items: [...list.items, action.payload.item],
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
              items: list.items.map((item) =>
                item.itemId === action.payload.itemId
                  ? { ...item, ...action.payload.updates }
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
