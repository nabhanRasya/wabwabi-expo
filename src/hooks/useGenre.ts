import { useQuery } from "@tanstack/react-query";

import { newAnimeService } from "../api/services/newAnimeService";
import { getNewGenreItems, getNewListItems } from "../utils/helpers";

export function useGenre(slug: string, page = 1) {
  return useQuery({
    enabled: slug.length > 0,
    queryFn: () => newAnimeService.getAnimeByGenre(slug, page),
    queryKey: ["newApi", "genre", slug, page],
    select: getNewListItems,
  });
}

export function useGenres() {
  return useQuery({
    queryFn: newAnimeService.getAllGenre,
    queryKey: ["newApi", "genres"],
    select: getNewGenreItems,
  });
}

export function useCatalog(params: { order?: string; status?: string; title?: string; type?: string; genre?: string; page?: number } = {}) {
  const page = params.page ?? 1;

  return useQuery({
    queryFn: () => {
      const title = params.title?.trim();

      if (title) {
        return newAnimeService.search(title);
      }

      if (params.genre) {
        return newAnimeService.getAnimeByGenre(params.genre, page);
      }

      if (params.status === "completed") {
        return newAnimeService.getCompleteAnime(page);
      }

      if (params.status === "ongoing" || params.order === "update") {
        return newAnimeService.getOngoingAnime(page);
      }

      return newAnimeService.getUnlimited();
    },
    queryKey: ["newApi", "catalog", { ...params, page }],
    select: getNewListItems,
  });
}
