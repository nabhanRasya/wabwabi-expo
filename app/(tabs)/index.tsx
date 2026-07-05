import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { newAnimeService } from "../../src/api/services/newAnimeService";
import { AnimeCard } from "../../src/components/ui/AnimeCard";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { HeroBanner } from "../../src/components/ui/HeroBanner";
import { LoadingSpinner } from "../../src/components/ui/LoadingSpinner";
import { SectionHeader } from "../../src/components/ui/SectionHeader";
import { getNewHomeSections } from "../../src/utils/helpers";

export default function HomeScreen() {
  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryFn: newAnimeService.getHome,
    queryKey: ["newApi", "home"],
    select: getNewHomeSections,
  });

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }

  const sections = data ?? [];
  const hero =
    sections.find((section) => section.key === "ongoing")?.items[0] ??
    sections[0]?.items[0];

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="pb-7"
        refreshControl={
          <RefreshControl
            onRefresh={refetch}
            refreshing={isRefetching}
            tintColor="#e94560"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-3 px-4 pt-3">
          <Image source={require("@/assets/images/logo-glow.png")} className="h-[46px] w-[46px]" />
          <View className="flex-1">
            <Text className="text-2xl font-black text-white">WABIWABI</Text>
            <Text className="mt-0.5 text-[13px] font-semibold text-text-secondary">Anime, film, dan series terbaru</Text>
          </View>
        </View>

        {hero ? <HeroBanner anime={hero} /> : null}

        {sections.map((section) => (
          <View key={section.key} className="mt-6">
            <SectionHeader href={section.href} title={section.title} />
            <ScrollView
              contentContainerClassName="pl-4 pr-1"
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {section.items.map((anime) => (
                <AnimeCard anime={anime} key={`${section.key}-${anime.id}`} />
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
