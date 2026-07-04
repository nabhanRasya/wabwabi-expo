import type { Href } from "expo-router";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  href?: Href;
}

export function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrap}>
        <View style={styles.accent} />
        <Text style={styles.title}>{title}</Text>
      </View>

      {href && (
        <Pressable onPress={() => router.push(href)} style={({ pressed }) => [styles.link, pressed && styles.pressed]}>
          <Text style={styles.linkText}>Lihat semua</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titleWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 12,
  },
  accent: {
    width: 4,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#e94560",
  },
  title: {
    color: "#e2e8f0",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900",
  },
  link: {
    minHeight: 32,
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.64,
  },
  linkText: {
    color: "#e94560",
    fontSize: 12,
    fontWeight: "900",
  },
});
import type { Href } from "expo-router";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  href?: Href;
}

export function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrap}>
        <View style={styles.accent} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {href ? (
        <Pressable onPress={() => router.push(href)} style={styles.action}>
          <Text style={styles.actionText}>Lihat semua</Text>
          <Text style={styles.chevron}>{">"}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  accent: {
    backgroundColor: "#e94560",
    borderRadius: 2,
    height: 20,
    width: 4,
  },
  action: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 32,
  },
  actionText: {
    color: "#e94560",
    fontSize: 12,
    fontWeight: "700",
  },
  chevron: {
    color: "#e94560",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 4,
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    color: "#e2e8f0",
    fontSize: 17,
    fontWeight: "800",
  },
  titleWrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
});
