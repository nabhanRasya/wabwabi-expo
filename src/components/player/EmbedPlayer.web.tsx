import React from "react";
import { Text, View } from "react-native";

interface EmbedPlayerProps {
  html?: string;
  url?: string;
}

export function EmbedPlayer({ html, url }: EmbedPlayerProps) {
  const sourceUrl = getEmbedSourceUrl(url, html);
  const markup = sourceUrl ? buildEmbedMarkup(sourceUrl) : "";

  if (!markup) {
    return (
      <View className="relative flex-1 w-full items-center justify-center overflow-hidden bg-[#050505] px-6">
        <Text className="text-center text-[17px] font-black text-white">Player belum tersedia</Text>
        <Text className="mt-2 text-center text-[13px] leading-[19px] text-text-secondary">Pilih server yang tersedia untuk memuat player.</Text>
      </View>
    );
  }

  return (
    <View className="relative flex-1 w-full overflow-hidden bg-[#050505]">
      {React.createElement("div", {
        className: "absolute inset-0 h-full w-full bg-[#050505]",
        dangerouslySetInnerHTML: { __html: markup },
      })}
    </View>
  );
}

function getEmbedSourceUrl(url?: string, html?: string) {
  return url || html?.match(/src=["']([^"']+)["']/i)?.[1] || "";
}

function buildEmbedMarkup(url: string) {
  const escapedUrl = escapeHtmlAttribute(url);

  return `<iframe src="${escapedUrl}" title="Streaming player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen webkitallowfullscreen mozallowfullscreen referrerpolicy="no-referrer-when-downgrade" scrolling="no" style="background:#050505;border:0;height:100%;inset:0;position:absolute;width:100%;"></iframe>`;
}

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
