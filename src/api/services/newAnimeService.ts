import type { AxiosRequestConfig } from "axios";

import { newAnimeApiClient } from "../newAnimeClient";
import { NEW_ANIME_ENDPOINTS } from "../newAnimeEndpoints";
import type {
  NewAnimeDetailResponse,
  NewAnimeListResponse,
  NewBatchResponse,
  NewEpisodeResponse,
  NewGenreListResponse,
  NewHomeResponse,
  NewScheduleResponse,
  NewServerResponse,
} from "../../types/newAnimeApi";

async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await newAnimeApiClient.get<T>(url, config);
  return response as unknown as T;
}

function encodePathSegment(value: string) {
  return encodeURIComponent(value.trim());
}

export const newAnimeService = {
  getHome: () => get<NewHomeResponse>(NEW_ANIME_ENDPOINTS.HOME),

  getSchedule: () => get<NewScheduleResponse>(NEW_ANIME_ENDPOINTS.SCHEDULE),

  getAnimeDetail: (slug: string) =>
    get<NewAnimeDetailResponse>(
      NEW_ANIME_ENDPOINTS.ANIME_DETAIL(encodePathSegment(slug)),
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
      NEW_ANIME_ENDPOINTS.ANIME_BY_GENRE(encodePathSegment(slug)),
      { params: { page } },
    ),

  getEpisodeDetail: (slug: string) =>
    get<NewEpisodeResponse>(
      NEW_ANIME_ENDPOINTS.EPISODE_DETAIL(encodePathSegment(slug)),
    ),

  search: (keyword: string) =>
    get<NewAnimeListResponse>(
      NEW_ANIME_ENDPOINTS.SEARCH(encodePathSegment(keyword)),
    ),

  getBatch: (slug: string) =>
    get<NewBatchResponse>(NEW_ANIME_ENDPOINTS.BATCH(encodePathSegment(slug))),

  getServerUrl: (serverId: string) =>
    get<NewServerResponse>(
      NEW_ANIME_ENDPOINTS.SERVER(encodePathSegment(serverId)),
    ),

  getUnlimited: () => get<NewAnimeListResponse>(NEW_ANIME_ENDPOINTS.UNLIMITED),
};
