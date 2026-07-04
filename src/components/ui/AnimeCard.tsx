import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import type { Anime } from "../../types/anime";
import { routeForAnime } from "../../utils/helpers";

interface AnimeCardProps {
  anime: Anime;
  size?: "sm" | "md" | "lg";
}

const cardClassNames = {
  lg: "mr-3 w-[180px]",
  md: "mr-3 w-36",
  sm: "mr-3 w-28",
} as const;

const posterClassNames = {
  lg: "h-[260px]",
  md: "h-[210px]",
  sm: "h-[164px]",
} as const;

export function AnimeCard({ anime, size = "md" }: AnimeCardProps) {
  return (
    <Pressable
      onPress={() => router.push(routeForAnime(anime) as never)}
      className={`${cardClassNames[size]} active:scale-[0.98] active:opacity-70`}
    >
      <View className={`${posterClassNames[size]} w-full overflow-hidden rounded-lg bg-surface`}>
        {anime.thumbnail ? (
          <Image
            contentFit="cover"
            source={{ uri: anime.thumbnail }}
            className="h-full w-full"
            transition={180}
          />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <Text className="text-3xl font-extrabold text-text-muted">W</Text>
          </View>
        )}

        {(anime.rank || anime.episode || anime.time || anime.type) && (
          <View className="absolute bottom-1.5 left-1.5 right-1.5 min-h-[22px] justify-center rounded-md bg-black/80 px-1.5">
            <Text numberOfLines={1} className="text-center text-[10px] font-bold uppercase text-white">
              {anime.rank || anime.episode || anime.time || anime.type}
            </Text>
          </View>
        )}
      </View>

      <Text numberOfLines={2} className="mt-2 min-h-[34px] text-[13px] font-bold leading-[17px] text-text-primary">
        {anime.title}
      </Text>

      {!!anime.score && anime.score !== "-" && (
        <Text numberOfLines={1} className="mt-1 text-[11px] font-bold text-yellow-400">
          Rating {anime.score}
        </Text>
      )}
    </Pressable>
  );
}
