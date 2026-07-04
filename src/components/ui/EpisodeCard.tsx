import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import type { Episode } from "../../types/anime";

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: "/episode/[id]", params: { id: episode.id } } as never)}
      className={`mb-2.5 min-h-16 flex-row items-center gap-3 rounded-lg border bg-background-card px-3 py-2.5 active:opacity-70 ${
        episode.active ? "border-primary" : "border-border"
      }`}
    >
      <View className="h-9 w-11 items-center justify-center rounded-lg bg-primary">
        <Text className="text-xs font-black text-white">{episode.number ?? "EP"}</Text>
      </View>
      <Text numberOfLines={2} className="flex-1 text-sm font-bold leading-5 text-text-primary">
        {episode.title}
      </Text>
      <Text className="text-xs font-black text-primary">Play</Text>
    </Pressable>
  );
}
