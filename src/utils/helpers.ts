import type {
  Anime,
  ContentType,
  DownloadLink,
  Episode,
  Genre,
  StreamServer,
} from "../types/anime";
import type {
  DetailResponse,
  EpisodeResponse,
  HomeResponse,
  HomeSection,
  ListResponse,
  NormalizedDetail,
  ServerEmbedResponse,
  WinbuDownloadItem,
  WinbuEpisodeItem,
  WinbuGenre,
  WinbuListItem,
  WinbuStreamItem,
} from "../types/api";
import type {
  NewAnimeDetailResponse,
  NewAnimeEpisodeItem,
  NewAnimeGenre,
  NewAnimeItem,
  NewAnimeListResponse,
  NewAnimeSynopsis,
  NewBatchResponse,
  NewDownloadCollection,
  NewEpisodeLink,
  NewEpisodeResponse,
  NewGenreListResponse,
  NewHomeResponse,
  NewScheduleResponse,
  NewServerResponse,
  NewStreamQuality,
} from "../types/newAnimeApi";

const fallbackImage = "";

export function normalizeParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function normalizeContentType(
  value?: string,
  fallback: ContentType = "anime",
): ContentType {
  const normalized = value?.toLowerCase().trim();

  if (normalized === "film" || normalized === "movie") return "film";
  if (normalized === "series") return "series";
  if (normalized === "tvshow" || normalized === "tv show") return "tvshow";
  if (normalized === "donghua") return "donghua";
  if (normalized === "others") return "others";
  if (normalized === "anime" || normalized === "tv" || normalized === "ona")
    return "anime";

  return fallback;
}

export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugFromUrl(url?: string): string {
  if (!url) return "";
  const clean = url.replace(/\/$/, "");
  return clean.substring(clean.lastIndexOf("/") + 1);
}

export function isOtakuwatch5Service(value?: string) {
  const normalized = value?.toLowerCase().trim();
  if (!normalized) return false;

  return (
    normalized === "otakuwatch5" ||
    normalized === "otakuwatch5.id" ||
    normalized === "otakuwatch5.com" ||
    normalized.startsWith("otakuwatch5/") ||
    normalized.startsWith("otakuwatch5.id/") ||
    normalized.startsWith("otakuwatch5.com/") ||
    /^https?:\/\/([^/]+\.)?otakuwatch5\.(id|com)(\/|$)/.test(normalized)
  );
}

export function isMegaService(value?: string) {
  const normalized = value?.toLowerCase().trim();
  if (!normalized) return false;

  return (
    normalized === "mega" ||
    normalized === "mega.nz" ||
    normalized.startsWith("mega/") ||
    normalized.startsWith("mega.nz/") ||
    normalized.includes("mega")
  );
}

export function isSupportedStreamService(value?: string) {
  return isOtakuwatch5Service(value) || isMegaService(value);
}

export interface Otakuwatch5DownloadItem {
  quality: string;
  server: string;
  url: string;
}

export function getOtakuwatch5DownloadItems(
  downloads?: DownloadLink[],
): Otakuwatch5DownloadItem[] {
  const seenQualities = new Set<string>();

  return (downloads ?? [])
    .flatMap((download) =>
      download.links
        .filter(
          (link) =>
            isOtakuwatch5Service(link.server) || isOtakuwatch5Service(link.url),
        )
        .map((link) => ({
          quality: download.quality || "Resolusi",
          server: "otakuwatch5",
          url: link.url,
        })),
    )
    .filter((item) => {
      const qualityKey = item.quality.toLowerCase();
      if (seenQualities.has(qualityKey)) return false;

      seenQualities.add(qualityKey);
      return true;
    });
}

export function getMegaDownloadItems(
  downloads?: DownloadLink[],
): Otakuwatch5DownloadItem[] {
  const seenQualities = new Set<string>();

  return (downloads ?? [])
    .flatMap((download) =>
      download.links
        .filter((link) => isMegaService(link.server) || isMegaService(link.url))
        .map((link) => ({
          quality: download.quality || "Resolusi",
          server: "mega",
          url: link.url,
        })),
    )
    .filter((item) => {
      const qualityKey = item.quality.toLowerCase();
      if (seenQualities.has(qualityKey)) return false;

      seenQualities.add(qualityKey);
      return true;
    });
}

export function toAnime(
  item: WinbuListItem,
  fallbackType: ContentType = "anime",
): Anime {
  const title = item.title?.trim() || "Tanpa judul";
  const id =
    item.id?.trim() ||
    item.slug?.trim() ||
    slugFromUrl(item.url || item.link) ||
    titleToSlug(title);
  const type = normalizeContentType(item.type, fallbackType);

  return {
    id,
    title,
    slug: item.slug || id,
    thumbnail: item.thumbnail || item.image || fallbackImage,
    type,
    score: item.rating || item.score,
    episode: item.episode,
    rank: item.rank,
    time: item.time,
    views: item.views,
    description: item.description,
    synopsis: item.synopsis,
  };
}

