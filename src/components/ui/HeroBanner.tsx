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
      onPress={() => router.push(routeForAnime(anime))}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {anime.thumbnail ? (
        <Image source={{ uri: anime.thumbnail }} style={styles.image} contentFit="cover" transition={220} />
      ) : (
        <View style={[styles.image, styles.fallback]} />
      )}
      <View style={styles.scrim} />
      <View style={styles.content}>
        <Text style={styles.kicker}>{anime.rank ? `${anime.rank} pilihan hari ini` : "Pilihan hari ini"}</Text>
        <Text style={styles.title} numberOfLines={3}>
          {anime.title}
        </Text>
        {!!anime.score && anime.score !== "-" && <Text style={styles.meta}>Rating {anime.score}</Text>}
        <View style={styles.button}>
          <Text style={styles.buttonText}>Buka Detail</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 330,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#1a1a2e",
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    backgroundColor: "#16213e",
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.42)",
  },
  content: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
    gap: 8,
  },
  kicker: {
    color: "#ff6b81",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
  },
  meta: {
    color: "#facc15",
    fontSize: 13,
    fontWeight: "800",
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#e94560",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "900",
  },
});
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
    <Pressable onPress={() => router.push(routeForAnime(anime))} style={styles.container}>
      <Image
        contentFit="cover"
        source={anime.thumbnail ? { uri: anime.thumbnail } : require("@/assets/images/logo-glow.png")}
        style={styles.image}
        transition={200}
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.kicker}>WABIWABI PICK</Text>
        <Text numberOfLines={2} style={styles.title}>
          {anime.title}
        </Text>
        <View style={styles.metaRow}>
          {anime.type ? <Text style={styles.pill}>{anime.type}</Text> : null}
          {anime.score ? <Text style={styles.pill}>Score {anime.score}</Text> : null}
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
    ...StyleSheet.absoluteFillObject,
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
  title: {
    color: "#ffffff",
    fontSize: 27,
    fontWeight: "900",
    lineHeight: 32,
  },
});
