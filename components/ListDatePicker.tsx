import React, { useState } from "react";
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { listDatePickerStyles as styles } from "@/styles/listDatePicker.styles";

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
  // Keep track of the temporary date selection for Android
  const [tempDate, setTempDate] = useState(initialDate);

  // Reset temp date when the picker is opened with a new initial date
  React.useEffect(() => {
    setTempDate(initialDate);
  }, [initialDate]);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      // On Android, hide the picker immediately
      onClose();

      // Only update if the user didn't cancel
      if (event.type === "set" && selectedDate) {
        onConfirm(selectedDate);
      }
    } else {
      // On iOS, update the temporary date
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
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.datePickerHeader}>
                  <TouchableOpacity onPress={onClose}>
                    <Text style={styles.datePickerButton}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleIOSConfirm}>
                    <Text
                      style={[
                        styles.datePickerButton,
                        styles.datePickerDoneButton,
                      ]}
                    >
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ alignSelf: "center" }}>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    textColor="#000000"
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
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
    />
  ) : null;
};
