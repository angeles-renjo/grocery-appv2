import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useTodoContext } from "../hooks/useTodoContext";
import { analyticsStyles as styles } from "@/styles/analytics.styles";

interface ItemFrequency {
  name: string;
  count: number;
  lastPurchased: Date;
}

export const PurchaseFrequencyAnalytics: React.FC = () => {
  const [frequencyData, setFrequencyData] = useState<ItemFrequency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useTodoContext();

  useEffect(() => {
    calculateFrequency();
  }, [state.lists]);

  const calculateFrequency = () => {
    const itemFrequencyMap = new Map<string, ItemFrequency>();

    state.lists.forEach((list) => {
      if (list.isCompleted) {
        list.items.forEach((item) => {
          const existingItem = itemFrequencyMap.get(item.name.toLowerCase());
          if (existingItem) {
            itemFrequencyMap.set(item.name.toLowerCase(), {
              name: item.name,
              count: existingItem.count + 1,
              lastPurchased: new Date(
                Math.max(
                  new Date(list.completedAt || Date.now()).getTime(),
                  new Date(existingItem.lastPurchased).getTime()
                )
              ),
            });
          } else {
            itemFrequencyMap.set(item.name.toLowerCase(), {
              name: item.name,
              count: 1,
              lastPurchased: new Date(list.completedAt || Date.now()),
            });
          }
        });
      }
    });

    const sortedFrequency = Array.from(itemFrequencyMap.values()).sort(
      (a, b) => b.count - a.count
    );

    setFrequencyData(sortedFrequency);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {frequencyData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No purchase history available yet
            </ThemedText>
            <ThemedText style={styles.emptyText}>
              Complete shopping lists to see analytics
            </ThemedText>
          </View>
        ) : (
          frequencyData.map((item, index) => (
            <ThemedView
              key={`${item.name}-${index}`}
              style={styles.itemContainer}
            >
              <ThemedText style={styles.itemName}>{item.name}</ThemedText>
              <ThemedText style={styles.itemStats}>
                Purchased {item.count} {item.count === 1 ? "time" : "times"}
              </ThemedText>
              <ThemedText style={styles.itemStats}>
                Last purchased: {item.lastPurchased.toLocaleDateString()}
              </ThemedText>
            </ThemedView>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default PurchaseFrequencyAnalytics;
