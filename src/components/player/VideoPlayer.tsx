import { Text, View } from "react-native";

interface VideoPlayerProps {
  uri?: string;
}

export function VideoPlayer({ uri }: VideoPlayerProps) {
  return (
    <View className="min-h-[220px] flex-1 items-center justify-center bg-[#050505] px-6">
      <Text className="text-center text-[17px] font-black text-white">Direct video belum tersedia</Text>
      {!!uri && (
        <Text className="mt-2 text-center text-xs leading-[18px] text-text-secondary" numberOfLines={2}>
          {uri}
        </Text>
      )}
    </View>
  );
}
