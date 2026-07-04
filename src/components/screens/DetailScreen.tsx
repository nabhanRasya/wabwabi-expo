import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAnimeDetail } from "../../hooks/useAnimeDetail";
import type { ContentType, DownloadLink, StreamServer } from "../../types/anime";
import { normalizeParam } from "../../utils/helpers";
import { AnimeCard } from "../ui/AnimeCard";
import { EmptyState } from "../ui/EmptyState";
import { EpisodeCard } from "../ui/EpisodeCard";
import { ErrorState } from "../ui/ErrorState";
import { GenreBadge } from "../ui/GenreBadge";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { SectionHeader } from "../ui/SectionHeader";

interface DetailScreenProps {
  type: ContentType;
}

export function DetailScreen({ type }: DetailScreenProps) {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = normalizeParam(params.id);
  const { data, error, isError, isLoading, refetch } = useAnimeDetail(id, type);
  const detail = data;

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorState
          message={error instanceof Error ? error.message : "Cek koneksi internet lalu coba lagi."}
          onRetry={() => refetch()}
        />
      </SafeAreaView>
    );
  }

  if (!detail) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <EmptyState title="Detail tidak ditemukan" />
      </SafeAreaView>
    );
  }

  const firstEpisode = detail.episodes[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          {detail.anime.thumbnail ? (
            <Image source={{ uri: detail.anime.thumbnail }} style={styles.heroImage} contentFit="cover" />
          ) : (
            <View style={[styles.heroImage, styles.heroFallback]} />
          )}
          <View style={styles.heroScrim} />
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.push("/"))} style={styles.backButton}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{detail.anime.title}</Text>

          <View style={styles.metaRow}>
            {!!detail.anime.score && detail.anime.score !== "-" && <InfoPill label={`Rating ${detail.anime.score}`} />}
            {!!detail.anime.season && detail.anime.season !== "-" && <InfoPill label={detail.anime.season} />}
            {!!detail.anime.duration && detail.anime.duration !== "-" && <InfoPill label={detail.anime.duration} />}
          </View>

          {detail.anime.genres && detail.anime.genres.length > 0 && (
            <View style={styles.genreWrap}>
              {detail.anime.genres.map((genre) => (
                <GenreBadge key={genre.slug} genre={genre} />
              ))}
            </View>
          )}

          {!!detail.anime.synopsis && (
            <View style={styles.block}>
              <Text style={styles.blockTitle}>Sinopsis</Text>
              <Text style={styles.paragraph}>{detail.anime.synopsis}</Text>
            </View>
          )}

          {firstEpisode && (
            <Pressable
              onPress={() => router.push({ pathname: "/episode/[id]", params: { id: firstEpisode.id } } as never)}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.primaryButtonText}>Tonton {firstEpisode.title}</Text>
            </Pressable>
          )}

          {detail.episodes.length > 0 && (
            <View style={styles.block}>
              <SectionHeader title={`Episode (${detail.episodes.length})`} />
              {detail.episodes.slice(0, 40).map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </View>
          )}

          {(detail.streams.length > 0 || detail.downloads.length > 0) && (
            <View style={styles.block}>
              <SectionHeader title="Streaming & Download" />
              {detail.streams.map((stream, index) => (
                <StreamRow key={`${stream.name}-${stream.quality}-${index}`} stream={stream} />
              ))}
              {detail.downloads.map((download, index) => (
                <DownloadRow key={`${download.quality}-${index}`} download={download} />
              ))}
            </View>
          )}

          {detail.recommendations.length > 0 && (
            <View style={styles.block}>
              <SectionHeader title="Rekomendasi" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                {detail.recommendations.map((anime) => (
                  <AnimeCard key={`${anime.type}-${anime.id}`} anime={anime} size="sm" />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoPill({ label }: { label: string }) {
  return (
    <View style={styles.infoPill}>
      <Text style={styles.infoPillText}>{label}</Text>
    </View>
  );
}

function StreamRow({ stream }: { stream: StreamServer }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoRowTitle}>
        {stream.quality ? `${stream.quality} ` : ""}
        {stream.name}
      </Text>
      <Text style={styles.infoRowMeta}>Streaming</Text>
    </View>
  );
}

function DownloadRow({ download }: { download: DownloadLink }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoRowTitle}>{download.quality}</Text>
      <Text style={styles.infoRowMeta}>{download.links.length} link</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    height: 320,
    backgroundColor: "#1a1a2e",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroFallback: {
    backgroundColor: "#16213e",
  },
  heroScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.32)",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 16,
    minHeight: 38,
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "rgba(15, 15, 15, 0.78)",
    paddingHorizontal: 14,
  },
  backText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "900",
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  title: {
    color: "#ffffff",
    fontSize: 25,
    lineHeight: 32,
    fontWeight: "900",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  infoPill: {
    minHeight: 30,
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#1e1e2e",
    paddingHorizontal: 10,
  },
  infoPillText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "800",
  },
  genreWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },
  block: {
    marginTop: 24,
  },
  blockTitle: {
    color: "#e2e8f0",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 8,
  },
  paragraph: {
    color: "#b6c2d1",
    fontSize: 14,
    lineHeight: 22,
  },
  primaryButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#e94560",
    marginTop: 20,
    paddingHorizontal: 14,
  },
  pressed: {
    opacity: 0.72,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },
  horizontalList: {
    paddingRight: 4,
  },
  infoRow: {
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2d2d3d",
    backgroundColor: "#1e1e2e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  infoRowTitle: {
    flex: 1,
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "800",
  },
  infoRowMeta: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "800",
  },
});
