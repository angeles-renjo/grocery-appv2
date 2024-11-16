import { TodoState, TodoAction } from "./TodoTypes";

// Initial state
export const initialState: TodoState = {
  lists: [],
  loading: false,
  error: null,
};

// Reducer
export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "SET_LISTS":
      return { ...state, lists: action.payload };

    case "ADD_LIST":
      return { ...state, lists: [...state.lists, action.payload] };

    case "UPDATE_LIST":
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.listId === action.payload.listId
            ? { ...list, ...action.payload.updates }
            : list
        ),
      };

    case "DELETE_LIST":
      return {
        ...state,
        lists: state.lists.filter((list) => list.listId !== action.payload),
      };

    case "ADD_ITEM":
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.listId === action.payload.listId
            ? { ...list, items: [...list.items, action.payload.item] }
            : list
        ),
      };

    case "UPDATE_ITEM":
      return {
        ...state,
        lists: state.lists.map((list) =>
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
        ),
      };

    case "DELETE_ITEM":
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.listId === action.payload.listId
            ? {
                ...list,
                items: list.items.filter(
                  (item) => item.itemId !== action.payload.itemId
                ),
              }
            : list
        ),
      };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    default:
      return state;
  }
}
