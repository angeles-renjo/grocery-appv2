import { StyleSheet, Platform } from "react-native";

export const todoListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  topContainer: {
    paddingBottom: Platform.OS === "ios" ? 0 : 16,
    backgroundColor: "transparent",
    position: "relative",
    zIndex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#FFE5E5",
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: "#FF4444",
    fontSize: 14,
  },
  listDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  dueDateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  dueDateText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666666",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
  },
  itemsList: {
    flex: 1,
  },
  itemsListContent: {
    padding: 16,
    paddingBottom: 32,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemCheckbox: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemText: {
    fontSize: 16,
    color: "#333333",
    flex: 1,
    marginRight: 8,
  },
  itemTextCompleted: {
    textDecorationLine: "line-through",
    color: "#999999",
  },
  quantityText: {
    fontSize: 14,
    color: "#666666",
    minWidth: 30,
    textAlign: "right",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    minWidth: 70,
    textAlign: "right",
  },
  deleteItemButton: {
    marginLeft: 12,
    padding: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: "relative",
    zIndex: 2,
  },
  addButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
  listInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  itemCount: {
    fontSize: 14,
    color: "#666666",
    marginRight: 12,
  },
  listTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  dateText: {
    fontSize: 14,
    color: "#666666",
    marginRight: 12,
  },
  deleteButton: {
    padding: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  flex1: {
    flex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  grandTotalAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  grandTotalContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  listsList: {
    flex: 1,
  },
  listsContainer: {
    paddingBottom: 16,
    gap: 12,
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
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  listActions: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  titleContainer: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 8,
  },

  editInput: {
    flex: 1,
    padding: 4,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 4,
    marginRight: 8,
  },

  editButton: {
    padding: 4,
  },
  itemNameContainer: {
    flex: 1,
    marginRight: 8,
  },

  itemNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  editItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },

  itemNameInput: {
    flex: 1,
    fontSize: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 4,
    color: "#333333",
    backgroundColor: "white",
  },

  editItemButton: {
    padding: 4,
  },
});
