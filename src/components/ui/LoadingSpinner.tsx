import { ActivityIndicator, View } from "react-native";

export function LoadingSpinner({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <View className={`${fullScreen ? "flex-1 bg-background" : ""} items-center justify-center py-8`}>
      <ActivityIndicator color="#e94560" size="large" />
    </View>
  );
}
