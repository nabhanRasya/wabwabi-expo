import { ActivityIndicator, StyleSheet, View } from "react-native";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export function LoadingSpinner({ fullScreen }: LoadingSpinnerProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color="#e94560" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
});
import { ActivityIndicator, StyleSheet, View } from "react-native";

export function LoadingSpinner({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator color="#e94560" size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  fullScreen: {
    backgroundColor: "#0f0f0f",
    flex: 1,
  },
});
