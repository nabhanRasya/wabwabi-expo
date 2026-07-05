import { useQuery } from "@tanstack/react-query";

import { newAnimeService } from "../api/services/newAnimeService";
import { getNewListItems } from "../utils/helpers";

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
    queryFn: () => {
      const title = params.title?.trim();

      if (title) {
        return newAnimeService.search(title);
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
