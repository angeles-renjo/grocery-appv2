// homeScreen.styles.ts
import { StyleSheet, Platform } from "react-native";
import { Colors } from "@/constants/Colors";

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Total Section
  totalSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  totalLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: "600",
  },
  // Input Section
  inputSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.secondary,
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
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.light.secondary,
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
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  dateButtonText: {
    fontSize: 13,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    color: Colors.light.background,
  },
  // Lists Section
  listsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  listsHeaderText: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  listContainer: {
    flex: 1,
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
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  // Toggle Button
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.light.secondary,
  },
  toggleButtonText: {
    fontSize: 14,
    marginRight: 4,
  },
  toggleIcon: {
    marginLeft: 4,
  },

  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    opacity: 0.7, // This gives a subtle fade to the empty state text
  },
});
