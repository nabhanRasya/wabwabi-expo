import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { animeService } from "../../src/api/services/animeServices";
import { AnimeCard } from "../../src/components/ui/AnimeCard";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { HeroBanner } from "../../src/components/ui/HeroBanner";
import { LoadingSpinner } from "../../src/components/ui/LoadingSpinner";
import { SectionHeader } from "../../src/components/ui/SectionHeader";
import { getHomeSections } from "../../src/utils/helpers";

export default function HomeScreen() {
  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryFn: animeService.getHome,
    queryKey: ["home"],
    select: getHomeSections,
  });

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }

  const sections = data ?? [];
  const hero = sections.find((section) => section.key === "latest_anime")?.items[0] ?? sections[0]?.items[0];

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            onRefresh={refetch}
            refreshing={isRefetching}
            tintColor="#e94560"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image source={require("@/assets/images/logo-glow.png")} style={styles.logo} />
          <View style={styles.headerCopy}>
            <Text style={styles.brand}>WABIWABI</Text>
            <Text style={styles.subtitle}>Anime, film, dan series terbaru</Text>
          </View>
        </View>

        {hero ? <HeroBanner anime={hero} /> : null}

        {sections.map((section) => (
          <View key={section.key} style={styles.section}>
            <SectionHeader href={section.href} title={section.title} />
            <ScrollView
              contentContainerStyle={styles.rail}
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

const styles = StyleSheet.create({
  brand: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0,
  },
  content: {
    paddingBottom: 28,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerCopy: {
    flex: 1,
  },
  logo: {
    height: 46,
    width: 46,
  },
  rail: {
    paddingLeft: 16,
    paddingRight: 4,
  },
  safeArea: {
    backgroundColor: "#0f0f0f",
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
});
