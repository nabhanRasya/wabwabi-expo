import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Cari</Text>
        <View style={styles.searchBox}>
          <TextInput
            autoCapitalize="none"
            onChangeText={setQuery}
            placeholder="Judul anime, film, series..."
            placeholderTextColor="#64748b"
            returnKeyType="search"
            style={styles.input}
            value={query}
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery("")} style={styles.clearButton}>
              <Text style={styles.clearText}>x</Text>
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
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.grid}
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

const styles = StyleSheet.create({
  clearButton: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  clearText: {
    color: "#94a3b8",
    fontSize: 18,
    fontWeight: "900",
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
  input: {
    color: "#e2e8f0",
    flex: 1,
    fontSize: 15,
    minHeight: 48,
  },
  safeArea: {
    backgroundColor: "#0f0f0f",
    flex: 1,
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: "#1e1e2e",
    borderColor: "#2d2d3d",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: 14,
    paddingLeft: 14,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
  },
});
