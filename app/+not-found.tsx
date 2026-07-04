import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundRoute() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-[54px] font-black text-primary">404</Text>
        <Text className="mt-2 text-center text-[22px] font-black text-white">Halaman tidak ditemukan</Text>
        <Text className="mt-2 text-center text-sm leading-[21px] text-text-secondary">
          Route ini tidak tersedia di WABIWABI.
        </Text>
        <Pressable onPress={() => router.replace("/")} className="mt-[22px] min-h-[46px] items-center justify-center rounded-lg bg-primary px-[18px] active:opacity-70">
          <Text className="text-sm font-black text-white">Kembali ke Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
