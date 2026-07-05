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
