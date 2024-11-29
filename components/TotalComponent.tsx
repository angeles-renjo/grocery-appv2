import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { TodoList } from "@/utils/types";

interface TotalComponentProps {
  list?: TodoList;
  grandTotal: number;
  lists: TodoList[];
}

export function TotalComponent({
  list,
  grandTotal,
  lists,
}: TotalComponentProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const totals = useMemo(() => {
    if (list) {
      const completedTotal = list.total;
      const plannedTotal = list.items.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      );

      return {
        completedTotal,
        plannedTotal,
        completionPercentage:
          plannedTotal > 0 ? (completedTotal / plannedTotal) * 100 : 0,
      };
    } else {
      const completedTotal = grandTotal;
      const plannedTotal = lists
        .flatMap((list) => list.items)
        .reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
          0
        );

      return {
        completedTotal,
        plannedTotal,
        completionPercentage:
          plannedTotal > 0 ? (completedTotal / plannedTotal) * 100 : 0,
      };
    }
  }, [list, grandTotal, lists]);

  return (
    <ThemedView backgroundColor="background" style={styles.container}>
      <View style={styles.totalHeader}>
        <ThemedText type="subtitle" textColor="text">
          {list ? list.title : "Total Value"}
        </ThemedText>
        <TouchableOpacity
          onPress={() => setShowTooltip(true)}
          style={styles.infoButton}
        >
          <Feather name="info" size={20} color={Colors.light.accent} />
        </TouchableOpacity>
      </View>

      <View style={styles.totalGrid}>
        <View style={styles.totalColumn}>
          <ThemedText type="default" textColor="text" style={styles.label}>
            Completed
          </ThemedText>
          <ThemedText type="title" textColor="text" style={styles.amount}>
            ${totals.completedTotal.toFixed(2)}
          </ThemedText>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalColumn}>
          <ThemedText type="default" textColor="text" style={styles.label}>
            Planned
          </ThemedText>
          <ThemedText type="title" textColor="text" style={styles.amount}>
            ${totals.plannedTotal.toFixed(2)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(totals.completionPercentage, 100)}%` },
            ]}
          />
        </View>
        <ThemedText type="default" textColor="text" style={styles.progressText}>
          {totals.completionPercentage.toFixed(1)}% Complete
        </ThemedText>
      </View>

      {/* Tooltip Modal */}
      <Modal
        transparent
        visible={showTooltip}
        animationType="fade"
        onRequestClose={() => setShowTooltip(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowTooltip(false)}
        >
          <ThemedView
            backgroundColor="background"
            style={styles.tooltipContainer}
          >
            <View style={styles.tooltipHeader}>
              <ThemedText type="subtitle" textColor="text">
                Understanding Totals
              </ThemedText>
              <TouchableOpacity
                onPress={() => setShowTooltip(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color={Colors.light.accent} />
              </TouchableOpacity>
            </View>

            <View style={styles.tooltipContent}>
              <ThemedText
                type="default"
                textColor="text"
                style={styles.tooltipText}
              >
                • Completed Total: Sum of all checked items
              </ThemedText>
              <ThemedText
                type="default"
                textColor="text"
                style={styles.tooltipText}
              >
                • Planned Total: Sum of all items (checked and unchecked)
              </ThemedText>
              <ThemedText
                type="default"
                textColor="text"
                style={styles.tooltipText}
              >
                • Progress bar shows the percentage of planned items that have
                been completed
              </ThemedText>
              <ThemedText
                type="default"
                textColor="text"
                style={[styles.tooltipText, styles.tooltipNote]}
              >
                Note: List completion status doesn't affect these calculations
              </ThemedText>
            </View>
          </ThemedView>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  totalHeader: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoButton: {
    padding: 8,
  },
  totalGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  totalColumn: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    backgroundColor: Colors.light.secondary,
    marginHorizontal: 16,
  },
  label: {
    marginBottom: 4,
    opacity: 0.7,
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBackground: {
    height: 8,
    backgroundColor: Colors.light.secondary + "40",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.light.accent,
    borderRadius: 4,
  },
  progressText: {
    textAlign: "center",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  tooltipContainer: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  tooltipContent: {
    gap: 12,
  },
  tooltipText: {
    lineHeight: 22,
  },
  tooltipNote: {
    marginTop: 8,
    opacity: 0.7,
    fontStyle: "italic",
  },
});
