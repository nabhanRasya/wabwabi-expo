import { useQuery } from "@tanstack/react-query";

import { animeService } from "../api/services/animeServices";

export function useGenre(slug: string, page = 1) {
  return useQuery({
    queryKey: ["genre", slug, page],
    queryFn: () => animeService.getByGenre(slug, page),
    enabled: slug.length > 0,
  });
}

export function useGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: animeService.getAllGenres,
  });
}
import { useQuery } from "@tanstack/react-query";

import { animeService } from "../api/services/animeServices";
import { getListItems } from "../utils/helpers";

export function useGenre(slug: string, page = 1) {
  return useQuery({
    enabled: slug.length > 0,
    queryFn: () => animeService.getByGenre(slug, page),
    queryKey: ["genre", slug, page],
    select: getListItems,
  });
}

export function useGenres() {
  return useQuery({
    queryFn: animeService.getAllGenres,
    queryKey: ["genres"],
    select: (response) => response.data ?? [],
  });
}