export function toAnimeList(
  items?: WinbuListItem[],
  fallbackType: ContentType = "anime",
): Anime[] {
  const seen = new Set<string>();

  return (items ?? [])
    .map((item) => toAnime(item, fallbackType))
    .filter((item) => {
      if (!item.id) return false;

      const key = `${item.type}-${item.id}`;
      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
}

export function getListItems(response?: ListResponse): Anime[] {
  return toAnimeList(response?.results ?? response?.data ?? []);
}

export function getHomeSections(response?: HomeResponse): HomeSection[] {
  const data = response?.data ?? {};
  const config: {
    key: keyof typeof data & string;
    title: string;
    type?: ContentType;
    href?: HomeSection["href"];
  }[] = [
    {
      key: "top10_anime",
      title: "Top 10 Anime",
      type: "anime",
      href: {
        pathname: "/catalog",
        params: { order: "popular", type: "anime" },
      },
    },
    {
      key: "latest_anime",
      title: "Anime Terbaru",
      type: "anime",
      href: {
        pathname: "/catalog",
        params: { order: "update", type: "anime" },
      },
    },
    {
      key: "top10_film",
      title: "Film Populer",
      type: "film",
      href: {
        pathname: "/catalog",
        params: { order: "popular", type: "film" },
      },
    },
    {
      key: "latest_film",
      title: "Film Terbaru",
      type: "film",
      href: { pathname: "/catalog", params: { order: "update", type: "film" } },
    },
    {
      key: "latest_series",
      title: "Series Terbaru",
      type: "series",
      href: {
        pathname: "/catalog",
        params: { order: "update", type: "series" },
      },
    },
    {
      key: "tv_show",
      title: "TV Show",
      type: "tvshow",
      href: { pathname: "/catalog", params: { type: "tvshow" } },
    },
  ];

  return config
    .map((section) => ({
      key: section.key,
      title: section.title,
      href: section.href,
      items: toAnimeList(data[section.key], section.type),
    }))
    .filter((section) => section.items.length > 0);
}

export function toGenre(item: WinbuGenre): Genre {
  const name = item.name?.trim() || "Genre";
  const slug = item.slug?.trim() || slugFromUrl(item.url) || titleToSlug(name);

  return {
    id: slug,
    name,
    slug,
    count: item.count,
  };
}

export function toGenres(items?: WinbuGenre[]): Genre[] {
  return (items ?? []).map(toGenre).filter((genre) => genre.slug.length > 0);
}

export function toEpisode(
  item: WinbuEpisodeItem,
  index = 0,
  animeId?: string,
): Episode {
  const title = item.title?.trim() || `Episode ${index + 1}`;
  const id =
    item.id?.trim() || slugFromUrl(item.url || item.link) || titleToSlug(title);
  const number = Number(title.match(/\d+/)?.[0]);

  return {
    id,
    title,
    animeId,
    active: item.active,
    number: Number.isFinite(number) ? number : index + 1,
  };
}

function toDownloads(items?: WinbuDownloadItem[]): DownloadLink[] {
  return (items ?? []).map((item) => ({
    quality: item.resolution || item.quality || "Link",
    links: (item.links ?? [])
      .filter((link) => link.url)
      .map((link) => ({
        server: link.server || "Server",
        url: link.url ?? "",
      })),
  }));
}

function toStreams(items?: WinbuStreamItem[]): StreamServer[] {
  return (items ?? []).map((item) => ({
    name: item.server || "Server",
    quality: item.resolution,
    type: "embed",
    post: item.data?.post,
    nume: item.data?.nume,
    iframe: item.data?.iframe,
    serverType: item.data?.type || "schtml",
  }));
}

export function normalizeDetail(
  response: DetailResponse | undefined,
  id: string,
  fallbackType: ContentType,
): NormalizedDetail | null {
  const data = response?.data;
  if (!data) return null;

  const info = data.info;
  const type = normalizeContentType(response?.type || info?.type, fallbackType);
  const episodes = (data.episodes ?? []).map((episode, index) =>
    toEpisode(episode, index, id),
  );
  const anime: Anime = {
    id,
    title: data.title || "Tanpa judul",
    slug: id,
    thumbnail: data.image || fallbackImage,
    type,
    score: info?.rating,
    status: info?.status,
    synopsis: data.synopsis,
    season: info?.season,
    episode: info?.episodes_count,
    duration: info?.duration,
    studio: info?.studio,
    releaseDate: info?.release_date,
    genres: toGenres(info?.genres),
    episodesList: episodes,
  };

  return {
    anime,
    type,
    episodes,
    recommendations: toAnimeList(data.recommendations, type),
    downloads: toDownloads(data.downloads),
    streams: toStreams(data.streams),
  };
}

export function normalizeEpisode(
  response: EpisodeResponse | undefined,
  id: string,
) {
  const data = response?.data;
  const allEpisodes = (data?.all_episodes ?? []).map((episode, index) =>
    toEpisode(episode, index),
  );

  return {
    id,
    title: data?.title || "Episode",
    streams: toStreams(data?.streams),
    downloads: toDownloads(data?.downloads),
    navigation: data?.navigation,
    allEpisodes,
  };
}

function synopsisToText(value?: string | NewAnimeSynopsis): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value.trim() || undefined;

  const paragraphs = value.paragraphs
    ?.map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs && paragraphs.length > 0
    ? paragraphs.join("\n\n")
    : undefined;
}

function toNewAnime(
  item: NewAnimeItem,
  fallbackType: ContentType = "anime",
): Anime {
  const title = item.title?.trim() || "Tanpa judul";
  const id =
    item.animeId?.trim() ||
    item.slug?.trim() ||
    slugFromUrl(item.href || item.url || item.otakudesuUrl) ||
    titleToSlug(title);
  const synopsis = synopsisToText(item.synopsis);
  const episode =
    typeof item.episodes === "number"
      ? `${item.episodes} eps`
      : item.latestReleaseDate || item.lastReleaseDate || item.releaseDay;

  return {
    id,
    title,
    slug: id,
    thumbnail: item.poster || fallbackImage,
    type: fallbackType,
    status: item.status,
    score: item.score,
    episode,
    time: item.releaseDay,
    description: synopsis,
    synopsis,
    season: item.season,
    studio: item.studios,
    genres: toNewGenres(item.genreList),
  };
}

function toNewAnimeList(
  items?: NewAnimeItem[],
  fallbackType: ContentType = "anime",
): Anime[] {
  const seen = new Set<string>();

  return (items ?? [])
    .map((item) => toNewAnime(item, fallbackType))
    .filter((item) => {
      if (!item.id) return false;

      const key = `${item.type}-${item.id}`;
      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
}

function getNewAnimeItems(response?: NewAnimeListResponse): NewAnimeItem[] {
  const data = response?.data;

  if (Array.isArray(data)) return data;

  return (
    data?.animeList ??
    data?.list?.flatMap((group) => group.animeList ?? []) ??
    response?.results ??
    []
  );
}

export function getNewListItems(response?: NewAnimeListResponse): Anime[] {
  return toNewAnimeList(getNewAnimeItems(response));
}

export function getNewHomeSections(response?: NewHomeResponse): HomeSection[] {
  const sections: {
    key: string;
    title: string;
    items?: NewAnimeItem[];
    href: HomeSection["href"];
  }[] = [
    {
      key: "ongoing",
      title: "Sedang Tayang",
      items: response?.data?.ongoing?.animeList,
      href: {
        pathname: "/catalog",
        params: { status: "ongoing" },
      },
    },
    {
      key: "completed",
      title: "Anime Tamat",
      items: response?.data?.completed?.animeList,
      href: {
        pathname: "/catalog",
        params: { status: "completed" },
      },
    },
  ];

  return sections
    .map((section) => ({
      key: section.key,
      title: section.title,
      href: section.href,
      items: toNewAnimeList(section.items),
    }))
    .filter((section) => section.items.length > 0);
}

export function getNewScheduleItems(
  response: NewScheduleResponse | undefined,
  day: string,
): Anime[] {
  const normalizedDay = day.toLowerCase().trim();
  const schedule = response?.data ?? [];
  const selectedDays =
    normalizedDay === "all"
      ? schedule
      : schedule.filter(
          (item) => item.day?.toLowerCase().trim() === normalizedDay,
        );
  const items = selectedDays.flatMap((item) => item.anime_list ?? []);

  return toNewAnimeList(items);
}

function toNewGenre(item: NewAnimeGenre): Genre {
  const name = item.title?.trim() || "Genre";
  const slug =
    item.genreId?.trim() ||
    slugFromUrl(item.href || item.otakudesuUrl) ||
    titleToSlug(name);

  return {
    id: slug,
    name,
    slug,
  };
}

export function toNewGenres(items?: NewAnimeGenre[]): Genre[] {
  return (items ?? []).map(toNewGenre).filter((genre) => genre.slug.length > 0);
}

export function getNewGenreItems(response?: NewGenreListResponse): Genre[] {
  return toNewGenres(response?.data?.genreList);
}

function toNewEpisode(
  item: NewAnimeEpisodeItem,
  index = 0,
  animeId?: string,
  activeId?: string,
): Episode {
  const title =
    item.title?.trim() ||
    (typeof item.eps === "number"
      ? `Episode ${item.eps}`
      : `Episode ${index + 1}`);
  const id =
    item.episodeId?.trim() ||
    slugFromUrl(item.href || item.otakudesuUrl) ||
    titleToSlug(title);
  const number = item.eps ?? Number(title.match(/\d+/)?.[0]);

  return {
    id,
    title,
    animeId,
    active: activeId ? id === activeId : undefined,
    aired: item.date,
    number: Number.isFinite(number) ? number : index + 1,
  };
}

function toNewEpisodeLink(item?: NewEpisodeLink | null) {
  if (!item?.episodeId) return null;

  return {
    id: item.episodeId,
    title: item.title,
    url: item.href || item.otakudesuUrl,
  };
}

function toNewStreams(qualities?: NewStreamQuality[]): StreamServer[] {
  return (qualities ?? []).flatMap((quality) =>
    (quality.serverList ?? []).flatMap((server) => {
      const serverTitle =
        server.title?.trim() || server.name?.trim() || server.server?.trim();
      const normalizedTitle = serverTitle?.toLowerCase();
      const serverId =
        server.serverId ||
        server.id ||
        server.slug ||
        server.href?.split("/").pop() ||
        "";

      if (!serverId) return [];

      const name =
        serverTitle || (isMegaService(normalizedTitle) ? "mega" : "server");
      const serverType = isOtakuwatch5Service(normalizedTitle)
        ? "otakuwatch5"
        : isMegaService(normalizedTitle)
          ? "mega"
          : "mega";

      return [
        {
          name,
          quality: quality.title?.trim(),
          type: "embed" as const,
          serverId,
          url: server.href,
          serverType,
        },
      ];
    }),
  );
}

function getNewDownloadQualities(downloads?: NewDownloadCollection) {
  return [
    ...(downloads?.qualities ?? []),
    ...(downloads?.formats ?? []).flatMap((format) => format.qualities ?? []),
  ];
}

function toNewDownloads(downloads?: NewDownloadCollection): DownloadLink[] {
  return getNewDownloadQualities(downloads)
    .map((quality) => ({
      quality:
        [quality.title, quality.size].filter(Boolean).join(" ") || "Link",
      links: (quality.urls ?? [])
        .filter((link) => link.url)
        .map((link) => ({
          server: link.server || link.title || link.name || "Server",
          url: link.url ?? "",
        })),
    }))
    .filter((download) => download.links.length > 0);
}

export function normalizeNewDetail(
  response: NewAnimeDetailResponse | undefined,
  id: string,
  fallbackType: ContentType,
  batchResponse?: NewBatchResponse,
): NormalizedDetail | null {
  const data = response?.data;
  if (!data) return null;

  const type = normalizeContentType(data.type, fallbackType);
  const episodes = (data.episodeList ?? []).map((episode, index) =>
    toNewEpisode(episode, index, id),
  );
  const anime: Anime = {
    id,
    title: data.title || "Tanpa judul",
    slug: id,
    thumbnail: data.poster || fallbackImage,
    type,
    score: data.score,
    status: data.status,
    synopsis: synopsisToText(data.synopsis),
    episode:
      typeof data.episodes === "number" ? `${data.episodes} eps` : undefined,
    duration: data.duration,
    studio: data.studios,
    releaseDate: data.aired,
    genres: toNewGenres(data.genreList),
    episodesList: episodes,
  };

  return {
    anime,
    type,
    episodes,
    recommendations: toNewAnimeList(data.recommendedAnimeList, type),
    downloads: toNewDownloads(batchResponse?.data?.downloadUrl),
    streams: [],
  };
}

export function normalizeNewEpisode(
  response: NewEpisodeResponse | undefined,
  id: string,
) {
  const data = response?.data;
  const allEpisodes = (data?.info?.episodeList ?? []).map((episode, index) =>
    toNewEpisode(episode, index, data?.animeId, id),
  );

  return {
    id,
    title: data?.title || "Episode",
    streams: toNewStreams(data?.server?.qualities),
    downloads: toNewDownloads(data?.downloadUrl),
    navigation: {
      prev: toNewEpisodeLink(data?.prevEpisode),
      next: toNewEpisodeLink(data?.nextEpisode),
    },
    allEpisodes,
  };
}

export function normalizeNewServerEmbed(
  response: NewServerResponse | undefined,
): ServerEmbedResponse {
  return {
    status: response?.status || "success",
    creator: response?.creator,
    embed_url:
      response?.data?.embed_url ||
      response?.data?.embedUrl ||
      response?.data?.url ||
      response?.data?.html ||
      "",
  };
}

export function routeForAnime(anime: Anime) {
  if (anime.type === "film") {
    return { pathname: "/film/[id]" as const, params: { id: anime.id } };
  }
  if (anime.type === "series") {
    return { pathname: "/series/[id]" as const, params: { id: anime.id } };
  }

  return { pathname: "/anime/[id]" as const, params: { id: anime.id } };
}
