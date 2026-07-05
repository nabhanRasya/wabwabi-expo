# New Anime API — Implementation Guide

## Overview

Dokumen ini mendeskripsikan endpoint API "baru" (lihat daftar di bawah) dan cara
mengintegrasikannya ke dalam project `wabwabi-expo` yang **sudah** memiliki
implementasi API lama (lihat `API-Endpoint-Implementation.md`).

API ini **tidak menggantikan** API lama — ia adalah sumber data terpisah
(kemungkinan backend/provider berbeda). Karena itu, implementasi harus dibuat
**terisolasi** (client, service, types, hooks sendiri) agar tidak menabrak atau
mengubah perilaku kode API lama yang sudah berjalan.

> ⚠️ **Perlu dikonfirmasi sebelum implementasi final:**
>
> - Base URL production API ini (belum diketahui — isi di `client.ts` baru, lihat placeholder `NEW_API_BASE_URL`).
> - Bentuk asli JSON response tiap endpoint (contoh di bawah adalah **asumsi struktur umum**, bukan hasil observasi nyata). Sebelum implementasi final, agent **wajib** memanggil endpoint sungguhan (atau minta contoh response dari user) untuk memverifikasi field-field aktual, lalu menyesuaikan types di `src/types/newAnimeApi.ts`.

---

## Perbedaan Kunci vs API Lama

Ini bagian paling penting untuk agent — API baru **tidak** mengikuti pola yang
sama seperti API lama pada beberapa hal:

| Aspek                  | API Lama (`animeServices.ts`)                                                                                                                      | API Baru                                                                                                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base path              | `/` (root langsung ke fitur)                                                                                                                       | Semua endpoint diprefix `/anime/...`                                                                                                                                                                 |
| Parameter pencarian    | Query string `?q=keyword`                                                                                                                          | **Path param**: `/anime/search/:keyword`                                                                                                                                                             |
| Parameter detail anime | Query/berbeda per konten (`ANIME_DETAIL(id)`, `SERIES_DETAIL(id)`, `FILM_DETAIL(id)` — 3 tipe)                                                     | **Satu endpoint** untuk semua: `/anime/anime/:slug`                                                                                                                                                  |
| Parameter genre        | `ANIME_BY_GENRE(slug)` + `?page=`                                                                                                                  | Sama pola (`/anime/genre/:slug?page=`), tapi ada endpoint tambahan `/anime/genre` untuk list semua genre                                                                                             |
| Server/embed streaming | `GET /server` dengan query `post`, `type`, `nume`, `iframe`                                                                                        | **Path param** `serverId`: `/anime/server/:serverId` (asumsi `serverId` didapat dari response detail episode — perlu diverifikasi)                                                                   |
| Pagination             | Semua endpoint list pakai `?page=1` default                                                                                                        | Hanya sebagian endpoint (`complete-anime`, `ongoing-anime`, `genre/:slug`) yang punya `?page=` opsional; endpoint lain (`home`, `schedule`, `unlimited`, `search`) tidak disebutkan punya pagination |
| Response shape         | Response interceptor mengembalikan `response.data` langsung, lalu dinormalisasi via `getListItems()` (`response?.results ?? response?.data ?? []`) | **Belum diketahui** — jangan asumsikan field `results`/`data` sama; verifikasi dulu                                                                                                                  |
| Error format           | `{ message: string }` di body error                                                                                                                | **Belum diketahui** — perlu penanganan fallback yang sama amannya                                                                                                                                    |

**Implikasi implementasi:** jangan menambahkan method-method ini ke
`animeService` yang sudah ada. Buat **service, client, dan types baru** yang
terpisah, supaya:

1. Perbedaan bentuk response tidak memaksa refactor `getListItems()` yang dipakai fitur lama.
2. Jika base URL / auth API baru berubah, tidak menyentuh konfigurasi API lama.
3. Kedua sumber data bisa dipakai bersamaan di satu screen tanpa konflik query key React Query (namespace key berbeda, lihat bagian Hooks).

---

## Daftar Endpoint

Base path: `/anime` (asumsi ditambahkan di atas base URL baru; sesuaikan bila
ternyata base URL sudah termasuk `/anime`).

