import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimeCard } from "../../src/components/ui/AnimeCard";
import { EmptyState } from "../../src/components/ui/EmptyState";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { LoadingSpinner } from "../../src/components/ui/LoadingSpinner";
import { useGenre } from "../../src/hooks/useGenre";
import { normalizeParam } from "../../src/utils/helpers";

export default function GenreRoute() {
  const params = useLocalSearchParams<{ slug?: string | string[] }>();
  const slug = normalizeParam(params.slug);
  const { data = [], error, isLoading, refetch } = useGenre(slug);
  const title = slug.replace(/-/g, " ");

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{"<"}</Text>
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.kicker}>Genre</Text>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        </View>
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
          ListEmptyComponent={<EmptyState title="Genre kosong" />}
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
    paddingVertical: 12,
  },
  headerCopy: {
    flex: 1,
  },
  kicker: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  safeArea: {
    backgroundColor: "#0f0f0f",
    flex: 1,
  },
  title: {
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "900",
    textTransform: "capitalize",
  },
});
