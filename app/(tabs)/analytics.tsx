// app/(tabs)/analytics.tsx
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PurchaseFrequencyAnalytics from "@/components/PurchaseFrequencyAnalytics";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { analyticsStyles as styles } from "@/styles/analytics.styles";

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container} backgroundColor="background">
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle} type="title">
            Purchase Analytics
          </ThemedText>
          <ThemedText style={styles.headerSubtitle} textColor="text">
            Track your shopping patterns
          </ThemedText>
        </View>
        <View style={styles.analyticsContainer}>
          <PurchaseFrequencyAnalytics />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
