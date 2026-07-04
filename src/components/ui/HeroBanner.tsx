import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Anime } from "../../types/anime";
import { routeForAnime } from "../../utils/helpers";

interface HeroBannerProps {
  anime: Anime;
}

export function HeroBanner({ anime }: HeroBannerProps) {
  return (
    <Pressable
      onPress={() => router.push(routeForAnime(anime) as never)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {anime.thumbnail ? (
        <Image contentFit="cover" source={{ uri: anime.thumbnail }} style={styles.image} transition={200} />
      ) : (
        <View style={[styles.image, styles.fallback]} />
      )}
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.kicker}>WABIWABI PICK</Text>
        <Text numberOfLines={2} style={styles.title}>
          {anime.title}
        </Text>
        <View style={styles.metaRow}>
          {anime.type ? <Text style={styles.pill}>{anime.type}</Text> : null}
          {anime.score ? <Text style={styles.pill}>Rating {anime.score}</Text> : null}
          {anime.time ? <Text style={styles.pill}>{anime.time}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 16 / 9,
    backgroundColor: "#16213e",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 10,
    overflow: "hidden",
  },
  content: {
    bottom: 18,
    left: 18,
    position: "absolute",
    right: 18,
  },
  fallback: {
    backgroundColor: "#16213e",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  kicker: {
    color: "#ff6b81",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.42)",
  },
  pill: {
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 999,
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 5,
    textTransform: "uppercase",
  },
  pressed: {
    opacity: 0.86,
  },
  title: {
    color: "#ffffff",
    fontSize: 27,
    fontWeight: "900",
    lineHeight: 32,
  },
});
