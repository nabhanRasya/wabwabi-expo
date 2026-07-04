import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATS = [
  { label: "Watchlist", value: "0" },
  { label: "Riwayat", value: "0" },
  { label: "Selesai", value: "0" },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profil</Text>
        <View style={styles.profileBlock}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>W</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.name}>WABIWABI User</Text>
            <Text style={styles.meta}>Local profile</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Watchlist</Text>
          <Text style={styles.panelText}>Belum ada judul tersimpan.</Text>
        </View>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Riwayat</Text>
          <Text style={styles.panelText}>Belum ada episode ditonton.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: "#e94560",
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  meta: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  name: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
  },
  panel: {
    backgroundColor: "#1a1a2e",
    borderColor: "#2d2d3d",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 16,
  },
  panelText: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 8,
  },
  panelTitle: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "900",
  },
  profileBlock: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    marginTop: 18,
  },
  profileCopy: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: "#0f0f0f",
    flex: 1,
  },
  statCard: {
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderColor: "#2d2d3d",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 14,
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  statValue: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
  },
});
