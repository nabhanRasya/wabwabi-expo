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
