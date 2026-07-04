import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EmbedPlayerProps {
  url?: string;
}

const iframeStyle = {
  backgroundColor: "#050505",
  border: "0",
  height: "100%",
  inset: 0,
  position: "absolute",
  width: "100%",
} as const;

export function EmbedPlayer({ url }: EmbedPlayerProps) {
  if (!url) {
    return (
      <View style={[styles.container, styles.fallback]}>
        <Text style={styles.title}>Player belum tersedia</Text>
        <Text style={styles.message}>Pilih server yang tersedia untuk memuat player.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {React.createElement("iframe", {
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
        allowFullScreen: true,
        frameBorder: "0",
        referrerPolicy: "no-referrer-when-downgrade",
        scrolling: "no",
        src: url,
        style: iframeStyle,
        title: "Streaming player",
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#050505",
    flex: 1,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },
  message: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    textAlign: "center",
  },
});
