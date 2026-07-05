import { useQuery } from "@tanstack/react-query";

import { newAnimeService } from "../api/services/newAnimeService";
import type { ContentType } from "../types/anime";
import { normalizeNewDetail } from "../utils/helpers";

export function useAnimeDetail(id: string, type: ContentType = "anime") {
  return useQuery({
    enabled: id.length > 0,
    queryFn: async () => {
      const detail = await newAnimeService.getAnimeDetail(id);
      const batchId = detail.data?.batch?.batchId;

      if (!batchId) {
        return { batch: undefined, detail };
      }

      try {
        const batch = await newAnimeService.getBatch(batchId);
        return { batch, detail };
      } catch {
        return { batch: undefined, detail };
      }
    },
    queryKey: ["newApi", "detail", type, id],
    select: ({ batch, detail }) => normalizeNewDetail(detail, id, type, batch),
  });
}
