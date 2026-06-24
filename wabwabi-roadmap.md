# 🎌 Roadmap: Anime Streaming App
### React Native + Expo SDK 56 + NativeWind v4 + Winbu API

> **SDK 56 highlights yang relevan:**
> React Native 0.85 · React 19.2 · Hermes V1 · New Architecture only · TypeScript 6.0.3 · iOS min 16.4 · Node.js min v20.19.4

---

## 📋 Daftar Isim

1. [Tech Stack & Overview](#1-tech-stack--overview)
2. [Setup Project](#2-setup-project)
3. [Struktur Folder](#3-struktur-folder)
4. [Konfigurasi NativeWind & Tema](#4-konfigurasi-nativewind--tema)
5. [Setup API Layer](#5-setup-api-layer)
6. [Navigation Setup](#6-navigation-setup)
7. [State Management](#7-state-management)
8. [Komponen Reusable](#8-komponen-reusable)
9. [Implementasi Screen per Screen](#9-implementasi-screen-per-screen)
10. [Video Player & Streaming](#10-video-player--streaming)
11. [Fitur Tambahan](#11-fitur-tambahan)
12. [Testing & Build](#12-testing--build)
13. [Roadmap Visual](#13-roadmap-visual)

---

## 1. Tech Stack & Overview

### Teknologi Utama (SDK 56 compatible)
| Teknologi | Versi | Catatan |
|---|---|---|
| Expo SDK | ~56.0.3 | RN 0.85 + React 19.2 |
| React Native | 0.85.3 | New Architecture only |
| NativeWind | v4 stable | Tailwind CSS 3.x |
| Expo Router | v4 | Berdiri sendiri, tidak butuh react-navigation |
| TanStack Query | v5 | Data fetching & caching |
| Zustand | v4 | State management |
| expo-video | latest | Video player (bukan expo-av) |
| React Native WebView | latest | Embed player fallback |
| react-native-mmkv | latest | Local storage cepat |
| react-native-reanimated | ~4.3.1 | SDK 56 wajib v4 |
| react-native-worklets | ~0.8.3 | **NEW** peer dependency SDK 56 |

### ⚠️ Breaking Changes SDK 56 yang Perlu Diperhatikan

- **`@expo/vector-icons` DEPRECATED** → ganti ke `@react-native-vector-icons` (scoped packages)
- **Expo Router tidak lagi depend pada `react-navigation`** → jangan import dari `@react-navigation/*` langsung
- **`expo-av` sudah tidak digunakan** → pakai `expo-video` dan `expo-audio`
- **`react-native-reanimated` harus v4.x** (bukan v3)
- **`react-native-worklets`** wajib di-install sebagai peer dependency baru
- **New Architecture adalah satu-satunya pilihan** — Old Arch sudah tidak didukung sejak SDK 55
- **`expo/fetch`** menggantikan global `fetch` (bisa opt-out lewat env variable)

---

## 2. Setup Project

### 2.1 Prasyarat Sistem

```bash
# Pastikan Node.js versi yang benar (minimum v20.19.4)
node --version   # harus v20.19.4+

# Install / update Expo CLI
npm install -g expo-cli eas-cli
```

### 2.2 Inisialisasi Project

```bash
# Buat project baru dengan SDK 56
npx create-expo-app@latest AnimeApp --template blank-typescript

cd AnimeApp

# Verifikasi versi SDK
cat package.json | grep expo
# Harusnya: "expo": "~56.0.3"
```

### 2.3 Install Semua Dependency

```bash
# ============================================================
# NAVIGATION (Expo Router v4 — SDK 56 sudah bundled)
# ============================================================
npx expo install expo-router expo-linking expo-constants expo-status-bar

# ============================================================
# NATIVEWIND v4 (STABLE — direkomendasikan untuk production)
# ============================================================
npm install nativewind
npm install --save-dev tailwindcss@^3.4.17

# NativeWind v4 butuh peer ini:
npx expo install react-native-reanimated     # akan dapat ~4.3.1
npx expo install react-native-safe-area-context  # akan dapat ~5.7.0
npx expo install react-native-worklets       # NEW peer di SDK 56 (~0.8.3)

# ============================================================
# DATA FETCHING & STATE
# ============================================================
npm install @tanstack/react-query axios
npm install zustand
npm install react-native-mmkv

# ============================================================
# UI DEPENDENCIES (SDK 56 compatible)
# ============================================================
npx expo install react-native-gesture-handler   # ~2.31.1
npx expo install react-native-screens           # 4.25.2
npx expo install expo-image
npm install @shopify/flash-list

# ============================================================
# ICONS — @expo/vector-icons DEPRECATED di SDK 56
# Gunakan scoped packages dari react-native-vector-icons
# ============================================================
npm install @react-native-vector-icons/ionicons
npm install @react-native-vector-icons/material-icons
# Atau gunakan react-native-svg + library icon SVG

# ============================================================
# VIDEO PLAYER — expo-av DEPRECATED, gunakan expo-video
# ============================================================
npx expo install expo-video
npx expo install react-native-webview  # untuk embed/iframe

# ============================================================
# UTILITAS
# ============================================================
npm install date-fns use-debounce
npx expo install expo-secure-store
```

### 2.4 Konfigurasi `app.json`

```json
{
  "expo": {
    "name": "AnimeApp",
    "slug": "anime-app",
    "scheme": "animeapp",
    "version": "1.0.0",
    "orientation": "portrait",
    "backgroundColor": "#0f0f0f",
    "sdkVersion": "56.0.0",
    "platforms": ["ios", "android"],
    "plugins": [
      "expo-router",
      "expo-video",
      [
        "react-native-vector-icons",
        {
          "fonts": ["Ionicons.ttf", "MaterialIcons.ttf"]
        }
      ]
    ],
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0f0f0f"
      },
      "package": "com.yourname.animeapp"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.yourname.animeapp",
      "deploymentTarget": "16.4"
    }
  }
}
```

### 2.5 Konfigurasi `babel.config.js`

```js
// SDK 56 + NativeWind v4
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // react-native-worklets harus jadi plugin PERTAMA
      "react-native-worklets/plugin",
    ],
  };
};
```

> ⚠️ **SDK 56:** `react-native-worklets/plugin` harus selalu ada di Babel config.
> `react-native-reanimated/plugin` sudah tidak perlu di-declare manual (sudah dihandle worklets).

### 2.6 Konfigurasi `metro.config.js`

```js
// SDK 56 — gunakan getDefaultConfig dari expo/metro-config
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

### 2.7 `tsconfig.json` (TypeScript 6.0.3)

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.d.ts",
    "nativewind-env.d.ts"
  ]
}
```

### 2.8 `nativewind-env.d.ts`

```ts
/// <reference types="nativewind/types" />
```

---

## 3. Struktur Folder

```
AnimeApp/
├── app/                          # Expo Router v4 (screens)
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab navigator
│   │   ├── index.tsx             # Home
│   │   ├── search.tsx            # Pencarian
│   │   ├── schedule.tsx          # Jadwal
│   │   └── profile.tsx           # Profil & Watchlist
│   ├── anime/
│   │   └── [id].tsx              # Detail Anime
│   ├── series/
│   │   └── [id].tsx              # Detail Series
│   ├── film/
│   │   └── [id].tsx              # Detail Film
│   ├── episode/
│   │   └── [id].tsx              # Halaman Player
│   ├── genre/
│   │   └── [slug].tsx            # Anime by Genre
│   ├── catalog.tsx               # Catalog dengan filter
│   ├── _layout.tsx               # Root layout
│   └── +not-found.tsx
│
├── src/
│   ├── api/                      # Layer API
│   │   ├── client.ts             # Axios instance
│   │   ├── endpoints.ts          # Semua URL endpoint
│   │   └── services/
│   │       ├── animeService.ts
│   │       ├── searchService.ts
│   │       ├── episodeService.ts
│   │       ├── genreService.ts
│   │       └── scheduleService.ts
│   │
│   ├── components/               # Komponen reusable
│   │   ├── ui/
│   │   │   ├── AnimeCard.tsx
│   │   │   ├── EpisodeCard.tsx
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   ├── GenreBadge.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── player/
│   │   │   ├── VideoPlayer.tsx
│   │   │   ├── ServerSelector.tsx
│   │   │   └── EmbedPlayer.tsx
│   │   └── layout/
│   │       └── ScreenWrapper.tsx
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useAnimeDetail.ts
│   │   ├── useEpisode.ts
│   │   ├── useSearch.ts
│   │   ├── useGenre.ts
│   │   ├── useSchedule.ts
│   │   └── usePaginatedAnime.ts
│   │
│   ├── store/                    # Zustand stores
│   │   ├── watchlistStore.ts
│   │   ├── historyStore.ts
│   │   └── playerStore.ts
│   │
│   ├── types/                    # TypeScript types
│   │   ├── anime.ts
│   │   ├── episode.ts
│   │   ├── genre.ts
│   │   └── api.ts
│   │
│   └── utils/
│       ├── queryClient.ts
│       ├── storage.ts
│       └── helpers.ts
│
├── assets/
├── global.css                    # NativeWind entry point
├── tailwind.config.js
├── babel.config.js
├── metro.config.js
├── nativewind-env.d.ts
├── tsconfig.json
└── app.json
```

---

## 4. Konfigurasi NativeWind & Tema

### 4.1 `global.css` (NativeWind v4 — Tailwind CSS 3.x)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

> ℹ️ Ini adalah format NativeWind **v4 stable** (Tailwind CSS 3.x).
> Jika suatu saat migrasi ke NativeWind v5 (preview), syntax berubah ke `@import "tailwindcss"`.

### 4.2 `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan semua file app dan src
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Palet warna dark anime
        background: {
          DEFAULT: "#0f0f0f",
          card: "#1a1a2e",
          elevated: "#16213e",
        },
        primary: {
          DEFAULT: "#e94560",
          light: "#ff6b81",
          dark: "#c0392b",
        },
        accent: {
          DEFAULT: "#0f3460",
          light: "#533483",
        },
        surface: "#1e1e2e",
        border: "#2d2d3d",
        text: {
          primary: "#e2e8f0",
          secondary: "#94a3b8",
          muted: "#64748b",
        },
      },
    },
  },
  plugins: [],
};
```

### 4.3 Import di Root Layout

```tsx
// app/_layout.tsx — wajib import global.css di sini
import "../global.css";
```

---

## 5. Setup API Layer

### 5.1 `src/api/client.ts`

```ts
import axios from "axios";

// SDK 56: global fetch digantikan expo/fetch, tapi axios tetap berjalan normal
const BASE_URL = "https://api.example.com"; // Base URL Winbu API kamu

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      throw new Error(error.response.data?.message || "Server error");
    }
    throw new Error("Network error. Cek koneksi internet kamu.");
  }
);
```

### 5.2 `src/api/endpoints.ts`

```ts
export const ENDPOINTS = {
  // Home
  HOME: "/anime/winbu/home",

  // Pencarian — ?q=keyword&page=1
  SEARCH: "/anime/winbu/search",

  // Detail
  ANIME_DETAIL: (id: string) => `/anime/winbu/anime/${id}`,
  SERIES_DETAIL: (id: string) => `/anime/winbu/series/${id}`,
  FILM_DETAIL: (id: string) => `/anime/winbu/film/${id}`,
  EPISODE_DETAIL: (id: string) => `/anime/winbu/episode/${id}`,

  // Server Embed — ?post=ID&iframe=1&type=...
  SERVER: "/anime/winbu/server",

  // List Konten (support ?page=1)
  LIST_ANIME_DONGHUA: "/anime/winbu/animedonghua",
  LIST_FILM: "/anime/winbu/film",
  LIST_SERIES: "/anime/winbu/series",
  LIST_TVSHOW: "/anime/winbu/tvshow",
  LIST_OTHERS: "/anime/winbu/others",

  // Genre
  ALL_GENRES: "/anime/winbu/genres",
  ANIME_BY_GENRE: (slug: string) => `/anime/winbu/genre/${slug}`,

  // Catalog — ?title=&page=1&order=update&type=&status=
  CATALOG: "/anime/winbu/catalog",

  // Jadwal — ?day=all | senin | selasa | rabu | kamis | jumat | sabtu | minggu
  SCHEDULE: "/anime/winbu/schedule",

  // Kategori Khusus (semua support ?page=1)
  UPDATE: "/anime/winbu/update",
  LATEST: "/anime/winbu/latest",
  ONGOING: "/anime/winbu/ongoing",
  COMPLETED: "/anime/winbu/completed",
  POPULAR: "/anime/winbu/popular",

  // List Lengkap
  ALL_ANIME: "/anime/winbu/all-anime",
  ALL_ANIME_REVERSE: "/anime/winbu/all-anime-reverse",
  ANIME_LIST: "/anime/winbu/list", // ?order=popular&status=ongoing&type=movie
};
```

### 5.3 `src/api/services/animeService.ts`

```ts
import { apiClient } from "../client";
import { ENDPOINTS } from "../endpoints";

export const animeService = {
  getHome: () =>
    apiClient.get(ENDPOINTS.HOME),

  getAnimeDetail: (id: string) =>
    apiClient.get(ENDPOINTS.ANIME_DETAIL(id)),

  getSeriesDetail: (id: string) =>
    apiClient.get(ENDPOINTS.SERIES_DETAIL(id)),

  getFilmDetail: (id: string) =>
    apiClient.get(ENDPOINTS.FILM_DETAIL(id)),

  getEpisodeDetail: (id: string) =>
    apiClient.get(ENDPOINTS.EPISODE_DETAIL(id)),

  getServerEmbed: (params: { post: string; iframe: number; type: string }) =>
    apiClient.get(ENDPOINTS.SERVER, { params }),

  search: (query: string, page = 1) =>
    apiClient.get(ENDPOINTS.SEARCH, { params: { q: query, page } }),

  getOngoing: (page = 1) =>
    apiClient.get(ENDPOINTS.ONGOING, { params: { page } }),

  getCompleted: (page = 1) =>
    apiClient.get(ENDPOINTS.COMPLETED, { params: { page } }),

  getPopular: (page = 1) =>
    apiClient.get(ENDPOINTS.POPULAR, { params: { page } }),

  getLatest: (page = 1) =>
    apiClient.get(ENDPOINTS.LATEST, { params: { page } }),

  getAllGenres: () =>
    apiClient.get(ENDPOINTS.ALL_GENRES),

  getByGenre: (slug: string, page = 1) =>
    apiClient.get(ENDPOINTS.ANIME_BY_GENRE(slug), { params: { page } }),

  getSchedule: (day = "all") =>
    apiClient.get(ENDPOINTS.SCHEDULE, { params: { day } }),

  getCatalog: (params: {
    title?: string;
    page?: number;
    order?: string;
    type?: string;
    status?: string;
  }) => apiClient.get(ENDPOINTS.CATALOG, { params }),
};
```

### 5.4 `src/types/anime.ts`

```ts
export interface Anime {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  type: "anime" | "series" | "film" | "tvshow" | "donghua" | "others";
  status: "ongoing" | "completed";
  score?: number;
  episodes?: number;
  genres?: Genre[];
  synopsis?: string;
  year?: number;
  studio?: string;
  episodeList?: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  number: number;
  animeId: string;
  thumbnail?: string;
  aired?: string;
}

export interface EpisodeDetail {
  id: string;
  title: string;
  servers: StreamServer[];
  downloadLinks?: DownloadLink[];
  prevEpisode?: string;
  nextEpisode?: string;
}

export interface StreamServer {
  name: string;
  url: string;
  quality?: string;
  type?: "embed" | "direct";
  post?: string;
  iframe?: string;
}

export interface DownloadLink {
  quality: string;
  links: { server: string; url: string }[];
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
  };
}
```

---

## 6. Navigation Setup

### 6.1 `app/_layout.tsx` — Root Layout

```tsx
import "../global.css";
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { queryClient } from "../src/utils/queryClient";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" backgroundColor="#0f0f0f" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="anime/[id]"
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="series/[id]"
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="film/[id]"
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
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

### 6.2 `app/(tabs)/_layout.tsx` — Tab Navigator

```tsx
import { Tabs } from "expo-router";
// SDK 56: @expo/vector-icons DEPRECATED
// Gunakan scoped react-native-vector-icons
import Ionicons from "@react-native-vector-icons/ionicons";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({ name, color, size }: { name: IconName; color: string; size: number }) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1a1a2e",
          borderTopColor: "#2d2d3d",
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: "#e94560",
        tabBarInactiveTintColor: "#64748b",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Cari",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="search" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Jadwal",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
```

> ⚠️ **SDK 56:** Expo Router v4 **tidak lagi** bergantung pada `@react-navigation/*`.
> Jangan import komponen navigasi dari `@react-navigation/native` atau `@react-navigation/stack` dalam project Expo Router.

---

## 7. State Management

### 7.1 `src/utils/queryClient.ts`

```ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // Fresh 5 menit
      gcTime: 10 * 60 * 1000,         // Cache 10 menit
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 7.2 `src/utils/storage.ts`

```ts
import { MMKV } from "react-native-mmkv";

// react-native-mmkv berjalan lancar di New Architecture (SDK 56)
const mmkv = new MMKV();

export const storage = {
  getItem: (name: string): string | null => {
    return mmkv.getString(name) ?? null;
  },
  setItem: (name: string, value: string): void => {
    mmkv.set(name, value);
  },
  removeItem: (name: string): void => {
    mmkv.delete(name);
  },
};
```

### 7.3 `src/store/watchlistStore.ts`

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { storage } from "../utils/storage";
import type { Anime } from "../types/anime";

interface WatchlistState {
  watchlist: Anime[];
  addToWatchlist: (anime: Anime) => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      addToWatchlist: (anime) =>
        set((state) => ({
          watchlist: [...state.watchlist, anime],
        })),
      removeFromWatchlist: (id) =>
        set((state) => ({
          watchlist: state.watchlist.filter((a) => a.id !== id),
        })),
      isInWatchlist: (id) =>
        get().watchlist.some((a) => a.id === id),
    }),
    {
      name: "watchlist-storage",
      storage: createJSONStorage(() => storage),
    }
  )
);
```

### 7.4 `src/store/historyStore.ts`

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { storage } from "../utils/storage";

interface HistoryItem {
  animeId: string;
  episodeId: string;
  animeTitle: string;
  episodeTitle: string;
  thumbnail: string;
  watchedAt: number;
  progress?: number; // detik terakhir
}

interface HistoryState {
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
  getLastWatched: (animeId: string) => HistoryItem | undefined;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      addToHistory: (item) =>
        set((state) => {
          const filtered = state.history.filter(
            (h) => h.episodeId !== item.episodeId
          );
          return { history: [item, ...filtered].slice(0, 50) };
        }),
      clearHistory: () => set({ history: [] }),
      getLastWatched: (animeId) =>
        get().history.find((h) => h.animeId === animeId),
    }),
    {
      name: "history-storage",
      storage: createJSONStorage(() => storage),
    }
  )
);
```

---

## 8. Komponen Reusable

### 8.1 `src/components/ui/AnimeCard.tsx`

```tsx
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import type { Anime } from "../../types/anime";

interface Props {
  anime: Anime;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { card: "w-28", image: "h-40" },
  md: { card: "w-36", image: "h-52" },
  lg: { card: "w-44", image: "h-64" },
};

export function AnimeCard({ anime, size = "md" }: Props) {
  const handlePress = () => {
    const route =
      anime.type === "film" ? `/film/${anime.id}` : `/anime/${anime.id}`;
    router.push(route as any);
  };

  return (
    <Pressable onPress={handlePress} className={`${sizes[size].card} mr-3`}>
      <View className="relative">
        <Image
          source={{ uri: anime.thumbnail }}
          className={`w-full ${sizes[size].image} rounded-xl`}
          contentFit="cover"
          transition={200}
        />
        <View
          className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md ${
            anime.status === "ongoing" ? "bg-primary" : "bg-accent"
          }`}
        >
          <Text className="text-white text-[9px] font-bold uppercase">
            {anime.status === "ongoing" ? "Ongoing" : "Done"}
          </Text>
        </View>
      </View>
      <Text
        className="text-text-primary text-xs font-semibold mt-1.5 leading-4"
        numberOfLines={2}
      >
        {anime.title}
      </Text>
      {anime.score && (
        <Text className="text-yellow-400 text-[10px] mt-0.5">
          ⭐ {anime.score}
        </Text>
      )}
    </Pressable>
  );
}
```

### 8.2 `src/components/ui/SectionHeader.tsx`

```tsx
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import Ionicons from "@react-native-vector-icons/ionicons";

interface Props {
  title: string;
  href?: string;
}

export function SectionHeader({ title, href }: Props) {
  return (
    <View className="flex-row items-center justify-between px-4 mb-3">
      <View className="flex-row items-center gap-2">
        <View className="w-1 h-5 bg-primary rounded-full" />
        <Text className="text-text-primary text-base font-bold">{title}</Text>
      </View>
      {href && (
        <Pressable
          onPress={() => router.push(href as any)}
          className="flex-row items-center gap-1"
        >
          <Text className="text-primary text-xs font-semibold">Lihat Semua</Text>
          <Ionicons name="chevron-forward" size={14} color="#e94560" />
        </Pressable>
      )}
    </View>
  );
}
```

### 8.3 `src/components/ui/LoadingSpinner.tsx`

```tsx
import { ActivityIndicator, View } from "react-native";

export function LoadingSpinner({ fullScreen }: { fullScreen?: boolean }) {
  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }
  return (
    <View className="py-8 items-center">
      <ActivityIndicator size="large" color="#e94560" />
    </View>
  );
}
```

### 8.4 `src/components/ui/GenreBadge.tsx`

```tsx
import { Pressable, Text } from "react-native";
import { router } from "expo-router";
import type { Genre } from "../../types/anime";

interface Props {
  genre: Genre;
  selected?: boolean;
  onPress?: () => void;
}

export function GenreBadge({ genre, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress ?? (() => router.push(`/genre/${genre.slug}` as any))}
      className={`px-3 py-1.5 rounded-full mr-2 mb-2 border ${
        selected
          ? "bg-primary border-primary"
          : "bg-surface border-border"
      }`}
    >
      <Text
        className={`text-xs font-semibold ${
          selected ? "text-white" : "text-text-secondary"
        }`}
      >
        {genre.name}
      </Text>
    </Pressable>
  );
}
```

---

## 9. Implementasi Screen per Screen

### 9.1 Home Screen `app/(tabs)/index.tsx`

```tsx
import { ScrollView, View, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { animeService } from "../../src/api/services/animeService";
import { HeroBanner } from "../../src/components/ui/HeroBanner";
import { SectionHeader } from "../../src/components/ui/SectionHeader";
import { AnimeCard } from "../../src/components/ui/AnimeCard";
import { LoadingSpinner } from "../../src/components/ui/LoadingSpinner";
import { FlashList } from "@shopify/flash-list";

const SECTIONS = [
  { title: "🔥 Sedang Populer", key: "popular", href: "/catalog?order=popular" },
  { title: "📺 Sedang Tayang", key: "ongoing", href: "/catalog?status=ongoing" },
  { title: "✅ Selesai", key: "completed", href: "/catalog?status=completed" },
  { title: "🆕 Terbaru", key: "latest", href: "/catalog?order=latest" },
  { title: "🎬 Film Terbaru", key: "films", href: "/catalog?type=film" },
];

export default function HomeScreen() {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["home"],
    queryFn: animeService.getHome,
  });

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#e94560"
          />
        }
      >
        {data?.hero && <HeroBanner anime={data.hero} />}

        {SECTIONS.map((section) =>
          data?.[section.key]?.length > 0 ? (
            <View key={section.key} className="mt-6">
              <SectionHeader title={section.title} href={section.href} />
              <FlashList
                data={data[section.key]}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                renderItem={({ item }) => <AnimeCard anime={item} />}
                estimatedItemSize={144}
                keyExtractor={(item: any) => item.id}
              />
            </View>
          ) : null
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
```

### 9.2 Detail Anime `app/anime/[id].tsx`

```tsx
import { ScrollView, View, Text, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { animeService } from "../../src/api/services/animeService";
import { LoadingSpinner } from "../../src/components/ui/LoadingSpinner";
import { GenreBadge } from "../../src/components/ui/GenreBadge";
import { useWatchlistStore } from "../../src/store/watchlistStore";

export default function AnimeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();

  const { data, isLoading } = useQuery({
    queryKey: ["anime", id],
    queryFn: () => animeService.getAnimeDetail(id),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner fullScreen />;

  const anime = data?.data;
  const inWatchlist = isInWatchlist(id);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View className="relative">
          <Image
            source={{ uri: anime?.thumbnail }}
            className="w-full h-64"
            contentFit="cover"
          />
          <Pressable
            onPress={() => router.back()}
            className="absolute top-4 left-4 bg-black/50 p-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </Pressable>
        </View>

        <View className="px-4 pt-4">
          {/* Judul + Watchlist */}
          <View className="flex-row justify-between items-start">
            <Text className="text-text-primary text-xl font-bold flex-1 mr-3">
              {anime?.title}
            </Text>
            <Pressable
              onPress={() =>
                inWatchlist
                  ? removeFromWatchlist(id)
                  : addToWatchlist(anime)
              }
              className={`p-2 rounded-lg ${
                inWatchlist
                  ? "bg-primary"
                  : "bg-surface border border-border"
              }`}
            >
              <Ionicons
                name={inWatchlist ? "bookmark" : "bookmark-outline"}
                size={20}
                color={inWatchlist ? "white" : "#94a3b8"}
              />
            </Pressable>
          </View>

          {/* Info */}
          <View className="flex-row gap-4 mt-3 flex-wrap">
            {anime?.score && (
              <Text className="text-yellow-400 text-sm">⭐ {anime.score}</Text>
            )}
            {anime?.year && (
              <Text className="text-text-secondary text-sm">📅 {anime.year}</Text>
            )}
            {anime?.episodes && (
              <Text className="text-text-secondary text-sm">
                🎬 {anime.episodes} ep
              </Text>
            )}
          </View>

          {/* Genre */}
          <View className="flex-row flex-wrap mt-3">
            {anime?.genres?.map((g) => (
              <GenreBadge key={g.id} genre={g} />
            ))}
          </View>

          {/* Sinopsis */}
          {anime?.synopsis && (
            <View className="mt-4">
              <Text className="text-text-primary font-bold mb-2">Sinopsis</Text>
              <Text className="text-text-secondary text-sm leading-6">
                {anime.synopsis}
              </Text>
            </View>
          )}

          {/* Tonton */}
          {anime?.episodeList?.[0] && (
            <Pressable
              onPress={() =>
                router.push(`/episode/${anime.episodeList![0].id}` as any)
              }
              className="bg-primary mt-4 py-3 rounded-xl flex-row items-center justify-center gap-2"
            >
              <Ionicons name="play-circle" size={20} color="white" />
              <Text className="text-white font-bold text-sm">
                Tonton Episode 1
              </Text>
            </Pressable>
          )}

          {/* Daftar Episode */}
          <View className="mt-6">
            <Text className="text-text-primary font-bold mb-3">
              Daftar Episode ({anime?.episodeList?.length ?? 0})
            </Text>
            {anime?.episodeList?.map((ep) => (
              <Pressable
                key={ep.id}
                onPress={() => router.push(`/episode/${ep.id}` as any)}
                className="flex-row items-center py-3 border-b border-border"
              >
                <Text className="text-text-secondary text-sm w-8">
                  {ep.number}
                </Text>
                <Text className="text-text-primary text-sm flex-1">
                  {ep.title}
                </Text>
                <Ionicons name="play" size={14} color="#e94560" />
              </Pressable>
            ))}
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
```

### 9.3 Search Screen `app/(tabs)/search.tsx`

```tsx
import { useState } from "react";
import { View, TextInput, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import Ionicons from "@react-native-vector-icons/ionicons";
import { animeService } from "../../src/api/services/animeService";
import { AnimeCard } from "../../src/components/ui/AnimeCard";
import { LoadingSpinner } from "../../src/components/ui/LoadingSpinner";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const debounce = useDebouncedCallback(
    (value: string) => setDebouncedQuery(value),
    500
  );

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => animeService.search(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  const results = data?.data ?? [];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 pt-2 pb-4">
        <View className="flex-row items-center bg-surface border border-border rounded-xl px-3 gap-2">
          <Ionicons name="search" size={18} color="#64748b" />
          <TextInput
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              debounce(text);
            }}
            placeholder="Cari anime, film, series..."
            placeholderTextColor="#64748b"
            className="flex-1 py-3 text-text-primary text-sm"
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Ionicons
              name="close-circle"
              size={18}
              color="#64748b"
              onPress={() => {
                setQuery("");
                setDebouncedQuery("");
              }}
            />
          )}
        </View>
      </View>

      {isLoading && <LoadingSpinner />}

      {debouncedQuery.length < 2 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl mb-4">🎌</Text>
          <Text className="text-text-secondary text-sm text-center px-8">
            Ketik minimal 2 karakter untuk mencari
          </Text>
        </View>
      ) : results.length === 0 && !isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl mb-4">🔍</Text>
          <Text className="text-text-secondary text-sm">
            Tidak ada hasil untuk "{debouncedQuery}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          numColumns={3}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          columnWrapperStyle={{ gap: 8 }}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => <AnimeCard anime={item} size="sm" />}
        />
      )}
    </SafeAreaView>
  );
}
```

### 9.4 Schedule Screen `app/(tabs)/schedule.tsx`

```tsx
import { useState } from "react";
import { View, Text, ScrollView, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { animeService } from "../../src/api/services/animeService";
import { AnimeCard } from "../../src/components/ui/AnimeCard";
import { LoadingSpinner } from "../../src/components/ui/LoadingSpinner";

const DAYS = [
  { key: "senin", label: "Sen" },
  { key: "selasa", label: "Sel" },
  { key: "rabu", label: "Rab" },
  { key: "kamis", label: "Kam" },
  { key: "jumat", label: "Jum" },
  { key: "sabtu", label: "Sab" },
  { key: "minggu", label: "Min" },
];

// Konversi nama hari JS ke format API
const JS_TO_API_DAY: Record<number, string> = {
  0: "minggu", 1: "senin", 2: "selasa", 3: "rabu",
  4: "kamis", 5: "jumat", 6: "sabtu",
};

export default function ScheduleScreen() {
  const today = JS_TO_API_DAY[new Date().getDay()];
  const [activeDay, setActiveDay] = useState(today);

  const { data, isLoading } = useQuery({
    queryKey: ["schedule", activeDay],
    queryFn: () => animeService.getSchedule(activeDay),
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Text className="text-text-primary text-lg font-bold px-4 pt-4 mb-4">
        📅 Jadwal Rilis
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="mb-4 max-h-12"
      >
        {DAYS.map((day) => (
          <Pressable
            key={day.key}
            onPress={() => setActiveDay(day.key)}
            className={`w-12 h-10 rounded-xl mr-2 items-center justify-center ${
              activeDay === day.key
                ? "bg-primary"
                : "bg-surface border border-border"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeDay === day.key ? "text-white" : "text-text-secondary"
              }`}
            >
              {day.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={data?.data ?? []}
          numColumns={3}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24 }}
          columnWrapperStyle={{ gap: 8 }}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => <AnimeCard anime={item} size="sm" />}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-4xl mb-3">😴</Text>
              <Text className="text-text-secondary text-sm">
                Tidak ada jadwal hari ini
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
```

---

## 10. Video Player & Streaming

### 10.1 Episode Screen `app/episode/[id].tsx`

```tsx
import { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import Ionicons from "@react-native-vector-icons/ionicons";
import { animeService } from "../../src/api/services/animeService";
import { VideoPlayer } from "../../src/components/player/VideoPlayer";
import { EmbedPlayer } from "../../src/components/player/EmbedPlayer";
import { ServerSelector } from "../../src/components/player/ServerSelector";
import { LoadingSpinner } from "../../src/components/ui/LoadingSpinner";
import type { StreamServer } from "../../src/types/anime";

export default function EpisodeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeServer, setActiveServer] = useState<StreamServer | null>(null);
  const [useEmbed, setUseEmbed] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["episode", id],
    queryFn: () => animeService.getEpisodeDetail(id),
    enabled: !!id,
  });

  const episode = data?.data;

  useEffect(() => {
    if (episode?.servers?.length) {
      const first = episode.servers[0];
      setActiveServer(first);
      setUseEmbed(first.type === "embed");
    }
  }, [episode]);

  const handleServerSelect = (server: StreamServer) => {
    setActiveServer(server);
    setUseEmbed(server.type === "embed");
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <View className="flex-1 bg-background">
      <Pressable
        onPress={() => router.back()}
        className="absolute top-12 left-4 z-10 bg-black/60 p-2 rounded-full"
      >
        <Ionicons name="close" size={20} color="white" />
      </Pressable>

      {/* Player */}
      <View className="w-full aspect-video bg-black">
        {activeServer &&
          (useEmbed ? (
            <EmbedPlayer url={activeServer.url} />
          ) : (
            <VideoPlayer uri={activeServer.url} />
          ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          <Text className="text-text-primary font-bold text-base">
            {episode?.title}
          </Text>

          {/* Navigasi */}
          <View className="flex-row gap-3 mt-3">
            {episode?.prevEpisode && (
              <Pressable
                onPress={() =>
                  router.replace(`/episode/${episode.prevEpisode}` as any)
                }
                className="flex-1 bg-surface border border-border py-2.5 rounded-xl flex-row items-center justify-center gap-1"
              >
                <Ionicons name="chevron-back" size={16} color="#94a3b8" />
                <Text className="text-text-secondary text-sm font-semibold">
                  Sebelumnya
                </Text>
              </Pressable>
            )}
            {episode?.nextEpisode && (
              <Pressable
                onPress={() =>
                  router.replace(`/episode/${episode.nextEpisode}` as any)
                }
                className="flex-1 bg-primary py-2.5 rounded-xl flex-row items-center justify-center gap-1"
              >
                <Text className="text-white text-sm font-bold">Berikutnya</Text>
                <Ionicons name="chevron-forward" size={16} color="white" />
              </Pressable>
            )}
          </View>

          {/* Server Selector */}
          {episode?.servers && (
            <ServerSelector
              servers={episode.servers}
              activeServer={activeServer}
              onSelect={handleServerSelect}
            />
          )}

          {/* Download */}
          {episode?.downloadLinks?.map((dl) => (
            <View key={dl.quality} className="mt-4">
              <Text className="text-text-secondary text-xs mb-2 uppercase tracking-wide">
                ⬇️ {dl.quality}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {dl.links.map((link) => (
                  <Pressable
                    key={link.server}
                    className="px-3 py-1.5 bg-surface border border-border rounded-lg"
                  >
                    <Text className="text-text-secondary text-xs">
                      {link.server}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
```

### 10.2 `src/components/player/VideoPlayer.tsx`

```tsx
import { View } from "react-native";
// SDK 56: gunakan expo-video (bukan expo-av yang deprecated)
import { VideoView, useVideoPlayer } from "expo-video";

interface Props {
  uri: string;
  onEnd?: () => void;
}

export function VideoPlayer({ uri, onEnd }: Props) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    p.play();
  });

  return (
    <View className="w-full aspect-video bg-black">
      <VideoView
        player={player}
        style={{ flex: 1 }}
        allowsFullscreen
        allowsPictureInPicture
        contentFit="contain"
        nativeControls
      />
    </View>
  );
}
```

> ⚠️ **SDK 56:** `expo-av` sudah deprecated. Selalu gunakan `expo-video` untuk video dan `expo-audio` untuk audio.

### 10.3 `src/components/player/EmbedPlayer.tsx`

```tsx
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

interface Props {
  url: string;
}

export function EmbedPlayer({ url }: Props) {
  return (
    <View className="w-full aspect-video bg-black">
      <WebView
        source={{ uri: url }}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        style={{ backgroundColor: "#000" }}
        renderLoading={() => (
          <View className="absolute inset-0 items-center justify-center bg-black">
            <ActivityIndicator size="large" color="#e94560" />
          </View>
        )}
        startInLoadingState
      />
    </View>
  );
}
```

### 10.4 `src/components/player/ServerSelector.tsx`

```tsx
import { View, Text, Pressable, ScrollView } from "react-native";
import type { StreamServer } from "../../types/anime";

interface Props {
  servers: StreamServer[];
  activeServer: StreamServer | null;
  onSelect: (server: StreamServer) => void;
}

export function ServerSelector({ servers, activeServer, onSelect }: Props) {
  return (
    <View className="mt-4">
      <Text className="text-text-primary font-bold mb-3">🖥️ Pilih Server</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {servers.map((server, idx) => (
          <Pressable
            key={`${server.name}-${idx}`}
            onPress={() => onSelect(server)}
            className={`px-4 py-2 rounded-xl border ${
              activeServer?.name === server.name
                ? "bg-primary border-primary"
                : "bg-surface border-border"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                activeServer?.name === server.name
                  ? "text-white"
                  : "text-text-secondary"
              }`}
            >
              {server.name}
            </Text>
            {server.quality && (
              <Text className="text-[10px] text-text-muted mt-0.5">
                {server.quality}
              </Text>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
```

---

## 11. Fitur Tambahan

### 11.1 Infinite Scroll `src/hooks/usePaginatedAnime.ts`

```ts
import { useInfiniteQuery } from "@tanstack/react-query";

export function usePaginatedAnime(
  queryKey: string[],
  fetchFn: (page: number) => Promise<any>
) {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => fetchFn(pageParam as number),
    getNextPageParam: (lastPage: any) =>
      lastPage?.pagination?.hasNext
        ? lastPage.pagination.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });
}

// Contoh penggunaan di screen genre/catalog:
//
// const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
//   usePaginatedAnime(
//     ["ongoing"],
//     (page) => animeService.getOngoing(page)
//   );
//
// const allData = data?.pages.flatMap((p) => p.data) ?? [];
```

### 11.2 Catalog Screen `app/catalog.tsx`

```tsx
// Filter: order (update/popular/latest), status (ongoing/completed), type (movie/series)
// Gunakan endpoint: GET /anime/winbu/catalog?title=&page=1&order=update&type=&status=
//
// Implementasi:
// - TextInput untuk search by title
// - Pressable pills untuk order, status, type
// - FlashList dengan infinite scroll (usePaginatedAnime)
// - Gunakan @expo/ui BottomSheet untuk filter drawer (drop-in replacement di SDK 56)
```

### 11.3 Genre Screen `app/genre/[slug].tsx`

```tsx
// Gunakan endpoint: GET /anime/winbu/genre/:slug?page=1
// Implementasi:
// - useLocalSearchParams untuk ambil slug
// - usePaginatedAnime untuk infinite scroll
// - FlashList numColumns={3} dengan load more saat onEndReached
```

---

## 12. Testing & Build

### 12.1 Jalankan Development

```bash
# Clear cache dulu (disarankan setelah perubahan config)
npx expo start --clear

# Android
npx expo run:android

# iOS (butuh Xcode 26.4+ untuk SDK 56)
npx expo run:ios
```

> **SDK 56 tip:** `expo start` sekarang ~5x lebih cepat dari SDK sebelumnya.
> Juga, Metro bundling cold start 20-50% lebih cepat.

### 12.2 Cek Kompatibilitas Dependency

```bash
# Selalu jalankan ini setelah install package baru di SDK 56
npx expo-doctor

# Atau fix otomatis dengan expo install --fix
npx expo install --fix
```

### 12.3 Build dengan EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Konfigurasi (generate eas.json)
eas build:configure

# Build APK preview (Android)
eas build --platform android --profile preview

# Build AAB production (Play Store)
eas build --platform android --profile production

# Build IPA (iOS — butuh Apple Developer account)
eas build --platform ios --profile production
```

### 12.4 `eas.json`

```json
{
  "cli": { "version": ">= 14.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

---

## 13. Roadmap Visual

```
FASE 1 — Foundation (Minggu 1-2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ✅ Init Expo SDK 56 (RN 0.85, React 19.2)
 ✅ Install NativeWind v4 + react-native-worklets
 ✅ Setup Expo Router v4 (tanpa react-navigation)
 ✅ Setup ikon: @react-native-vector-icons/ionicons
 ✅ Konfigurasi tema dark anime (tailwind.config.js)
 ✅ Setup Axios + TanStack Query v5
 ✅ Buat semua TypeScript types (anime, episode, genre)
 ✅ Mapping semua 24 endpoint Winbu API

FASE 2 — Core Screens (Minggu 3-4)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ✅ Tab Navigator (Home, Search, Schedule, Profile)
 ✅ Komponen reusable (AnimeCard, HeroBanner, dll)
 ✅ Home Screen (hero + 5 section horisontal)
 ✅ Search Screen (debounce 500ms, grid 3 kolom)
 ✅ Schedule Screen (day picker + list anime)

FASE 3 — Detail & Player (Minggu 5-6)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ✅ Detail Anime / Series / Film Screen
 ✅ VideoPlayer: expo-video (bukan expo-av)
 ✅ EmbedPlayer: WebView fallback untuk iframe
 ✅ ServerSelector komponen
 ✅ Navigasi prev/next episode
 ✅ Download links section

FASE 4 — Discovery (Minggu 7)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ✅ Genre Screen + usePaginatedAnime (infinite scroll)
 ✅ Catalog Screen (filter: order, status, type)
 ✅ List ongoing / completed / popular / latest

FASE 5 — User Features (Minggu 8)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ✅ Watchlist (Zustand + MMKV)
 ✅ History tonton
 ✅ Profile Screen
 ✅ Error states & Empty states

FASE 6 — Polish & Build (Minggu 9-10)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ✅ Animasi transisi (Reanimated v4 — SDK 56)
 ✅ Pull-to-refresh di semua list screen
 ✅ Optimasi: FlashList, expo-image caching
 ✅ expo-doctor untuk validasi semua dependency
 ✅ Testing di device fisik Android & iOS
 ✅ Build APK dengan EAS Build
```

---

## 💡 Tips Khusus SDK 56

**Migrasi Icons:**
```tsx
// ❌ LAMA — deprecated di SDK 56
import { Ionicons } from "@expo/vector-icons";

// ✅ BARU — scoped package
import Ionicons from "@react-native-vector-icons/ionicons";
```

**Worklets di Babel:**
```js
// babel.config.js — urutan plugin penting!
plugins: [
  "react-native-worklets/plugin",  // ← harus PERTAMA
  // plugin lain di bawahnya
],
```

**Cek dependency secara berkala:**
```bash
npx expo-doctor         # deteksi masalah kompatibilitas
npx expo install --fix  # auto-fix versi dependency
```

**Performa FlashList vs FlatList:**
- `FlashList` dari Shopify jauh lebih cepat untuk list panjang
- Set `estimatedItemSize` yang akurat untuk performa optimal
- Gunakan `keyExtractor` yang stabil (jangan pakai index)

**expo-video API penting:**
```tsx
// Cek apakah URL bisa diputar langsung
// .mp4, .mkv, .m3u8 (HLS) → VideoPlayer
// iframe/embed URL → EmbedPlayer (WebView)
```

---

*Dibuat untuk React Native + Expo SDK 56 + NativeWind v4 + Winbu API*
*SDK 56: React Native 0.85 · React 19.2 · Hermes V1 · New Architecture only*