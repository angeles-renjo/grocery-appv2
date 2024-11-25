import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  // Remove deprecated Layout import
  LinearTransition, // Use LinearTransition instead
} from "react-native-reanimated";
import { useTodoContext } from "@/hooks/useTodoContext";
import { AnimatedList } from "@/components/AnimatedList";
import { homeScreenStyles as styles } from "@/styles/homeScreen.styles";

export default function HistoryScreen() {
  const {
    state: { lists, loading },
    deleteList,
  } = useTodoContext();

  // Filter for completed lists only
  const completedLists = lists.filter((list) => list.isCompleted);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.historyHeader}>
          <Text style={styles.historyHeaderText}>Completed Lists</Text>
          {completedLists.length > 0 && (
            <Text style={styles.historySubText}>
              {completedLists.length} list
              {completedLists.length !== 1 ? "s" : ""}
            </Text>
          )}
        </View>

        {/* Lists Section */}
        <Animated.FlatList
          data={completedLists}
          renderItem={({ item }) => (
            <AnimatedList list={item} onDelete={deleteList} />
          )}
          keyExtractor={(list) => list.listId.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          style={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No completed lists yet</Text>
              <Text style={styles.emptySubText}>
                Lists will appear here when marked as complete
              </Text>
            </View>
          )}
          // Replace deprecated Layout.springify() with LinearTransition
          itemLayoutAnimation={LinearTransition.springify()}
        />
      </View>
    </SafeAreaView>
  );
}
