import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useTodoContext } from "@/hooks/useTodoContext";
import { AnimatedList } from "@/components/AnimatedList";
import { historyStyles as styles } from "@/styles/history.styles";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function HistoryScreen() {
  const {
    state: { lists },
    deleteList,
  } = useTodoContext();
  const colorScheme = useColorScheme();

  // Filter for completed lists only
  const completedLists = lists.filter((list) => list.isCompleted);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            Colors[colorScheme === "dark" ? "dark" : "light"].background,
        },
      ]}
    >
      <ThemedView backgroundColor="background" style={styles.container}>
        {/* Header Section */}
        <ThemedView
          backgroundColor="background"
          style={[
            styles.historyHeader,
            {
              borderBottomColor:
                Colors[colorScheme === "dark" ? "dark" : "light"].secondary,
            },
          ]}
        >
          <ThemedText textColor="text" style={styles.historyHeaderText}>
            Completed Lists
          </ThemedText>
          {completedLists.length > 0 && (
            <ThemedText textColor="text" style={styles.historySubText}>
              {completedLists.length} list
              {completedLists.length !== 1 ? "s" : ""}
            </ThemedText>
          )}
        </ThemedView>

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
            <ThemedView
              backgroundColor="background"
              style={styles.emptyContainer}
            >
              <ThemedText textColor="text" style={styles.emptyText}>
                No completed lists yet
              </ThemedText>
              <ThemedText textColor="text" style={styles.emptySubText}>
                Lists will appear here when marked as complete
              </ThemedText>
            </ThemedView>
          )}
          itemLayoutAnimation={LinearTransition.springify()}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