| Fitur                            | Method & Path                 | Query Params                   | Contoh                                              |
| -------------------------------- | ----------------------------- | ------------------------------ | --------------------------------------------------- |
| Halaman Home                     | `GET /anime/home`             | –                              | –                                                   |
| Jadwal Rilis Anime               | `GET /anime/schedule`         | –                              | –                                                   |
| Detail Lengkap Anime             | `GET /anime/anime/:slug`      | –                              | `/anime/anime/enen-shouboutai-season-3-p2-sub-indo` |
| Anime Tamat per Halaman          | `GET /anime/complete-anime`   | `page` (opsional, default `1`) | `/anime/complete-anime?page=1`                      |
| Anime yang Sedang Tayang         | `GET /anime/ongoing-anime`    | `page` (opsional, default `1`) | `/anime/ongoing-anime?page=1`                       |
| Daftar Semua Genre               | `GET /anime/genre`            | –                              | –                                                   |
| Daftar Anime Berdasarkan Genre   | `GET /anime/genre/:slug`      | `page` (opsional, default `1`) | `/anime/genre/action?page=1`                        |
| Detail & Link Nonton per Episode | `GET /anime/episode/:slug`    | –                              | `/anime/episode/mebsn-episode-1-sub-indo`           |
| Pencarian Anime                  | `GET /anime/search/:keyword`  | –                              | `/anime/search/boruto`                              |
| Download Batch Anime             | `GET /anime/batch/:slug`      | –                              | `/anime/batch/jshk-s2-batch-sub-indo`               |
| Ambil URL Stream Server          | `GET /anime/server/:serverId` | –                              | `/anime/server/187226-0-720p`                       |
| All Anime (Unlimited)            | `GET /anime/unlimited`        | –                              | –                                                   |

---

## 1. Endpoint Constants

Tambahkan file baru, jangan modifikasi `src/api/endpoints.ts` yang lama.

`src/api/newAnimeEndpoints.ts`

```ts
export const NEW_ANIME_ENDPOINTS = {
  HOME: "/anime/home",
  SCHEDULE: "/anime/schedule",
  ANIME_DETAIL: (slug: string) => `/anime/anime/${slug}`,
  COMPLETE_ANIME: "/anime/complete-anime",
  ONGOING_ANIME: "/anime/ongoing-anime",
  ALL_GENRE: "/anime/genre",
  ANIME_BY_GENRE: (slug: string) => `/anime/genre/${slug}`,
  EPISODE_DETAIL: (slug: string) => `/anime/episode/${slug}`,
  SEARCH: (keyword: string) => `/anime/search/${keyword}`,
  BATCH: (slug: string) => `/anime/batch/${slug}`,
  SERVER: (serverId: string) => `/anime/server/${serverId}`,
  UNLIMITED: "/anime/unlimited",
} as const;
```

> Catatan: karena `keyword`, `slug`, dan `serverId` masuk ke **path**, pastikan
> di-encode dengan `encodeURIComponent()` sebelum disisipkan ke template
> string — terutama untuk `keyword` pencarian yang bisa berisi spasi/simbol.

---

## 2. HTTP Client Baru

`src/api/newAnimeClient.ts`

```ts
import { AxiosError, AxiosResponse, create } from "axios";

// TODO: ganti dengan base URL production API baru setelah dikonfirmasi.
const NEW_API_BASE_URL = "https://NEW_API_BASE_URL/";

export const newAnimeApiClient = create({
  baseURL: NEW_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

newAnimeApiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response) {
      throw new Error(error.response.data?.message || "Server Error");
    }
    throw new Error("Network error. Cek koneksi internet kamu.");
  },
);
```

Client ini sengaja dibuat **terpisah** dari `apiClient` lama walau
konfigurasinya (timeout, error normalization) dibuat identik untuk konsistensi
UX error. Jika ternyata API baru punya format error berbeda (mis. `{ error: string }`
bukan `{ message: string }`), sesuaikan interceptor ini — jangan sesuaikan
interceptor API lama.

---

## 3. Service Layer Baru

`src/api/services/newAnimeService.ts`

```ts
import { newAnimeApiClient } from "../newAnimeClient";
import { NEW_ANIME_ENDPOINTS } from "../newAnimeEndpoints";
import type { AxiosRequestConfig } from "axios";
import type {
  NewAnimeListResponse,
  NewAnimeDetailResponse,
  NewEpisodeResponse,
  NewGenreListResponse,
  NewServerResponse,
} from "../../types/newAnimeApi";

async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await newAnimeApiClient.get<T>(url, config);
  return response as unknown as T;
}

export const newAnimeService = {
  getHome: () => get<NewAnimeListResponse>(NEW_ANIME_ENDPOINTS.HOME),

  getSchedule: () => get<NewAnimeListResponse>(NEW_ANIME_ENDPOINTS.SCHEDULE),

  getAnimeDetail: (slug: string) =>
    get<NewAnimeDetailResponse>(
      NEW_ANIME_ENDPOINTS.ANIME_DETAIL(encodeURIComponent(slug)),
    ),

  getCompleteAnime: (page = 1) =>
    get<NewAnimeListResponse>(NEW_ANIME_ENDPOINTS.COMPLETE_ANIME, {
      params: { page },
    }),

  getOngoingAnime: (page = 1) =>
    get<NewAnimeListResponse>(NEW_ANIME_ENDPOINTS.ONGOING_ANIME, {
      params: { page },
    }),

  getAllGenre: () => get<NewGenreListResponse>(NEW_ANIME_ENDPOINTS.ALL_GENRE),

  getAnimeByGenre: (slug: string, page = 1) =>
    get<NewAnimeListResponse>(
      NEW_ANIME_ENDPOINTS.ANIME_BY_GENRE(encodeURIComponent(slug)),
      { params: { page } },
    ),

  getEpisodeDetail: (slug: string) =>
    get<NewEpisodeResponse>(
      NEW_ANIME_ENDPOINTS.EPISODE_DETAIL(encodeURIComponent(slug)),
    ),

  search: (keyword: string) =>
    get<NewAnimeListResponse>(
      NEW_ANIME_ENDPOINTS.SEARCH(encodeURIComponent(keyword)),
    ),

  getBatch: (slug: string) =>
    get<NewAnimeDetailResponse>(
      NEW_ANIME_ENDPOINTS.BATCH(encodeURIComponent(slug)),
    ),

  getServerUrl: (serverId: string) =>
    get<NewServerResponse>(
      NEW_ANIME_ENDPOINTS.SERVER(encodeURIComponent(serverId)),
    ),

  getUnlimited: () => get<NewAnimeListResponse>(NEW_ANIME_ENDPOINTS.UNLIMITED),
};
```

