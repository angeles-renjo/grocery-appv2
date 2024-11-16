// styles/todoList.styles.ts
import { StyleSheet } from "react-native";

export const todoListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#c62828",
  },
  // Create List Section
  createListContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  createListInputContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 8,
  },
  createListInput: {
    padding: 12,
  },
  createListDateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  createListDateText: {
    marginLeft: 8,
    color: "#666",
  },
  createListButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  // List Section
  listsList: {
    flex: 1,
  },
  listContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  listTitleContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  listActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Date Related
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  calendarIcon: {
    marginRight: 4,
  },
  dateText: {
    color: "#666",
    fontSize: 14,
    marginRight: 12,
  },

  // Action Buttons
  deleteButton: {
    padding: 4,
  },

  // Items Section
  itemsContainer: {
    marginTop: 8,
  },
  addItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  addItemInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  addItemButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    padding: 8,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  deleteItemButton: {
    padding: 4,
  },

  // Date Picker Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  datePickerButton: {
    fontSize: 16,
    color: "#007AFF",
  },
  datePickerDoneButton: {
    fontWeight: "600",
  },
  datePickerIOS: {
    height: 200,
  },
});
