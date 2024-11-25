import { StyleSheet, Platform } from "react-native";

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  // Total Section
  totalSection: {
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  totalLabel: {
    fontSize: 14,
    color: "#71717A",
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: "600",
    color: "#18181B",
  },
  // Input Section
  inputSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 4,
    height: 50,
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#18181B",
    marginRight: 8,
    ...Platform.select({
      ios: {
        paddingVertical: 10,
      },
      android: {
        paddingVertical: 8,
      },
    }),
  },
  dateButton: {
    height: 42,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  dateButtonText: {
    fontSize: 13,
    color: "#71717A",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#18181B",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  addButtonIcon: {
    color: "#FFFFFF",
  },
  // Lists Section
  listsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#FAFAFA",
  },
  listsHeaderText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#71717A",
    letterSpacing: 0.5,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#71717A",
  },
  // Utility Styles
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
  },
  emptyText: {
    fontSize: 16,
    color: "#71717A",
    textAlign: "center",
    marginTop: 8,
  },
  // Refresh Control
  refreshControl: {
    backgroundColor: "transparent",
  },

  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },

  toggleButtonText: {
    fontSize: 14,
    color: "#666666",
    marginRight: 4,
  },

  toggleIcon: {
    marginLeft: 4,
  },
  // Add to your existing styles
  historyHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    marginVertical: 8,
  },

  historyHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#18181B",
  },

  historySubText: {
    fontSize: 14,
    color: "#71717A",
    marginTop: 4,
  },

  emptySubText: {
    fontSize: 14,
    color: "#71717A",
    textAlign: "center",
    marginTop: 8,
  },
});