Perhatikan: **tidak ada** `search(query, page)` dua-parameter seperti API lama,
karena endpoint baru untuk search tidak disebutkan mendukung `page`. Jika
ternyata backend mendukungnya lewat query string, tambahkan `params: { page }`
setelah verifikasi.

---

## 4. Types (placeholder — wajib diverifikasi)

`src/types/newAnimeApi.ts`

```ts
// NOTE: struktur di bawah adalah tebakan awal berdasarkan pola umum API anime.
// Ganti field sesuai response asli sebelum dipakai di production.

export interface NewAnimeItem {
  slug: string;
  title: string;
  poster?: string;
  episode?: string;
  status?: string;
}

export interface NewAnimeListResponse {
  data?: NewAnimeItem[];
  results?: NewAnimeItem[];
  pagination?: {
    current_page: number;
    last_visible_page?: number;
    has_next_page?: boolean;
  };
}

export interface NewAnimeDetailResponse {
  slug: string;
  title: string;
  synopsis?: string;
  genres?: { slug: string; name: string }[];
  episode_list?: { slug: string; title: string }[];
}

export interface NewEpisodeResponse {
  slug: string;
  title: string;
  servers?: { id: string; name: string }[];
  download_urls?: Record<string, { server: string; url: string }[]>;
}

export interface NewGenreListResponse {
  genres: { slug: string; name: string }[];
}

export interface NewServerResponse {
  url: string;
}
```

---

## 5. React Query Hooks Baru

Gunakan **query key prefix berbeda** (`"newApi"`) supaya tidak bentrok dengan
cache hooks API lama (`"search"`, `"catalog"`, `"schedule"`, dst).

`src/hooks/useNewAnimeSearch.ts`

```ts
import { useQuery } from "@tanstack/react-query";
import { newAnimeService } from "../api/services/newAnimeService";

export function useNewAnimeSearch(keyword: string) {
  const trimmed = keyword.trim();

  return useQuery({
    enabled: trimmed.length >= 2,
    queryFn: () => newAnimeService.search(trimmed),
    queryKey: ["newApi", "search", trimmed],
  });
}
```

`src/hooks/useNewAnimeOngoing.ts`

```ts
import { useQuery } from "@tanstack/react-query";
import { newAnimeService } from "../api/services/newAnimeService";

export function useNewAnimeOngoing(page = 1) {
  return useQuery({
    queryFn: () => newAnimeService.getOngoingAnime(page),
    queryKey: ["newApi", "ongoing", page],
  });
}
```

`src/hooks/useNewAnimeDetail.ts`

```ts
import { useQuery } from "@tanstack/react-query";
import { newAnimeService } from "../api/services/newAnimeService";

export function useNewAnimeDetail(slug: string) {
  return useQuery({
    enabled: !!slug,
    queryFn: () => newAnimeService.getAnimeDetail(slug),
    queryKey: ["newApi", "detail", slug],
  });
}
```

Ikuti pola yang sama untuk `getSchedule`, `getHome`, `getEpisodeDetail`,
`getAllGenre`, `getAnimeByGenre`, `getBatch`, `getServerUrl`, `getUnlimited`.

---

## 6. Response Normalization

Jangan pakai `getListItems()` dari `src/utils/helpers.ts` apa adanya kalau
bentuk response API baru berbeda dari `{ results | data: Anime[] }` milik API
lama. Buat helper terpisah:

`src/utils/newApiHelpers.ts`

