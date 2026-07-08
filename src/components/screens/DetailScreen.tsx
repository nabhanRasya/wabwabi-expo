import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAnimeDetail } from "../../hooks/useAnimeDetail";
import type { ContentType, StreamServer } from "../../types/anime";
import {
  getMegaDownloadItems,
  isSupportedStreamService,
  normalizeParam,
  type StreamDownloadItem,
} from "../../utils/helpers";
import { openExternalUrl } from "../../utils/openExternalUrl";
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
      <SafeAreaView className="flex-1 bg-background">
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : "Cek koneksi internet lalu coba lagi."
          }
          onRetry={() => refetch()}
        />
      </SafeAreaView>
    );
  }

  if (!detail) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <EmptyState title="Detail tidak ditemukan" />
      </SafeAreaView>
    );
  }

  const firstEpisode = detail.episodes[0];
  const availableStreams = detail.streams.filter(
    (stream) =>
      isSupportedStreamService(stream.name) ||
      isSupportedStreamService(stream.serverType),
  );
  const megaDownloads = getMegaDownloadItems(detail.downloads);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-8"
      >
        <View className="h-80 bg-background-card">
          {detail.anime.thumbnail ? (
            <Image
              source={{ uri: detail.anime.thumbnail }}
              className="h-full w-full"
              contentFit="cover"
            />
          ) : (
            <View className="h-full w-full bg-background-elevated" />
          )}
          <View className="absolute inset-0 bg-black/30" />
          <Pressable
            onPress={() =>
              router.canGoBack() ? router.back() : router.push("/")
            }
            className="absolute left-4 top-4 min-h-[38px] justify-center rounded-lg bg-background/80 px-3.5 active:opacity-70"
          >
            <Text className="text-[13px] font-black text-white">Back</Text>
          </Pressable>
        </View>

        <View className="px-4 pt-[18px]">
          <Text className="text-[25px] font-black leading-8 text-white">
            {detail.anime.title}
          </Text>

          <View className="mt-3 flex-row flex-wrap gap-2">
            {!!detail.anime.score && detail.anime.score !== "-" && (
              <InfoPill label={`Rating ${detail.anime.score}`} />
            )}
            {!!detail.anime.season && detail.anime.season !== "-" && (
              <InfoPill label={detail.anime.season} />
            )}
            {!!detail.anime.duration && detail.anime.duration !== "-" && (
              <InfoPill label={detail.anime.duration} />
            )}
          </View>

          {detail.anime.genres && detail.anime.genres.length > 0 && (
            <View className="mt-4 flex-row flex-wrap">
              {detail.anime.genres.map((genre) => (
                <GenreBadge key={genre.slug} genre={genre} />
              ))}
            </View>
          )}

          {!!detail.anime.synopsis && (
            <View className="mt-6">
              <Text className="mb-2 text-[17px] font-black text-text-primary">
                Sinopsis
              </Text>
              <Text className="text-sm leading-[22px] text-[#b6c2d1]">
                {detail.anime.synopsis}
              </Text>
            </View>
          )}

          {firstEpisode && (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/episode/[id]",
                  params: { id: firstEpisode.id },
                } as never)
              }
              className="mt-5 min-h-12 items-center justify-center rounded-lg bg-primary px-3.5 active:opacity-70"
            >
              <Text className="text-center text-sm font-black text-white">
                Tonton {firstEpisode.title}
              </Text>
            </Pressable>
          )}

          {detail.episodes.length > 0 && (
            <View className="mt-6">
              <SectionHeader title={`Episode (${detail.episodes.length})`} />
              {detail.episodes.slice(0, 40).map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </View>
          )}

          {(availableStreams.length > 0 || megaDownloads.length > 0) && (
            <View className="mt-6">
              <SectionHeader title="Streaming & Download" />
              {availableStreams.map((stream, index) => (
                <StreamRow
                  key={`${stream.name}-${stream.quality}-${index}`}
                  stream={stream}
                />
              ))}
              {megaDownloads.map((download, index) => (
                <DownloadRow
                  key={`${download.quality}-${index}`}
                  download={download}
                />
              ))}
            </View>
          )}

          {detail.recommendations.length > 0 && (
            <View className="mt-6">
              <SectionHeader title="Rekomendasi" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="pr-1"
              >
                {detail.recommendations.map((anime) => (
                  <AnimeCard
                    key={`${anime.type}-${anime.id}`}
                    anime={anime}
                    size="sm"
                  />
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
    <View className="min-h-[30px] justify-center rounded-lg bg-surface px-2.5">
      <Text className="text-xs font-extrabold text-text-secondary">
        {label}
      </Text>
    </View>
  );
}

function StreamRow({ stream }: { stream: StreamServer }) {
  return (
    <View className="mb-2.5 min-h-[52px] flex-row items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3">
      <Text className="flex-1 text-sm font-extrabold text-text-primary">
        {stream.quality || "Resolusi"}
      </Text>
    </View>
  );
}

function DownloadRow({ download }: { download: StreamDownloadItem }) {
  return (
    <Pressable
      onPress={() => void openExternalUrl(download.url)}
      className="mb-2.5 min-h-[52px] flex-row items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 active:opacity-70"
    >
      <Text className="flex-1 text-sm font-extrabold text-text-primary">
        {download.quality || "Resolusi"}
      </Text>
    </Pressable>
  );
}
