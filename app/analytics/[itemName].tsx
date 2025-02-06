// app/(tabs)/analytics/[itemName].tsx
import React, { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SimpleLineChart } from '@/components/SimpleLineChart';
import { useTodoContext } from '@/hooks/useTodoContext';
import { groceryNormalizer } from '@/utils/groceryNormalizer';
import { styles } from '@/styles/priceHistory.styles';
import { ChartDataPoint } from '@/utils/types';

const PriceHistoryScreen = () => {
  const { itemName } = useLocalSearchParams();
  const { state } = useTodoContext();

  const chartData = useMemo<ChartDataPoint[]>(() => {
    const decodedItemName = decodeURIComponent(itemName as string);

    // Get completed lists and sort by date
    const completedLists = state.lists
      .filter((list) => list.isCompleted && list.completedAt)
      .sort(
        (a, b) =>
          new Date(a.completedAt!).getTime() -
          new Date(b.completedAt!).getTime()
      );

    // Transform to chart points using normalizer
    return completedLists.reduce<ChartDataPoint[]>((acc, list) => {
      // Find all items that match using the normalizer
      const matchingItems = list.items.filter((item) =>
        groceryNormalizer.isSameItem(item.name, decodedItemName)
      );

      // Add price points for all matching items
      matchingItems.forEach((item) => {
        if (list.completedAt) {
          // TypeScript null check
          acc.push({
            value: item.price || 0,
            label: new Date(list.completedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
          });
        }
      });

      return acc;
    }, []);
  }, [itemName, state.lists]);

  const stats = useMemo(() => {
    const prices = chartData.map((d) => d.value);
    return {
      average: prices.length
        ? prices.reduce((sum, price) => sum + price, 0) / prices.length
        : 0,
      lowest: prices.length ? Math.min(...prices) : 0,
      highest: prices.length ? Math.max(...prices) : 0,
      current: prices.length ? prices[prices.length - 1] : 0,
    };
  }, [chartData]);

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (chartData.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.container} backgroundColor='background'>
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle} type='title'>
              Price History
            </ThemedText>
            <ThemedText style={styles.headerSubtitle} textColor='text'>
              {decodeURIComponent(itemName as string)}
            </ThemedText>
          </View>
          <View style={styles.emptyContainer}>
            <ThemedText textColor='text' style={styles.emptyText}>
              No price history available for this item
            </ThemedText>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container} backgroundColor='background'>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle} type='title'>
              Price History
            </ThemedText>
            <ThemedText style={styles.headerSubtitle} textColor='text'>
              {decodeURIComponent(itemName as string)}
            </ThemedText>
          </View>

          <View style={styles.chartContainer}>
            <SimpleLineChart data={chartData} />
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <ThemedText style={styles.statTitle}>Average Price</ThemedText>
              <ThemedText style={styles.statValue}>
                {formatPrice(stats.average)}
              </ThemedText>
            </View>
            <View style={styles.statBox}>
              <ThemedText style={styles.statTitle}>Lowest Price</ThemedText>
              <ThemedText style={styles.statValue}>
                {formatPrice(stats.lowest)}
              </ThemedText>
            </View>
            <View style={styles.statBox}>
              <ThemedText style={styles.statTitle}>Highest Price</ThemedText>
              <ThemedText style={styles.statValue}>
                {formatPrice(stats.highest)}
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
};

export default PriceHistoryScreen;
