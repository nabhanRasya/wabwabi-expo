import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundRoute() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Halaman tidak ditemukan</Text>
        <Text style={styles.message}>
          Route ini tidak tersedia di WABIWABI.
        </Text>
        <Pressable onPress={() => router.replace("/")} style={styles.button}>
          <Text style={styles.buttonText}>Kembali ke Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#e94560",
    borderRadius: 8,
    minHeight: 46,
    justifyContent: "center",
    marginTop: 22,
    paddingHorizontal: 18,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  code: {
    color: "#e94560",
    fontSize: 54,
    fontWeight: "900",
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  message: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: "center",
  },
  safeArea: {
    backgroundColor: "#0f0f0f",
    flex: 1,
  },
  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
  },
});
