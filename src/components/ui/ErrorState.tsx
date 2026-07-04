import { Pressable, Text, View } from "react-native";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Gagal memuat data.", onRetry }: ErrorStateProps) {
  return (
    <View className="items-center justify-center px-6 py-12">
      <Text className="text-base font-bold text-text-primary">Ada masalah</Text>
      <Text className="mt-2 text-center text-[13px] leading-5 text-text-secondary">{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} className="mt-4 rounded-lg bg-primary px-4 py-2.5 active:opacity-70">
          <Text className="text-[13px] font-bold text-white">Coba lagi</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
