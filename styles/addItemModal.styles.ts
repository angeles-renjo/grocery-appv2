import { StyleSheet, Dimensions, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 20 : 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#F5F5F5",
    color: "#333333",
  },
  inputError: {
    borderColor: "#FF4444",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 14,
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666666",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#E5E5E5",
    opacity: 0.7,
  },
  disabledButtonText: {
    color: "#A1A1AA",
  },
  // New styles for suggestion UI
  suggestionContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F0F9FF", // Light blue background
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BAE6FD", // Light blue border
  },
  suggestionText: {
    fontSize: 14,
    color: "#0369A1", // Darker blue text
    marginBottom: 8,
  },
  suggestionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  suggestionButton: {
    flex: 1,
    backgroundColor: "#0EA5E9", // Blue button
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: "center",
  },
  suggestionButtonNo: {
    backgroundColor: "#F1F5F9", // Light gray button for "No"
  },
  suggestionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  suggestionButtonTextNo: {
    color: "#64748B", // Darker text for "No" button
  },
});
