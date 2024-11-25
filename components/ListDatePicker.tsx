import React, { useState } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { listDatePickerStyles as styles } from "@/styles/listDatePicker.styles";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

interface ListDatePickerProps {
  visible: boolean;
  date: Date;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

export const ListDatePicker: React.FC<ListDatePickerProps> = ({
  visible,
  date: initialDate,
  onClose,
  onConfirm,
}) => {
  const [tempDate, setTempDate] = useState(initialDate);

  // Get theme colors
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );
  const buttonColor = useThemeColor(
    {
      light: Colors.light.buttonBackground,
      dark: Colors.dark.buttonBackground,
    },
    "buttonBackground"
  );
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );

  // Reset temp date when the picker is opened with a new initial date
  React.useEffect(() => {
    setTempDate(initialDate);
  }, [initialDate]);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      onClose();
      if (event.type === "set" && selectedDate) {
        onConfirm(selectedDate);
      }
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleIOSConfirm = () => {
    onConfirm(tempDate);
    onClose();
  };

  if (Platform.OS === "ios") {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <ThemedView style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <ThemedView style={styles.modalContent}>
                <ThemedView style={styles.datePickerHeader}>
                  <TouchableOpacity onPress={onClose}>
                    <ThemedText
                      style={[styles.datePickerButton]}
                      textColor="buttonBackground"
                    >
                      Cancel
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleIOSConfirm}>
                    <ThemedText
                      style={[
                        styles.datePickerButton,
                        styles.datePickerDoneButton,
                      ]}
                      textColor="buttonBackground"
                    >
                      Done
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>
                <ThemedView style={{ alignSelf: "center" }}>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    textColor={textColor}
                    // Note: iOS specific styling
                    accentColor={buttonColor}
                  />
                </ThemedView>
              </ThemedView>
            </TouchableWithoutFeedback>
          </ThemedView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  // Android implementation
  return visible ? (
    <DateTimePicker
      value={initialDate}
      mode="date"
      display="default"
      onChange={handleDateChange}
      // Note: Android specific styling
      themeVariant={
        backgroundColor === Colors.light.background ? "light" : "dark"
      }
    />
  ) : null;
};
