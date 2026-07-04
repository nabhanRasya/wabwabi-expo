import { cssInterop } from "nativewind";
import type { ComponentProps, ComponentType } from "react";
import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { WebView as NativeWebView } from "react-native-webview";

const WebView = NativeWebView as ComponentType<ComponentProps<typeof NativeWebView> & { className?: string }>;
cssInterop(WebView, { className: "style" });

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
    <View className="flex-1 w-full overflow-hidden bg-[#050505]">
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
          <View className="absolute inset-0 items-center justify-center bg-[#050505]">
            <ActivityIndicator color="#e94560" />
          </View>
        )}
        setSupportMultipleWindows={false}
        source={{ uri: url }}
        startInLoadingState
        className="flex-1 bg-[#050505]"
      />
    </View>
  );
}

function PlayerFallback({ message }: { message: string }) {
  return (
    <View className="flex-1 w-full items-center justify-center overflow-hidden bg-[#050505] px-6">
      <Text className="text-center text-[17px] font-black text-white">Player belum tersedia</Text>
      <Text className="mt-2 text-center text-[13px] leading-[19px] text-text-secondary">{message}</Text>
    </View>
  );
}
