// components/PurchaseFrequencyAnalytics.tsx
import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  ListRenderItem,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useTodoContext } from '../hooks/useTodoContext';
import { analyticsStyles as styles } from '@/styles/analytics.styles';
import { groceryNormalizer } from '@/utils/groceryNormalizer';
import { Colors } from '@/constants/Colors';

interface ItemFrequency {
  originalNames: string[];
  count: number;
  lastPurchased: Date;
  totalPrice: number;
  averagePrice: number;
  priceHistory: number[];
  displayName: string;
}

const FrequencyItem = memo(
  ({
    item,
    onPress,
  }: {
    item: ItemFrequency;
    onPress: (item: ItemFrequency) => void;
  }) => {
    const formatPrice = (price: number): string => {
      return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    return (
      <Pressable
        onPress={() => onPress(item)}
        style={({ pressed }) => [
          styles.itemContainer,
          pressed && { opacity: 0.7 },
        ]}
      >
        <ThemedText
          style={styles.itemName}
          lightColor='#1F2937'
          darkColor='#1F2937'
          type='subtitle'
        >
          {item.displayName}
        </ThemedText>

        {item.originalNames.length > 1 && (
          <View style={styles.variationsContainer}>
            {item.originalNames
              .filter((name) => name !== item.displayName)
              .map((name, idx) => (
                <ThemedView
                  key={idx}
                  style={styles.variationChip}
                  backgroundColor='secondary'
                >
                  <ThemedText
                    style={styles.variationChipText}
                    lightColor='#6B7280'
                    darkColor='#6B7280'
                  >
                    {name}
                  </ThemedText>
                </ThemedView>
              ))}
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.statContainer}>
          <ThemedText
            style={styles.statLabel}
            lightColor='#6B7280'
            darkColor='#6B7280'
          >
            Purchase Frequency
          </ThemedText>
          <ThemedText
            style={styles.statValue}
            lightColor='#1F2937'
            darkColor='#1F2937'
            type='defaultSemiBold'
          >
            {item.count} {item.count === 1 ? 'time' : 'times'}
          </ThemedText>
        </View>

        <View style={styles.priceContainer}>
          <ThemedText
            style={styles.priceLabel}
            lightColor='#6B7280'
            darkColor='#6B7280'
          >
            Average Price:
          </ThemedText>
          <ThemedText
            style={styles.priceValue}
            lightColor={Colors.light.tertiary}
            darkColor={Colors.light.tertiary}
            type='defaultSemiBold'
          >
            {formatPrice(item.averagePrice)}
          </ThemedText>
        </View>

        <View style={styles.dateContainer}>
          <ThemedText
            style={styles.dateLabel}
            lightColor='#6B7280'
            darkColor='#6B7280'
          >
            Last Purchased:
          </ThemedText>
          <ThemedText
            style={styles.dateValue}
            lightColor='#1F2937'
            darkColor='#1F2937'
          >
            {item.lastPurchased.toLocaleDateString()}
          </ThemedText>
        </View>
      </Pressable>
    );
  }
);

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
            displayName: existingItem.displayName,
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

  const handleItemPress = useCallback((item: ItemFrequency) => {
    router.push(`/analytics/${encodeURIComponent(item.displayName)}`);
  }, []);

  const renderItem: ListRenderItem<ItemFrequency> = useCallback(
    ({ item }) => <FrequencyItem item={item} onPress={handleItemPress} />,
    [handleItemPress]
  );

  const keyExtractor = useCallback(
    (item: ItemFrequency) => `${item.displayName}-${item.lastPurchased}`,
    []
  );

  const ListEmptyComponent = useCallback(
    () => (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText textColor='text' style={styles.emptyText}>
          No purchase history available yet
        </ThemedText>
        <ThemedText textColor='text' style={styles.emptyText}>
          Complete shopping lists to see analytics
        </ThemedText>
      </ThemedView>
    ),
    []
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.light.accent} />
      </ThemedView>
    );
  }

  return !frequencyData || frequencyData.length === 0 ? (
    <ListEmptyComponent />
  ) : (
    <FlatList
      data={frequencyData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContentContainer}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={5}
      initialNumToRender={10}
      scrollEnabled={true}
      nestedScrollEnabled={true}
      style={styles.container}
    />
  );
};

export default PurchaseFrequencyAnalytics;
