import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

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
      style={({ pressed }) => [styles.badge, selected && styles.selected, pressed && styles.pressed]}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{genre.name}</Text>
      {genre.count ? <Text style={[styles.count, selected && styles.selectedText]}>{genre.count}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    backgroundColor: "#1e1e2e",
    borderColor: "#2d2d3d",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
    marginRight: 8,
    minHeight: 32,
    paddingHorizontal: 12,
  },
  count: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.72,
  },
  selected: {
    backgroundColor: "#e94560",
    borderColor: "#e94560",
  },
  selectedText: {
    color: "#ffffff",
  },
  text: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "700",
  },
});
