import { Pressable, ScrollView, Text } from "react-native";

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
      contentContainerClassName="gap-2 px-4"
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
            className={`min-h-[38px] max-w-[150px] justify-center rounded-lg border px-3 active:opacity-70 ${
              selected ? "border-primary bg-primary" : "border-border bg-surface"
            }`}
          >
            <Text
              className={`text-xs font-extrabold ${selected ? "text-white" : "text-text-secondary"}`}
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
