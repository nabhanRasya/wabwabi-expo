import { useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
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
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="px-4 pt-3">
        <Text className="text-[28px] font-black text-white">Jadwal Rilis</Text>
      </View>
      <ScrollView
        contentContainerClassName="px-4 py-3"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {DAYS.map((day) => {
          const selected = day.key === activeDay;
          return (
            <Pressable
              key={day.key}
              onPress={() => setActiveDay(day.key)}
              className={`mr-2 h-10 w-[54px] items-center justify-center rounded-lg border ${
                selected ? "border-primary bg-primary" : "border-border bg-surface"
              }`}
            >
              <Text className={`text-xs font-black ${selected ? "text-white" : "text-text-secondary"}`}>{day.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {error ? <ErrorState message={error.message} onRetry={() => refetch()} /> : null}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          columnWrapperClassName="gap-3"
          contentContainerClassName="px-4 pb-7"
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
