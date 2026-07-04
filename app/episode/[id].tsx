import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmbedPlayer } from "../../src/components/player/EmbedPlayer";
import { ServicesSelector } from "../../src/components/player/ServicesSelector";
import { EmptyState } from "../../src/components/ui/EmptyState";
import { EpisodeCard } from "../../src/components/ui/EpisodeCard";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { LoadingSpinner } from "../../src/components/ui/LoadingSpinner";
import { useEpisode, useServerEmbed } from "../../src/hooks/useEpisode";
import type { StreamServer } from "../../src/types/anime";
import {
  getMegaDownloadItems,
  isMegaService,
  normalizeParam,
} from "../../src/utils/helpers";
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
    () => getMegaDownloadItems(data?.downloads),
    [data?.downloads],
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <EmptyState title="Episode tidak ditemukan" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-3 p-4">
          <Pressable
            onPress={() =>
              router.canGoBack() ? router.back() : router.push("/")
            }
            className="h-[38px] items-center justify-center rounded-lg bg-surface px-3 active:opacity-70"
          >
            <Text className="text-xs font-black text-white">Close</Text>
          </Pressable>
          <Text numberOfLines={2} className="flex-1 text-lg font-black leading-6 text-white">
            {data.title}
          </Text>
        </View>

        <View className="aspect-video w-full bg-[#050505]">
          {isFetchingEmbed ? (
            <LoadingSpinner />
          ) : activeStream ? (
            <EmbedPlayer url={embedData?.embed_url} />
          ) : (
            <EmptyState title="Stream tidak tersedia" />
          )}
        </View>

        {megaStreams.length > 0 ? (
          <View className="mt-[22px]">
            <Text className="mb-3 px-4 text-[17px] font-black text-text-primary">Pilih Resolusi</Text>
            <ServicesSelector
              active={activeStream}
              onSelect={(stream) => setSelectedStreamKey(streamKey(stream))}
              services={megaStreams}
            />
          </View>
        ) : null}

        {currentDownloadLinks.length > 0 ? (
          <View className="mt-[22px]">
            <Text className="mb-3 px-4 text-[17px] font-black text-text-primary">Download</Text>
            {currentDownloadLinks.slice(0, 16).map((link) => (
              <Pressable
                key={`${link.quality}-${link.url}`}
                onPress={() => void openExternalUrl(link.url)}
                className="mx-4 mb-2.5 min-h-[52px] flex-row items-center justify-between rounded-lg border border-border bg-background-card px-3 active:opacity-70"
              >
                <Text className="text-sm font-black text-text-primary">
                  Download {link.quality || "Resolusi"}
                </Text>
                <Text className="text-xs font-extrabold text-text-secondary">MEGA</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {data.allEpisodes.length > 0 ? (
          <View className="mt-[22px]">
            <Text className="mb-3 px-4 text-[17px] font-black text-text-primary">Daftar Episode</Text>
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
