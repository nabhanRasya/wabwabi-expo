import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import type { Anime } from "../../types/anime";
import { routeForAnime } from "../../utils/helpers";

interface HeroBannerProps {
  anime: Anime;
}

export function HeroBanner({ anime }: HeroBannerProps) {
  return (
    <Pressable
      onPress={() => router.push(routeForAnime(anime) as never)}
      className="mx-4 mt-2.5 aspect-video overflow-hidden rounded-lg bg-background-elevated active:opacity-85"
    >
      {anime.thumbnail ? (
        <Image contentFit="cover" source={{ uri: anime.thumbnail }} className="h-full w-full" transition={200} />
      ) : (
        <View className="h-full w-full bg-background-elevated" />
      )}
      <View className="absolute inset-0 bg-black/40" />
      <View className="absolute bottom-[18px] left-[18px] right-[18px]">
        <Text className="mb-1.5 text-[11px] font-black text-primary-light">WABIWABI PICK</Text>
        <Text numberOfLines={2} className="text-[27px] font-black leading-8 text-white">
          {anime.title}
        </Text>
        <View className="mt-2.5 flex-row flex-wrap gap-2">
          {anime.type ? <Text className="overflow-hidden rounded-full bg-white/15 px-[9px] py-1.5 text-[11px] font-extrabold uppercase text-white">{anime.type}</Text> : null}
          {anime.score ? <Text className="overflow-hidden rounded-full bg-white/15 px-[9px] py-1.5 text-[11px] font-extrabold uppercase text-white">Rating {anime.score}</Text> : null}
          {anime.time ? <Text className="overflow-hidden rounded-full bg-white/15 px-[9px] py-1.5 text-[11px] font-extrabold uppercase text-white">{anime.time}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}
