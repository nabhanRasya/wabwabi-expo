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
