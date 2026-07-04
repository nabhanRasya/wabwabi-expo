import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimeCard } from "../../src/components/ui/AnimeCard";
import { EmptyState } from "../../src/components/ui/EmptyState";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { LoadingSpinner } from "../../src/components/ui/LoadingSpinner";
import { useSearch } from "../../src/hooks/useSearch";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  const { data = [], error, isFetching, refetch } = useSearch(debouncedQuery);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="px-4 pt-3">
        <Text className="text-[28px] font-black text-white">Cari</Text>
        <View className="mt-3.5 flex-row items-center rounded-lg border border-border bg-surface pl-3.5">
          <TextInput
            autoCapitalize="none"
            className="min-h-12 flex-1 text-[15px] text-text-primary"
            onChangeText={setQuery}
            placeholder="Judul anime, film, series..."
            placeholderTextColor="#64748b"
            returnKeyType="search"
            value={query}
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery("")} className="h-9 w-9 items-center justify-center active:opacity-70">
              <Text className="text-lg font-black text-text-secondary">x</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {error ? <ErrorState message={error.message} onRetry={() => refetch()} /> : null}
      {isFetching ? <LoadingSpinner /> : null}

      {debouncedQuery.trim().length < 2 ? (
        <EmptyState title="Mulai pencarian" message="Masukkan minimal dua karakter." />
      ) : (
        <FlatList
          columnWrapperClassName="gap-3"
          contentContainerClassName="px-4 pb-7"
          data={data}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            !isFetching ? <EmptyState title="Tidak ada hasil" message={debouncedQuery} /> : null
          }
          numColumns={3}
          renderItem={({ item }) => <AnimeCard anime={item} size="sm" />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
