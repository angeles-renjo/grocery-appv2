// app/(tabs)/analytics/[itemName].tsx
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
            dataPointText: `$${item.price?.toFixed(2)}`, // Add the price as text
          });
        }
      });

      return acc;
    }, []);
  }, [itemName, state.lists]);

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

            // Optional: Add gradient for area under the line
            // areaChart={true}
            // startFillColor={Colors.light.secondary}
            // endFillColor={Colors.light.secondary}
            // startOpacity={0.2}
            // endOpacity={0.0}
          />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};

export default PriceHistoryScreen;
