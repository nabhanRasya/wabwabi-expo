import { Pressable, StyleSheet, Text, View } from "react-native";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Gagal memuat data", message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}
      {onRetry && (
        <Pressable onPress={onRetry} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>Coba lagi</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 240,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  title: {
    color: "#e2e8f0",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },
  message: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 20,
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
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Gagal memuat data.", onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ada masalah</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} style={styles.button}>
          <Text style={styles.buttonText}>Coba lagi</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#e94560",
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  message: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    textAlign: "center",
  },
  title: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "700",
  },
});
