import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Episode } from "../../types/anime";

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: "/episode/[id]", params: { id: episode.id } } as never)}
      style={[styles.container, episode.active && styles.active]}
    >
      <View style={styles.numberBox}>
        <Text style={styles.number}>{episode.number ?? "EP"}</Text>
      </View>
      <Text numberOfLines={2} style={styles.title}>
        {episode.title}
      </Text>
      <Text style={styles.play}>Play</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  active: {
    borderColor: "#e94560",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderColor: "#2d2d3d",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
    minHeight: 64,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  number: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
  },
  numberBox: {
    alignItems: "center",
    backgroundColor: "#e94560",
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
    width: 44,
  },
  play: {
    color: "#e94560",
    fontSize: 12,
    fontWeight: "900",
  },
  title: {
    color: "#e2e8f0",
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
});
