import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Anime } from "../../types/anime";
import { routeForAnime } from "../../utils/helpers";

interface AnimeCardProps {
  anime: Anime;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  lg: { height: 260, width: 180 },
  md: { height: 210, width: 144 },
  sm: { height: 164, width: 112 },
} as const;

export function AnimeCard({ anime, size = "md" }: AnimeCardProps) {
  const dimensions = sizes[size];

  return (
    <Pressable
      onPress={() => router.push(routeForAnime(anime) as never)}
      style={({ pressed }) => [
        styles.card,
        { width: dimensions.width },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.posterFrame, { height: dimensions.height }]}>
        {anime.thumbnail ? (
          <Image
            contentFit="cover"
            source={{ uri: anime.thumbnail }}
            style={styles.poster}
            transition={180}
          />
        ) : (
          <View style={[styles.poster, styles.posterFallback]}>
            <Text style={styles.posterFallbackText}>W</Text>
          </View>
        )}

        {(anime.rank || anime.episode || anime.time || anime.type) && (
          <View style={styles.badge}>
            <Text numberOfLines={1} style={styles.badgeText}>
              {anime.rank || anime.episode || anime.time || anime.type}
            </Text>
          </View>
        )}
      </View>

      <Text numberOfLines={2} style={styles.title}>
        {anime.title}
      </Text>

      {!!anime.score && anime.score !== "-" && (
        <Text numberOfLines={1} style={styles.meta}>
          Rating {anime.score}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "rgba(15, 15, 15, 0.78)",
    borderRadius: 6,
    bottom: 6,
    justifyContent: "center",
    left: 6,
    minHeight: 22,
    paddingHorizontal: 6,
    position: "absolute",
    right: 6,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
    textTransform: "uppercase",
  },
  card: {
    marginRight: 12,
  },
  meta: {
    color: "#facc15",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  poster: {
    height: "100%",
    width: "100%",
  },
  posterFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  posterFallbackText: {
    color: "#64748b",
    fontSize: 30,
    fontWeight: "800",
  },
  posterFrame: {
    backgroundColor: "#1e1e2e",
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  title: {
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 8,
    minHeight: 34,
  },
});
