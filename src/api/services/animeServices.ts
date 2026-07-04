import { apiClient } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { AxiosRequestConfig } from "axios";
import type {
  DetailResponse,
  EpisodeResponse,
  GenresResponse,
  HomeResponse,
  ListResponse,
  ServerEmbedResponse,
} from "../../types/api";

async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response as unknown as T;
}

export const animeService = {
  getHome: () => get<HomeResponse>(ENDPOINTS.HOME),

  getAnimeDetail: (id: string) => get<DetailResponse>(ENDPOINTS.ANIME_DETAIL(id)),

  getSeriesDetail: (id: string) => get<DetailResponse>(ENDPOINTS.SERIES_DETAIL(id)),

  getFilmDetail: (id: string) => get<DetailResponse>(ENDPOINTS.FILM_DETAIL(id)),

  getEpisodeDetail: (id: string) => get<EpisodeResponse>(ENDPOINTS.EPISODE_DETAIL(id)),

  getServerEmbed: (params: { post: string; nume?: string; iframe?: string; type: string }) =>
    get<ServerEmbedResponse>(ENDPOINTS.SERVER, {
      params: {
        post: params.post,
        type: params.type,
        ...(params.nume ? { nume: params.nume } : {}),
        ...(params.iframe ? { iframe: params.iframe } : {}),
      },
    }),

  search: (query: string, page = 1) =>
    get<ListResponse>(ENDPOINTS.SEARCH, { params: { q: query, page } }),

  getOngoing: (page = 1) =>
    get<ListResponse>(ENDPOINTS.ONGOING, { params: { page } }),

  getCompleted: (page = 1) =>
    get<ListResponse>(ENDPOINTS.COMPLETED, { params: { page } }),

  getPopular: (page = 1) =>
    get<ListResponse>(ENDPOINTS.POPULAR, { params: { page } }),

  getLatest: (page = 1) =>
    get<ListResponse>(ENDPOINTS.LATEST, { params: { page } }),

  getAllGenres: () => get<GenresResponse>(ENDPOINTS.ALL_GENRES),

  getByGenre: (slug: string, page = 1) =>
    get<ListResponse>(ENDPOINTS.ANIME_BY_GENRE(slug), { params: { page } }),

  getSchedule: (day = "all") =>
    get<ListResponse>(ENDPOINTS.SCHEDULE, { params: { day } }),

  getCatalog: (params: {
    title?: string;
    page?: number;
    order?: string;
    type?: string;
    status?: string;
  }) => get<ListResponse>(ENDPOINTS.CATALOG, { params }),
};
