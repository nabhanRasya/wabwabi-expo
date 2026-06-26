import { apiClient } from "../client";
import { ENDPOINTS } from "../endpoints";

export const animeService = {
  getHome: () => apiClient.get(ENDPOINTS.HOME),

  getAnimeDetail: (id: string) => apiClient.get(ENDPOINTS.ANIME_DETAIL(id)),

  getSeriesDetail: (id: string) => apiClient.get(ENDPOINTS.SERIES_DETAIL(id)),

  getFilmDetail: (id: string) => apiClient.get(ENDPOINTS.FILM_DETAIL(id)),

  getEpisodeDetail: (id: string) => apiClient.get(ENDPOINTS.EPISODE_DETAIL(id)),

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

  getAllGenres: () => apiClient.get(ENDPOINTS.ALL_GENRES),

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
