import React from "react";
import { Text, View } from "react-native";

interface EmbedPlayerProps {
  url?: string;
}

export function EmbedPlayer({ url }: EmbedPlayerProps) {
  if (!url) {
    return (
      <View className="relative flex-1 w-full items-center justify-center overflow-hidden bg-[#050505] px-6">
        <Text className="text-center text-[17px] font-black text-white">Player belum tersedia</Text>
        <Text className="mt-2 text-center text-[13px] leading-[19px] text-text-secondary">Pilih server yang tersedia untuk memuat player.</Text>
      </View>
    );
  }

  return (
    <View className="relative flex-1 w-full overflow-hidden bg-[#050505]">
      {React.createElement("iframe", {
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
        allowFullScreen: true,
        className: "absolute inset-0 h-full w-full border-0 bg-[#050505]",
        frameBorder: "0",
        referrerPolicy: "no-referrer-when-downgrade",
        scrolling: "no",
        src: url,
        title: "Streaming player",
      })}
    </View>
  );
}
