import { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimeCard } from "../../src/components/ui/AnimeCard";
import { EmptyState } from "../../src/components/ui/EmptyState";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { LoadingSpinner } from "../../src/components/ui/LoadingSpinner";
import { useSchedule } from "../../src/hooks/useSchedule";

const DAYS = [
  { key: "senin", label: "Sen" },
  { key: "selasa", label: "Sel" },
  { key: "rabu", label: "Rab" },
  { key: "kamis", label: "Kam" },
  { key: "jumat", label: "Jum" },
  { key: "sabtu", label: "Sab" },
  { key: "minggu", label: "Min" },
  { key: "all", label: "All" },
];

const JS_DAY_TO_API: Record<number, string> = {
  0: "minggu",
  1: "senin",
  2: "selasa",
  3: "rabu",
  4: "kamis",
  5: "jumat",
  6: "sabtu",
};

export default function ScheduleScreen() {
  const [activeDay, setActiveDay] = useState(JS_DAY_TO_API[new Date().getDay()]);
  const { data = [], error, isLoading, refetch } = useSchedule(activeDay);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Jadwal Rilis</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.days}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {DAYS.map((day) => {
          const selected = day.key === activeDay;
          return (
            <Pressable
              key={day.key}
              onPress={() => setActiveDay(day.key)}
              style={[styles.dayButton, selected && styles.dayButtonActive]}
            >
              <Text style={[styles.dayText, selected && styles.dayTextActive]}>{day.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {error ? <ErrorState message={error.message} onRetry={() => refetch()} /> : null}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.grid}
          data={data}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<EmptyState title="Jadwal kosong" />}
          numColumns={3}
          renderItem={({ item }) => <AnimeCard anime={item} size="sm" />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dayButton: {
    alignItems: "center",
    backgroundColor: "#1e1e2e",
    borderColor: "#2d2d3d",
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    marginRight: 8,
    width: 54,
  },
  dayButtonActive: {
    backgroundColor: "#e94560",
    borderColor: "#e94560",
  },
  dayText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "900",
  },
  dayTextActive: {
    color: "#ffffff",
  },
  days: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  grid: {
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  gridRow: {
    gap: 12,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  safeArea: {
    backgroundColor: "#0f0f0f",
    flex: 1,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
  },
});
