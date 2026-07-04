import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

interface EmbedPlayerProps {
  url?: string;
}

export function EmbedPlayer({ url }: EmbedPlayerProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const hasError = Boolean(url && failedUrl === url);

  if (!url || hasError) {
    return <PlayerFallback message={hasError ? "Player gagal dimuat. Coba pilih server lain." : "Pilih server yang tersedia untuk memuat player."} />;
  }

  return (
    <View style={styles.container}>
      <WebView
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        domStorageEnabled
        javaScriptEnabled
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility"
        onError={() => setFailedUrl(url)}
        originWhitelist={["*"]}
        renderLoading={() => (
          <View style={[StyleSheet.absoluteFill, styles.loading]}>
            <ActivityIndicator color="#e94560" />
          </View>
        )}
        setSupportMultipleWindows={false}
        source={{ uri: url }}
        startInLoadingState
        style={styles.webview}
      />
    </View>
  );
}

function PlayerFallback({ message }: { message: string }) {
  return (
    <View style={[styles.container, styles.fallback]}>
      <Text style={styles.title}>Player belum tersedia</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    overflow: "hidden",
    width: "100%",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loading: {
    alignItems: "center",
    backgroundColor: "#050505",
    justifyContent: "center",
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
  webview: {
    backgroundColor: "#050505",
    flex: 1,
  },
});
