import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  href?: unknown;
}

export function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <View className="mb-3 flex-row items-center justify-between px-4">
      <View className="flex-1 flex-row items-center gap-2 pr-3">
        <View className="h-5 w-1 rounded-sm bg-primary" />
        <Text className="text-[17px] font-extrabold text-text-primary">{title}</Text>
      </View>
      {href ? (
        <Pressable onPress={() => router.push(href as never)} className="min-h-8 flex-row items-center active:opacity-70">
          <Text className="text-xs font-bold text-primary">Lihat semua</Text>
          <Text className="ml-1 text-base font-extrabold text-primary">{">"}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
