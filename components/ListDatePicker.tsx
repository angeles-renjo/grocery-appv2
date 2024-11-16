// components/ListDatePicker.tsx
import React from "react";
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
import { todoListStyles as styles } from "@/styles/todoList.styles";

interface ListDatePickerProps {
  visible: boolean;
  date: Date;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

export const ListDatePicker: React.FC<ListDatePickerProps> = ({
  visible,
  date,
  onClose,
  onConfirm,
}) => {
  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (event.type === "set" && selectedDate) {
      onConfirm(selectedDate);
    } else {
      onClose();
    }
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
                  <TouchableOpacity onPress={() => onConfirm(date)}>
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
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  style={styles.datePickerIOS}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return visible ? (
    <DateTimePicker
      value={date}
      mode="date"
      display="default"
      onChange={handleDateChange}
    />
  ) : null;
};
