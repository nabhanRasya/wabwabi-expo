import { Pressable, StyleSheet, Text, View } from "react-native";

import { openExternalUrl } from "../../utils/openExternalUrl";

interface EmbedPlayerProps {
  url?: string;
}

export function EmbedPlayer({ url }: EmbedPlayerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{url ? "Player siap" : "Player belum tersedia"}</Text>
      <Text style={styles.message}>
        {url ? "Embed dari server pilihan sudah tersedia." : "Coba pilih server lain atau muat ulang episode."}
      </Text>
      {url && (
        <Pressable onPress={() => void openExternalUrl(url)} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>Buka Player</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#050505",
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
    textAlign: "center",
    marginTop: 8,
  },
  button: {
    minHeight: 42,
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#e94560",
    paddingHorizontal: 18,
    marginTop: 16,
  },
  pressed: {
    opacity: 0.72,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "900",
  },
});
