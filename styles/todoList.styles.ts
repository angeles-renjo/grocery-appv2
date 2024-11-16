import { StyleSheet } from "react-native";

export const todoListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 10,
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
    padding: 16,
  },

  itemsListContent: {
    paddingBottom: 16,
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

  addItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },

  addItemInput: {
    flex: 1,
    height: 44,
    backgroundColor: "#F5F5F5",
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333333",
    marginRight: 12,
  },

  addItemButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  // List styles for the home screen

  listContent: {
    padding: 16,
  },

  listInfo: {
    flexDirection: "row",
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

  // Additional utility styles
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
  listsContainer: {
    paddingBottom: 16,
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
});

// import { StyleSheet } from "react-native";

// export const todoListStyles = StyleSheet.create({

//   // Create List Section

//   // Date Related
//   dateButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 4,
//   },
//   calendarIcon: {
//     marginRight: 4,
//   },
//   dateText: {
//     color: "#666",
//     fontSize: 14,
//     marginRight: 12,
//   },

//   // Action Buttons
//   deleteButton: {
//     padding: 4,
//   },

//   // Items Section
//   itemsContainer: {
//     marginTop: 8,
//   },
//   addItemContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//   },

//   addItemButton: {
//     backgroundColor: "#2196F3",
//     borderRadius: 8,
//     padding: 8,
//   },

//   itemText: {
//     flex: 1,
//     fontSize: 16,
//   },
//   deleteItemButton: {
//     padding: 4,
//   },

//   // Date Picker Modal
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "flex-end",
//     backgroundColor: "rgba(0, 0, 0, 0.4)",
//   },
//   modalContent: {
//     backgroundColor: "white",
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//   },
//   datePickerHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//   },
//   datePickerButton: {
//     fontSize: 16,
//     color: "#007AFF",
//   },
//   datePickerDoneButton: {
//     fontWeight: "600",
//   },
//   datePickerIOS: {
//     height: 200,
//   },
//   listDetailHeader: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//   },
//   listDetailTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   listDetailDate: {
//     fontSize: 16,
//     color: "#666",
//   },
//   itemCount: {
//     fontSize: 12,
//     color: "#666",
//     marginTop: 4,
//   },

//   dueDateButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 8,
//     backgroundColor: "#f5f5f5",
//     borderRadius: 8,
//     alignSelf: "flex-start",
//   },
//   dueDateText: {
//     marginLeft: 8,
//     color: "#666",
//     fontSize: 16,
//   },
//   itemsList: {
//     flex: 1,
//   },
//   itemsListContent: {
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//   },
//   listContent: {
//     flex: 1,
//   },
//   itemCheckbox: {
//     marginRight: 12,
//   },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: "#2196F3",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   checkboxChecked: {
//     backgroundColor: "#2196F3",
//   },
//   itemTextCompleted: {
//     textDecorationLine: "line-through",
//     color: "#999",
//   },
//   listTotal: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginTop: 16,
//   },
//   listTotalText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginTop: 16,
//   },
//   listInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   totalText: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#333",
//     marginLeft: 16,
//   },

//   itemContent: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginRight: 8,
//   },

//   priceText: {
//     fontSize: 16,
//     color: "#666",
//     minWidth: 60,
//     textAlign: "right",
//   },

//   priceInput: {
//     fontSize: 16,
//     color: "#333",
//     minWidth: 60,
//     textAlign: "right",
//     borderBottomWidth: 1,
//     borderBottomColor: "#0066FF",
//     paddingVertical: 2,
//   },

//   addItemPriceInput: {
//     width: 80,
//     height: 40,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginLeft: 8,
//     fontSize: 16,
//   },

//   addItemInput: {
//     flex: 1,
//     height: 40,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     fontSize: 16,
//   },

//   itemContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
// });
