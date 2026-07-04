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
  sm: { width: 112, height: 164 },
  md: { width: 144, height: 210 },
  lg: { width: 180, height: 260 },
} as const;

export function AnimeCard({ anime, size = "md" }: AnimeCardProps) {
  const dimensions = sizes[size];

  return (
    <Pressable
      onPress={() => router.push(routeForAnime(anime))}
      style={({ pressed }) => [
        styles.card,
        { width: dimensions.width },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.posterFrame, { height: dimensions.height }]}>
        {anime.thumbnail ? (
          <Image source={{ uri: anime.thumbnail }} style={styles.poster} contentFit="cover" transition={180} />
        ) : (
          <View style={[styles.poster, styles.posterFallback]}>
            <Text style={styles.posterFallbackText}>W</Text>
          </View>
        )}

        {(anime.rank || anime.episode || anime.time) && (
          <View style={styles.badge}>
            <Text style={styles.badgeText} numberOfLines={1}>
              {anime.rank || anime.episode || anime.time}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {anime.title}
      </Text>

      {!!anime.score && anime.score !== "-" && (
        <Text style={styles.meta} numberOfLines={1}>
          Rating {anime.score}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: 12,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  posterFrame: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#1e1e2e",
  },
  poster: {
    width: "100%",
    height: "100%",
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
  badge: {
    position: "absolute",
    left: 6,
    right: 6,
    bottom: 6,
    minHeight: 22,
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "rgba(15, 15, 15, 0.78)",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  title: {
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 8,
  },
  meta: {
    color: "#facc15",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
});
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Anime } from "../../types/anime";
import { routeForAnime } from "../../utils/helpers";

interface AnimeCardProps {
  anime: Anime;
  size?: "sm" | "md" | "lg";
}

const CARD_WIDTH = {
  lg: 168,
  md: 136,
  sm: 108,
};

export function AnimeCard({ anime, size = "md" }: AnimeCardProps) {
  const width = CARD_WIDTH[size];
  const imageHeight = Math.round(width * 1.45);

  return (
    <Pressable onPress={() => router.push(routeForAnime(anime))} style={[styles.card, { width }]}>
      <View style={[styles.posterWrap, { height: imageHeight }]}>
        <Image
          contentFit="cover"
          source={anime.thumbnail ? { uri: anime.thumbnail } : require("@/assets/images/icon.png")}
          style={styles.poster}
          transition={180}
        />
        {anime.rank || anime.type ? (
          <View style={styles.badge}>
            <Text numberOfLines={1} style={styles.badgeText}>
              {anime.rank ?? anime.type}
            </Text>
          </View>
        ) : null}
      </View>
      <Text numberOfLines={2} style={styles.title}>
        {anime.title}
      </Text>
      <View style={styles.metaRow}>
        {anime.score ? <Text style={styles.meta}>Score {anime.score}</Text> : null}
        {anime.time ? <Text style={styles.meta}>{anime.time}</Text> : null}
        {anime.episode ? <Text style={styles.meta}>{anime.episode}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "rgba(15, 15, 15, 0.78)",
    borderRadius: 6,
    left: 8,
    maxWidth: "84%",
    paddingHorizontal: 7,
    paddingVertical: 4,
    position: "absolute",
    top: 8,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  card: {
    marginRight: 12,
  },
  meta: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "600",
  },
  metaRow: {
    minHeight: 16,
  },
  poster: {
    height: "100%",
    width: "100%",
  },
  posterWrap: {
    backgroundColor: "#1e1e2e",
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
  },
  title: {
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 8,
    minHeight: 36,
  },
});
