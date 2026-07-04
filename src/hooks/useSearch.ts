import { useQuery } from "@tanstack/react-query";

import { animeService } from "../api/services/animeServices";
import { getListItems } from "../utils/helpers";

export function useSearch(query: string, page = 1) {
  const keyword = query.trim();

  return useQuery({
    enabled: keyword.length >= 2,
    queryFn: () => animeService.search(keyword, page),
    queryKey: ["search", keyword, page],
    select: getListItems,
  });
}
