import { router } from "expo-router";
import { Pressable, Text } from "react-native";

import type { Genre } from "../../types/anime";

interface GenreBadgeProps {
  genre: Genre;
  selected?: boolean;
  onPress?: () => void;
}

export function GenreBadge({ genre, selected = false, onPress }: GenreBadgeProps) {
  return (
    <Pressable
      onPress={onPress ?? (() => router.push({ pathname: "/genre/[slug]", params: { slug: genre.slug } } as never))}
      className={`mb-2 mr-2 min-h-8 flex-row items-center gap-1.5 rounded-full border px-3 active:opacity-70 ${
        selected ? "border-primary bg-primary" : "border-border bg-surface"
      }`}
    >
      <Text className={`text-xs font-bold ${selected ? "text-white" : "text-slate-300"}`}>{genre.name}</Text>
      {genre.count ? <Text className={`text-[11px] font-bold ${selected ? "text-white" : "text-text-muted"}`}>{genre.count}</Text> : null}
    </Pressable>
  );
}
