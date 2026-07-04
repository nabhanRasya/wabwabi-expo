import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import type { StreamServer } from "../../types/anime";

interface ServicesSelectorProps {
  services: StreamServer[];
  active?: StreamServer | null;
  onSelect: (service: StreamServer) => void;
}

export function ServicesSelector({
  services,
  active,
  onSelect,
}: ServicesSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {services.map((service, index) => {
        const selected =
          active?.post === service.post &&
          active?.nume === service.nume &&
          active?.iframe === service.iframe &&
          active?.serverType === service.serverType &&
          active?.quality === service.quality;

        return (
          <Pressable
            key={`${service.name}-${service.quality}-${service.nume ?? service.iframe}-${service.serverType}-${index}`}
            onPress={() => onSelect(service)}
            style={({ pressed }) => [
              styles.item,
              selected && styles.selected,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[styles.text, selected && styles.selectedText]}
              numberOfLines={1}
            >
              {service.quality || "Resolusi"}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    gap: 8,
  },
  item: {
    minHeight: 38,
    maxWidth: 150,
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2d2d3d",
    backgroundColor: "#1e1e2e",
    paddingHorizontal: 12,
  },
  selected: {
    borderColor: "#e94560",
    backgroundColor: "#e94560",
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "800",
  },
  selectedText: {
    color: "#ffffff",
  },
});
