export const ENDPOINTS = {
  // Home
  HOME: "/anime/winbu/home",

  // Pencarian - ?q=keyword&page=1
  SEARCH: "/anime/winbu/search",

  // Detail
  ANIME_DETAIL: (id: string) => `/anime/winbu/anime/${id}`,
  SERIES_DETAIL: (id: string) => `/anime/winbu/series/${id}`,
  FILM_DETAIL: (id: string) => `/anime/winbu/film/${id}`,
  EPISODE_DETAIL: (id: string) => `/anime/winbu/episode/${id}`,

  // Server Embed - ?post=ID&nume=1&type=schtml
  SERVER: "/anime/winbu/server",

  // List konten (support ?page=1)
  LIST_ANIME_DONGHUA: "/anime/winbu/animedonghua",
  LIST_FILM: "/anime/winbu/film",
  LIST_SERIES: "/anime/winbu/series",
  LIST_TVSHOW: "/anime/winbu/tvshow",
  LIST_OTHERS: "/anime/winbu/others",

  // Genre
  ALL_GENRES: "/anime/winbu/genres",
  ANIME_BY_GENRE: (slug: string) => `/anime/winbu/genre/${slug}`,

  // Catalog - ?title=&page=1&order=update&type=&status=
  CATALOG: "/anime/winbu/catalog",

  // Jadwal - ?day=all | senin | selasa | rabu | kamis | jumat | sabtu | minggu
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
