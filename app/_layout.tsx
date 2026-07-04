import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { queryClient } from "../src/utils/queryClient";

import "../global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="anime/[id]"
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="film/[id]"
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="series/[id]"
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="episode/[id]"
              options={{
                animation: "slide_from_bottom",
                presentation: "fullScreenModal",
              }}
            />
            <Stack.Screen
              name="genre/[slug]"
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="catalog"
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
