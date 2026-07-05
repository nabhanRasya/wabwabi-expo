import { useQuery } from "@tanstack/react-query";

import { newAnimeService } from "../api/services/newAnimeService";
import type { StreamServer } from "../types/anime";
import { normalizeNewEpisode, normalizeNewServerEmbed } from "../utils/helpers";

export function useEpisode(id: string) {
  return useQuery({
    enabled: id.length > 0,
    queryFn: () => newAnimeService.getEpisodeDetail(id),
    queryKey: ["newApi", "episode", id],
    select: (response) => normalizeNewEpisode(response, id),
  });
}

export function useServerEmbed(stream?: StreamServer | null) {
  return useQuery({
    enabled: Boolean(stream?.serverId),
    queryFn: () => newAnimeService.getServerUrl(stream?.serverId ?? ""),
    queryKey: ["newApi", "server-embed", stream?.serverId],
    select: normalizeNewServerEmbed,
  });
}