```ts
import type { NewAnimeItem, NewAnimeListResponse } from "../types/newAnimeApi";

export function getNewAnimeListItems(
  response?: NewAnimeListResponse,
): NewAnimeItem[] {
  return response?.data ?? response?.results ?? [];
}
```

Jika pada akhirnya tim ingin menyatukan tampilan (mis. gabung hasil dari API
lama + API baru dalam satu list `Anime[]`), buat **mapper** yang mengubah
`NewAnimeItem` → tipe `Anime` yang sudah dipakai UI lama, alih-alih memaksakan
satu interface untuk dua sumber data berbeda.

---

## 7. Pemakaian di Komponen (contoh)

```tsx
const { data, error, isFetching, refetch } = useNewAnimeSearch(debouncedQuery);
const items = getNewAnimeListItems(data);
```

Pola render state (`error` → `ErrorState`, `isFetching` → `LoadingSpinner`,
kosong → `EmptyState`, ada data → `FlatList`) tetap sama seperti implementasi
lama — komponen UI tidak perlu tahu dari client/service mana data berasal.

---

## 8. Tombol Resolusi Streaming dan Download

Implementasikan dua kelompok tombol terpisah:

1. Tombol resolusi streaming hanya untuk server `otakuwatch5`.
2. Tombol resolusi download hanya untuk server `mega`.

### Streaming

- Ambil `serverList` dari `data.server.qualities` di response episode.
- Filter hanya server dengan `title === "otakuwatch5"`.
- Tampilkan tombol resolusi dari `quality.title` untuk setiap server yang cocok.
- Gunakan nilai `serverId` dari server yang dipilih untuk memanggil endpoint:
  `GET /anime/server/:serverId`.

Contoh pseudo-UI:

```tsx
const otakuwatch5Streams = qualities.flatMap((quality) =>
  (quality.serverList ?? [])
    .filter((server) => server.title?.toLowerCase() === "otakuwatch5")
    .map((server) => ({
      quality: quality.title,
      serverId: server.serverId,
      href: server.href,
    })),
);

return (
  <View>
    {otakuwatch5Streams.map((stream) => (
      <Pressable
        key={stream.serverId}
        onPress={() => handleStreamSelect(stream.serverId)}
      >
        <Text>{stream.quality ?? "otakuwatch5"}</Text>
      </Pressable>
    ))}
  </View>
);
```

Saat tombol diklik, panggil service berikut:

```ts
newAnimeService.getServerUrl(streamId);
```

Lalu render `embed_url` yang dikembalikan oleh response.

### Download

- Ambil daftar download terpisah dari response download API/new endpoint.
- Filter hanya link dengan `server` atau `title` yang menunjukkan `mega`.
- Tampilkan tombol resolusi download berdasarkan `quality` atau `title`.
- Tombol download boleh tetap memakai label `mega`, karena ini adalah sumber
  download yang berbeda dari sumber streaming.

Contoh pseudo-UI:

```tsx
const megaDownloads = downloadQualities.flatMap((quality) =>
  (quality.urls ?? [])
    .filter((link) => link.server?.toLowerCase() === "mega")
    .map((link) => ({
      quality: quality.title,
      url: link.url,
    })),
);

return (
  <View>
    {megaDownloads.map((download) => (
      <Pressable
        key={download.url}
        onPress={() => openExternalUrl(download.url)}
      >
        <Text>{download.quality ?? "Mega"}</Text>
      </Pressable>
    ))}
  </View>
);
```

### Catatan penting

- Pastikan `streaming` dan `download` memakai sumber data terpisah —
  streaming dari response `server.qualities`, download dari response
  `downloadUrl` atau struktur `mega` yang sesuai.
- Jangan gabungkan filter `otakuwatch5` dan `mega` dalam satu komponen tombol.
- Gunakan label yang jelas: `Resolusi Streaming` untuk otakuwatch5, dan
  `Resolusi Download` untuk mega.

---

## Checklist Sebelum Merge

- [ ] Base URL production sudah dikonfirmasi dan diisi di `newAnimeClient.ts`.
- [ ] Minimal satu response asli per endpoint sudah dicek, dan `types/newAnimeApi.ts` disesuaikan.
- [ ] Format error asli (`message` vs field lain) sudah dikonfirmasi di interceptor.
- [ ] Pagination pada endpoint yang tidak disebut punya `page` (`home`, `schedule`, `search`, `unlimited`) sudah dicek — apakah tetap ada atau tidak.
- [ ] `serverId` untuk `/anime/server/:serverId` dipastikan diambil dari field mana di response `getEpisodeDetail`.
- [ ] Query key React Query di-namespace dengan `"newApi"` agar tidak konflik dengan cache lama.
- [ ] Tidak ada perubahan pada `src/api/client.ts`, `src/api/endpoints.ts`, atau `src/api/services/animeServices.ts` (API lama tetap utuh).
