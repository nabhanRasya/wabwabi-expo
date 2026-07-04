import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATS = [
  { label: "Watchlist", value: "0" },
  { label: "Riwayat", value: "0" },
  { label: "Selesai", value: "0" },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-4 pb-7">
        <Text className="text-[28px] font-black text-white">Profil</Text>
        <View className="mt-[18px] flex-row items-center gap-3.5">
          <View className="h-14 w-14 items-center justify-center rounded-[28px] bg-primary">
            <Text className="text-2xl font-black text-white">W</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-black text-white">WABIWABI User</Text>
            <Text className="mt-0.5 text-[13px] font-semibold text-text-secondary">Local profile</Text>
          </View>
        </View>

        <View className="mt-5 flex-row gap-2.5">
          {STATS.map((stat) => (
            <View key={stat.label} className="flex-1 items-center rounded-lg border border-border bg-background-card py-3.5">
              <Text className="text-[22px] font-black text-white">{stat.value}</Text>
              <Text className="mt-1 text-xs font-bold text-text-secondary">{stat.label}</Text>
            </View>
          ))}
        </View>

        <View className="mt-3.5 rounded-lg border border-border bg-background-card p-4">
          <Text className="text-base font-black text-text-primary">Watchlist</Text>
          <Text className="mt-2 text-[13px] text-text-secondary">Belum ada judul tersimpan.</Text>
        </View>
        <View className="mt-3.5 rounded-lg border border-border bg-background-card p-4">
          <Text className="text-base font-black text-text-primary">Riwayat</Text>
          <Text className="mt-2 text-[13px] text-text-secondary">Belum ada episode ditonton.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
