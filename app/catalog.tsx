import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimeCard } from "../src/components/ui/AnimeCard";
import { EmptyState } from "../src/components/ui/EmptyState";
import { ErrorState } from "../src/components/ui/ErrorState";
import { LoadingSpinner } from "../src/components/ui/LoadingSpinner";
import { usePaginationAnime } from "../src/hooks/usePaginationAnime";
import { normalizeParam } from "../src/utils/helpers";

const TYPES = [
  { label: "Semua", value: "" },
  { label: "Anime", value: "anime" },
  { label: "Film", value: "film" },
  { label: "Series", value: "series" },
];

export default function CatalogScreen() {
  const params = useLocalSearchParams();
  const initialTitle = normalizeParam(params.title);
  const [title, setTitle] = useState(initialTitle);

  const catalogParams = useMemo(
    () => ({
      order: normalizeParam(params.order) || "update",
      status: normalizeParam(params.status) || undefined,
      title: initialTitle || undefined,
      type: normalizeParam(params.type) || undefined,
    }),
    [initialTitle, params.order, params.status, params.type],
  );

  const {
    data = [],
    error,
    isLoading,
    refetch,
  } = usePaginationAnime(catalogParams);

  const setType = (type: string) => {
    router.setParams({ type: type || undefined });
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-4 pt-3">
        <Pressable
          onPress={() =>
            router.canGoBack() ? router.back() : router.push("/")
          }
          className="h-10 w-10 items-center justify-center rounded-lg bg-surface active:opacity-70"
        >
          <Text className="text-xl font-black text-white">{"<"}</Text>
        </Pressable>
        <Text className="text-[28px] font-black text-white">Catalog</Text>
      </View>

      <View className="mx-4 mt-3.5 rounded-lg border border-border bg-surface px-3.5">
        <TextInput
          className="min-h-12 flex-1 text-[15px] text-text-primary"
          onChangeText={setTitle}
          onSubmitEditing={() =>
            router.setParams({ title: title || undefined })
          }
          placeholder="Filter judul..."
          placeholderTextColor="#64748b"
          returnKeyType="search"
          value={title}
        />
      </View>

      <View className="flex-row flex-wrap gap-2 px-4 py-3">
        {TYPES.map((type) => {
          const active = (catalogParams.type ?? "") === type.value;
          return (
            <Pressable
              key={type.label}
              onPress={() => setType(type.value)}
              className={`rounded-full border px-3.5 py-2.5 ${
                active ? "border-primary bg-primary" : "border-border bg-surface"
              }`}
            >
              <Text className={`text-xs font-extrabold ${active ? "text-white" : "text-text-secondary"}`}>
                {type.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error ? (
        <ErrorState message={error.message} onRetry={() => refetch()} />
      ) : null}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          columnWrapperClassName="gap-3"
          contentContainerClassName="px-4 pb-7"
          data={data}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<EmptyState title="Catalog kosong" />}
          numColumns={3}
          renderItem={({ item }) => <AnimeCard anime={item} size="sm" />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
