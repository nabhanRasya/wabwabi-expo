import { useQuery } from "@tanstack/react-query";

import { animeService } from "../api/services/animeServices";

export function useEpisode(id: string) {
  return useQuery({
    queryKey: ["episode", id],
    queryFn: () => animeService.getEpisodeDetail(id),
    enabled: id.length > 0,
  });
}
import { useQuery } from "@tanstack/react-query";

import { animeService } from "../api/services/animeServices";
import type { StreamServer } from "../types/anime";
import { normalizeEpisode } from "../utils/helpers";

export function useEpisode(id: string) {
  return useQuery({
    enabled: id.length > 0,
    queryFn: () => animeService.getEpisodeDetail(id),
    queryKey: ["episode", id],
    select: (response) => normalizeEpisode(response, id),
  });
}

export function useServerEmbed(stream?: StreamServer | null) {
  return useQuery({
    enabled: Boolean(stream?.post && stream?.nume && stream?.type),
    queryFn: () =>
      animeService.getServerEmbed({
        nume: stream?.nume ?? "",
        post: stream?.post ?? "",
        type: stream?.type ?? "schtml",
      }),
    queryKey: ["server-embed", stream?.post, stream?.nume, stream?.type],
  });
}
