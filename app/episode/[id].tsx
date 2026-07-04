import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmbedPlayer } from "../../src/components/player/EmbedPlayer";
import { ServicesSelector } from "../../src/components/player/ServicesSelector";
import { EmptyState } from "../../src/components/ui/EmptyState";
import { EpisodeCard } from "../../src/components/ui/EpisodeCard";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { LoadingSpinner } from "../../src/components/ui/LoadingSpinner";
import { useEpisode, useServerEmbed } from "../../src/hooks/useEpisode";
import type { StreamServer } from "../../src/types/anime";
import { isMegaService, normalizeParam } from "../../src/utils/helpers";
import { openExternalUrl } from "../../src/utils/openExternalUrl";

export default function EpisodeRoute() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = normalizeParam(params.id);
  const { data, error, isLoading, refetch } = useEpisode(id);
  const [selectedStreamKey, setSelectedStreamKey] = useState<string | null>(
    null,
  );

  const megaStreams = useMemo(
    () =>
      (data?.streams ?? []).filter(
        (stream) =>
          isMegaService(stream.name) || isMegaService(stream.serverType),
      ),
    [data?.streams],
  );

  const activeStream = useMemo(() => {
    return (
      megaStreams.find((stream) => streamKey(stream) === selectedStreamKey) ??
      megaStreams[0] ??
      null
    );
  }, [megaStreams, selectedStreamKey]);

  const { data: embedData, isFetching: isFetchingEmbed } =
    useServerEmbed(activeStream);

  const currentDownloadLinks = useMemo(
    () =>
      data?.downloads.flatMap((group) =>
        group.links
          .filter((link) => isMegaService(link.server))
          .map((link) => ({ ...link, quality: group.quality })),
      ) ?? [],
    [data?.downloads],
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <EmptyState title="Episode tidak ditemukan" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.playerHeader}>
          <Pressable
            onPress={() =>
              router.canGoBack() ? router.back() : router.push("/")
            }
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
          <Text numberOfLines={2} style={styles.title}>
            {data.title}
          </Text>
        </View>

        <View style={styles.player}>
          {isFetchingEmbed ? (
            <LoadingSpinner />
          ) : activeStream ? (
            <EmbedPlayer url={embedData?.embed_url} />
          ) : (
            <EmptyState title="Stream tidak tersedia" />
          )}
        </View>

        {megaStreams.length > 0 ? (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Pilih Resolusi</Text>
            <ServicesSelector
              active={activeStream}
              onSelect={(stream) => setSelectedStreamKey(streamKey(stream))}
              services={megaStreams}
            />
          </View>
        ) : null}

        {currentDownloadLinks.length > 0 ? (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Download</Text>
            {currentDownloadLinks.slice(0, 16).map((link) => (
              <Pressable
                key={`${link.quality}-${link.server}-${link.url}`}
                onPress={() => void openExternalUrl(link.url)}
                style={styles.downloadRow}
              >
                <Text style={styles.downloadTitle}>
                  {link.quality || "Resolusi"}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {data.allEpisodes.length > 0 ? (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Daftar Episode</Text>
            {data.allEpisodes.slice(0, 80).map((episode) => (
              <EpisodeCard episode={episode} key={episode.id} />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function streamKey(stream: StreamServer) {
  return `${stream.post ?? ""}:${stream.nume ?? stream.iframe ?? ""}:${stream.serverType ?? ""}:${stream.quality ?? ""}:${stream.name}`;
}

const styles = StyleSheet.create({
  block: {
    marginTop: 22,
  },
  blockTitle: {
    color: "#e2e8f0",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: "#1e1e2e",
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  closeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
  },
  content: {
    paddingBottom: 32,
  },
  downloadRow: {
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderColor: "#2d2d3d",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: 16,
    minHeight: 52,
    paddingHorizontal: 12,
  },
  downloadServer: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "800",
  },
  downloadTitle: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "900",
  },
  player: {
    aspectRatio: 16 / 9,
    backgroundColor: "#050505",
    width: "100%",
  },
  playerHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    padding: 16,
  },
  safeArea: {
    backgroundColor: "#0f0f0f",
    flex: 1,
  },
  title: {
    color: "#ffffff",
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 24,
  },
});
