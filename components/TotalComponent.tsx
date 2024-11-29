import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
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
  const totals = useMemo(() => {
    if (list) {
      // Single list calculations
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
      // Overall calculations across all lists
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  totalHeader: {
    marginBottom: 16,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBackground: {
    height: 8,
    backgroundColor: Colors.light.secondary + "40", // Adding transparency
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
});
