import { cssInterop } from "nativewind";
import type { ComponentProps, ComponentType } from "react";
import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { WebView as NativeWebView } from "react-native-webview";

const WebView = NativeWebView as ComponentType<ComponentProps<typeof NativeWebView> & { className?: string }>;
cssInterop(WebView, { className: "style" });

interface EmbedPlayerProps {
  html?: string;
  url?: string;
}

export function EmbedPlayer({ html, url }: EmbedPlayerProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const sourceUrl = getEmbedSourceUrl(url, html);
  const embedDocument = sourceUrl ? buildEmbedDocument(sourceUrl) : "";
  const hasError = Boolean(sourceUrl && failedUrl === sourceUrl);

  if (!sourceUrl || hasError) {
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
        onError={() => setFailedUrl(sourceUrl)}
        originWhitelist={["*"]}
        renderLoading={() => (
          <View className="absolute inset-0 items-center justify-center bg-[#050505]">
            <ActivityIndicator color="#e94560" />
          </View>
        )}
        setSupportMultipleWindows={false}
        source={{ html: embedDocument, baseUrl: sourceUrl }}
        startInLoadingState
        className="flex-1 bg-[#050505]"
      />
    </View>
  );
}

function getEmbedSourceUrl(url?: string, html?: string) {
  return url || html?.match(/src=["']([^"']+)["']/i)?.[1] || "";
}

function buildEmbedDocument(url: string) {
  const escapedUrl = escapeHtmlAttribute(url);

  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <style>
      html, body {
        background: #050505;
        height: 100%;
        margin: 0;
        overflow: hidden;
        width: 100%;
      }
      iframe {
        background: #050505;
        border: 0;
        height: 100%;
        inset: 0;
        position: fixed;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <iframe src="${escapedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>
  </body>
</html>`;
}

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function PlayerFallback({ message }: { message: string }) {
  return (
    <View className="flex-1 w-full items-center justify-center overflow-hidden bg-[#050505] px-6">
      <Text className="text-center text-[17px] font-black text-white">Player belum tersedia</Text>
      <Text className="mt-2 text-center text-[13px] leading-[19px] text-text-secondary">{message}</Text>
    </View>
  );
}
