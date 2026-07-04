import { openBrowserAsync } from "expo-web-browser";
import { Linking, Platform } from "react-native";

type BrowserLikeGlobal = typeof globalThis & {
  open?: (url?: string, target?: string, features?: string) => unknown;
};

export async function openExternalUrl(url?: string) {
  if (!url) {
    return false;
  }

  try {
    if (Platform.OS === "web") {
      const open = (globalThis as BrowserLikeGlobal).open;
      if (open) {
        open(url, "_blank", "noopener,noreferrer");
        return true;
      }

      await Linking.openURL(url);
      return true;
    }

    await openBrowserAsync(url);
    return true;
  } catch (error) {
    console.warn("Unable to open external URL.", error);
    return false;
  }
}
