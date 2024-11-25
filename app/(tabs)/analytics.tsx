import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PurchaseFrequencyAnalytics from "@/components/PurchaseFrequencyAnalytics";
import { ThemedText } from "@/components/ThemedText";
import { analyticsStyles as styles } from "@/styles/analytics.styles";

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Purchase Analytics</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Track your shopping patterns
          </ThemedText>
        </View>
        <View style={styles.analyticsContainer}>
          <PurchaseFrequencyAnalytics />
        </View>
      </View>
    </SafeAreaView>
  );
}
