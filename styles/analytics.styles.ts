import { StyleSheet } from "react-native";

export const analyticsStyles = StyleSheet.create({
  // View/Container styles
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 32,
  },
  itemContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    margin: 14,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  variationsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    marginTop: -4,
  },
  variationChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statContainer: {
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  sortButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    padding: 8,
  },
  sortButton: {
    padding: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  sortButtonActive: {
    backgroundColor: "#e0e0e0",
  },

  // Text styles
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1F2937",
  },
  variationChipText: {
    fontSize: 12,
    color: "#6B7280",
  },
  itemStats: {
    fontSize: 14,
    marginBottom: 4,
    color: "#4B5563",
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginRight: 8,
  },
  priceValue: {
    fontSize: 14,
    color: "#047857",
    fontWeight: "500",
  },
  dateLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginRight: 8,
  },
  dateValue: {
    fontSize: 14,
    color: "#1F2937",
  },
  sortButtonText: {
    fontSize: 14,
    color: "#4B5563",
  },
  sortButtonActiveText: {
    color: "#1F2937",
    fontWeight: "500",
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Add some bottom padding for better scrolling
  },
  analyticsContainer: {
    flex: 1, // This ensures the FlatList can take remaining space
  },
});
