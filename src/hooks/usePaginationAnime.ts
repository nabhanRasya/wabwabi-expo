import { useQuery } from "@tanstack/react-query";

import { animeService } from "../api/services/animeServices";

export type AnimeListMode = "catalog" | "latest" | "ongoing" | "completed" | "popular";

export function usePaginationAnime(
  mode: AnimeListMode,
  params: { page?: number; title?: string; order?: string; type?: string; status?: string } = {},
) {
  const page = params.page ?? 1;

  return useQuery({
    queryKey: ["anime-list", mode, params],
    queryFn: () => {
      if (mode === "latest") return animeService.getLatest(page);
      if (mode === "ongoing") return animeService.getOngoing(page);
      if (mode === "completed") return animeService.getCompleted(page);
      if (mode === "popular") return animeService.getPopular(page);
      return animeService.getCatalog({ ...params, page });
    },
  });
}
import { useQuery } from "@tanstack/react-query";

import { animeService } from "../api/services/animeServices";
import { getListItems } from "../utils/helpers";

export interface CatalogParams {
  title?: string;
  page?: number;
  order?: string;
  type?: string;
  status?: string;
}

export function usePaginationAnime(params: CatalogParams = {}) {
  const page = params.page ?? 1;

  return useQuery({
    queryFn: () => animeService.getCatalog({ ...params, page }),
    queryKey: ["catalog", { ...params, page }],
    select: getListItems,
  });
}
