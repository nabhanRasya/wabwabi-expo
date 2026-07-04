import { useLocalSearchParams, router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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

  const { data = [], error, isLoading, refetch } = usePaginationAnime(catalogParams);

  const setType = (type: string) => {
    router.setParams({ type: type || undefined });
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{"<"}</Text>
        </Pressable>
        <Text style={styles.title}>Catalog</Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          onChangeText={setTitle}
          onSubmitEditing={() => router.setParams({ title: title || undefined })}
          placeholder="Filter judul..."
          placeholderTextColor="#64748b"
          returnKeyType="search"
          style={styles.input}
          value={title}
        />
      </View>

      <View style={styles.filterRow}>
        {TYPES.map((type) => {
          const active = (catalogParams.type ?? "") === type.value;
          return (
            <Pressable
              key={type.label}
              onPress={() => setType(type.value)}
              style={[styles.filterButton, active && styles.filterButtonActive]}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {type.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error ? <ErrorState message={error.message} onRetry={() => refetch()} /> : null}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.grid}
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

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    backgroundColor: "#1e1e2e",
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  backText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
  },
  filterButton: {
    backgroundColor: "#1e1e2e",
    borderColor: "#2d2d3d",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  filterButtonActive: {
    backgroundColor: "#e94560",
    borderColor: "#e94560",
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "800",
  },
  filterTextActive: {
    color: "#ffffff",
  },
  grid: {
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  gridRow: {
    gap: 12,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
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
    backgroundColor: "#1e1e2e",
    borderColor: "#2d2d3d",
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
  },
});
