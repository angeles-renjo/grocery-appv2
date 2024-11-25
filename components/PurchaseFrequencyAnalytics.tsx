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
  totalPrice: number;
  averagePrice: number;
  priceHistory: number[];
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
          const itemKey = item.name.toLowerCase();
          const existingItem = itemFrequencyMap.get(itemKey);
          const itemPrice = item.price || 0;

          if (existingItem) {
            const newPriceHistory = [...existingItem.priceHistory, itemPrice];
            const newTotalPrice = existingItem.totalPrice + itemPrice;
            const newCount = existingItem.count + 1;

            itemFrequencyMap.set(itemKey, {
              name: item.name,
              count: newCount,
              totalPrice: newTotalPrice,
              averagePrice: newTotalPrice / newCount,
              priceHistory: newPriceHistory,
              lastPurchased: new Date(
                Math.max(
                  new Date(list.completedAt || Date.now()).getTime(),
                  new Date(existingItem.lastPurchased).getTime()
                )
              ),
            });
          } else {
            itemFrequencyMap.set(itemKey, {
              name: item.name,
              count: 1,
              totalPrice: itemPrice,
              averagePrice: itemPrice,
              priceHistory: [itemPrice],
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

  const formatPrice = (price: number): string => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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
                Average price: {formatPrice(item.averagePrice)}
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
