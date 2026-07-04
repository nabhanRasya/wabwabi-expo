import { useQuery } from "@tanstack/react-query";

import { animeService } from "../api/services/animeServices";
import type { ContentType } from "../types/anime";
import { normalizeDetail } from "../utils/helpers";

export function useAnimeDetail(id: string, type: ContentType = "anime") {
  return useQuery({
    enabled: id.length > 0,
    queryFn: async () => {
      if (type === "film") {
        return animeService.getFilmDetail(id);
      }

      if (type === "series") {
        return animeService.getSeriesDetail(id);
      }

      return animeService.getAnimeDetail(id);
    },
    queryKey: ["detail", type, id],
    select: (response) => normalizeDetail(response, id, type),
  });
}
