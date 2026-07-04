import { Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View className="items-center justify-center px-6 py-12">
      <Text className="text-center text-base font-bold text-text-primary">{title}</Text>
      {message ? <Text className="mt-2 text-center text-[13px] leading-5 text-text-secondary">{message}</Text> : null}
    </View>
  );
}
