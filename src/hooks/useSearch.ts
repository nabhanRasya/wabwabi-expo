import { useQuery } from "@tanstack/react-query";

import { newAnimeService } from "../api/services/newAnimeService";
import { getNewListItems } from "../utils/helpers";

export function useSearch(query: string, page = 1) {
  const keyword = query.trim();

  return useQuery({
    enabled: keyword.length >= 2,
    queryFn: () => newAnimeService.search(keyword),
    queryKey: ["newApi", "search", keyword, page],
    select: getNewListItems,
  });
}
