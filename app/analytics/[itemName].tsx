import React, { useMemo } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-gifted-charts';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTodoContext } from '@/hooks/useTodoContext';
import { groceryNormalizer } from '@/utils/groceryNormalizer';
import { styles } from '@/styles/priceHistory.styles';
import { Colors } from '@/constants/Colors';

const PriceHistoryScreen = () => {
  const { itemName } = useLocalSearchParams();
  const { state } = useTodoContext();
  const { width: screenWidth } = Dimensions.get('window');

  const chartData = useMemo(() => {
    const decodedItemName = decodeURIComponent(itemName as string);

    const completedLists = state.lists
      .filter((list) => list.isCompleted && list.completedAt)
      .sort(
        (a, b) =>
          new Date(a.completedAt!).getTime() -
          new Date(b.completedAt!).getTime()
      );

    return completedLists.reduce<
      Array<{ value: number; label: string; dataPointText: string }>
    >((acc, list) => {
      const matchingItems = list.items.filter((item) =>
        groceryNormalizer.isSameItem(item.name, decodedItemName)
      );

      matchingItems.forEach((item) => {
        if (list.completedAt) {
          acc.push({
            value: item.price || 0,
            label: new Date(list.completedAt).toLocaleDateString(),
            dataPointText: `$${item.price?.toFixed(2)}`,
          });
        }
      });

      return acc;
    }, []);
  }, [itemName, state.lists]);

  // Add stats calculation from the old version
  const stats = useMemo(() => {
    const prices = chartData.map((d) => d.value);
    return {
      average: prices.length
        ? prices.reduce((sum, price) => sum + price, 0) / prices.length
        : 0,
      lowest: prices.length ? Math.min(...prices) : 0,
      highest: prices.length ? Math.max(...prices) : 0,
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
            <LineChart
              data={chartData}
              height={250}
              overflowTop={30}
              xAxisLabelsHeight={0}
              scrollToEnd={true}
              scrollAnimation={true}
              dashWidth={0}
              focusEnabled={true}
              showDataPointLabelOnFocus={true}
              showTextOnFocus={true}
              dataPointsColor1={Colors.light.tertiary}
              color={Colors.light.secondary}
              focusedDataPointColor={Colors.light.secondary}
              textColor={Colors.light.text}
              textFontSize={14}
              focusedDataPointWidth={8}
              focusedDataPointHeight={8}
              hideDataPoints={false}
              dataPointsHeight={6}
              dataPointsWidth={6}
              textShiftY={-20}
              textShiftX={0}
              showValuesAsDataPointsText={true}
            />
          </View>

          {/* Add stats container from the old version */}
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
