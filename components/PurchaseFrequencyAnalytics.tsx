import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useTodoContext } from "../hooks/useTodoContext";
import { analyticsStyles as styles } from "@/styles/analytics.styles";
import { groceryNormalizer } from "@/utils/groceryNormalizer";

interface ItemFrequency {
  originalNames: string[];
  count: number;
  lastPurchased: Date;
  totalPrice: number;
  averagePrice: number;
  priceHistory: number[];
  displayName: string;
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

    // Process only completed lists
    const completedLists = state.lists.filter((list) => list.isCompleted);

    completedLists.forEach((list) => {
      if (!list.items) return; // Skip if no items

      list.items.forEach((item) => {
        if (!item.name) return; // Skip if no name

        const normalizedResult = groceryNormalizer.normalize(item.name);
        const normalizedName = normalizedResult.normalized;
        const itemPrice = item.price || 0;
        const purchaseDate = list.completedAt
          ? new Date(list.completedAt)
          : new Date();

        const existingItem = itemFrequencyMap.get(normalizedName);

        if (existingItem) {
          // Update existing item
          const uniqueOriginalNames = new Set(existingItem.originalNames);
          uniqueOriginalNames.add(item.name);

          itemFrequencyMap.set(normalizedName, {
            originalNames: Array.from(uniqueOriginalNames),
            count: existingItem.count + 1,
            totalPrice: existingItem.totalPrice + itemPrice,
            averagePrice:
              (existingItem.totalPrice + itemPrice) / (existingItem.count + 1),
            priceHistory: [...existingItem.priceHistory, itemPrice],
            lastPurchased: new Date(
              Math.max(
                existingItem.lastPurchased.getTime(),
                purchaseDate.getTime()
              )
            ),
            displayName: existingItem.displayName, // Keep the existing display name
          });
        } else {
          // Create new item entry
          itemFrequencyMap.set(normalizedName, {
            originalNames: [item.name],
            count: 1,
            totalPrice: itemPrice,
            averagePrice: itemPrice,
            priceHistory: [itemPrice],
            lastPurchased: purchaseDate,
            displayName: item.name,
          });
        }
      });
    });

    // Convert to array and sort by frequency
    const sortedFrequency = Array.from(itemFrequencyMap.values())
      .sort((a, b) => {
        // First sort by count (descending)
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        // Then by last purchased date (most recent first)
        return b.lastPurchased.getTime() - a.lastPurchased.getTime();
      })
      .map((item) => ({
        ...item,
        // Update display name to most frequent variant
        displayName: getMostFrequentName(item.originalNames),
      }));

    setFrequencyData(sortedFrequency);
    setIsLoading(false);
  };

  const getMostFrequentName = (names: string[]): string => {
    const nameCounts = names.reduce((acc, name) => {
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(nameCounts).sort((a, b) => b[1] - a[1])[0][0];
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
        {!frequencyData || frequencyData.length === 0 ? (
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
              key={`${item.displayName}-${index}`}
              style={styles.itemContainer}
            >
              <ThemedText style={styles.itemName}>
                {item.displayName}
              </ThemedText>

              {item.originalNames.length > 1 && (
                <View style={styles.variationsContainer}>
                  {item.originalNames
                    .filter((name) => name !== item.displayName)
                    .map((name, idx) => (
                      <View key={idx} style={styles.variationChip}>
                        <ThemedText style={styles.variationChipText}>
                          {name}
                        </ThemedText>
                      </View>
                    ))}
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.statContainer}>
                <ThemedText style={styles.statLabel}>
                  Purchase Frequency
                </ThemedText>
                <ThemedText style={styles.statValue}>
                  {item.count} {item.count === 1 ? "time" : "times"}
                </ThemedText>
              </View>

              <View style={styles.priceContainer}>
                <ThemedText style={styles.priceLabel}>
                  Average Price:
                </ThemedText>
                <ThemedText style={styles.priceValue}>
                  {formatPrice(item.averagePrice)}
                </ThemedText>
              </View>

              <View style={styles.dateContainer}>
                <ThemedText style={styles.dateLabel}>
                  Last Purchased:
                </ThemedText>
                <ThemedText style={styles.dateValue}>
                  {item.lastPurchased.toLocaleDateString()}
                </ThemedText>
              </View>
            </ThemedView>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default PurchaseFrequencyAnalytics;
