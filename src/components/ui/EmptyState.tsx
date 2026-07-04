import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 220,
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
});
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
    textAlign: "center",
  },
});
