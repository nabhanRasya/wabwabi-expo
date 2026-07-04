import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
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
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Pressable
          onPress={() =>
            router.canGoBack() ? router.back() : router.push("/")
          }
          className="h-10 w-10 items-center justify-center rounded-lg bg-surface active:opacity-70"
        >
          <Text className="text-xl font-black text-white">{"<"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-xs font-extrabold uppercase text-text-secondary">Genre</Text>
          <Text numberOfLines={1} className="capitalize text-[25px] font-black text-white">
            {title}
          </Text>
        </View>
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
          ListEmptyComponent={<EmptyState title="Genre kosong" />}
          numColumns={3}
          renderItem={({ item }) => <AnimeCard anime={item} size="sm" />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
