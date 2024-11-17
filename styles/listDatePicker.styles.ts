import { StyleSheet, Platform } from "react-native";

export const listDatePickerStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: Platform.select({
      ios: "#ffffff",
      android: "transparent",
    }),
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: Platform.select({
      ios: 20,
      android: 0,
    }),
  },

  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
  },

  datePickerButton: {
    fontSize: 16,
    color: "#007AFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  datePickerDoneButton: {
    fontWeight: "600",
  },

  datePickerAndroid: {
    width: "100%",
    backgroundColor: "transparent",
  },

  container: {
    width: "100%",
  },

  dateDisplay: {
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginVertical: 8,
  },

  dateText: {
    fontSize: 16,
    color: "#333333",
  },

  errorContainer: {
    borderColor: "#FF3B30",
    borderWidth: 1,
  },

  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

  disabledContainer: {
    opacity: 0.5,
  },

  touchArea: {
    minHeight: 44,
    justifyContent: "center",
  },
});
