// styles/analytics.styles.ts
import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const analyticsStyles = StyleSheet.create({
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
    marginBottom: 4,
  },
  headerSubtitle: {
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
  // Card will always be white regardless of theme
  itemContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    margin: 14,
    backgroundColor: "#FFFFFF", // Always white
    elevation: 2,
    shadowColor: "#000",
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.light.secondary,
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
    backgroundColor: Colors.light.secondary,
    marginVertical: 8,
  },
  // Text styles - using dark text colors since card is always white
  emptyText: {
    textAlign: "center",
    marginBottom: 8,
  },
  itemName: {
    marginBottom: 8,
    color: "#1F2937", // Always dark text since background is white
  },
  variationChipText: {
    fontSize: 12,
    color: "#6B7280", // Always dark text
  },
  statLabel: {
    marginBottom: 2,
    color: "#6B7280", // Always dark text
  },
  statValue: {
    marginBottom: 8,
    color: "#1F2937", // Always dark text
  },
  priceLabel: {
    marginRight: 8,
    color: "#6B7280", // Always dark text
  },
  priceValue: {
    color: Colors.light.tertiary,
  },
  dateLabel: {
    marginRight: 8,
    color: "#6B7280", // Always dark text
  },
  dateValue: {
    color: "#1F2937", // Always dark text
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  analyticsContainer: {
    flex: 1,
  },
});
