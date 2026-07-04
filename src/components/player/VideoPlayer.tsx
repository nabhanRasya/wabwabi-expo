import { StyleSheet, Text, View } from "react-native";

interface VideoPlayerProps {
  uri?: string;
}

export function VideoPlayer({ uri }: VideoPlayerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Direct video belum tersedia</Text>
      {!!uri && (
        <Text style={styles.message} numberOfLines={2}>
          {uri}
        </Text>
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
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 8,
  },
});
