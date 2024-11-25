import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const historyStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  historyHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  historyHeaderText: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  historySubText: {
    fontSize: 14,
    opacity: 0.7,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
  },
});
