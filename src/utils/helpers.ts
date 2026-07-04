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
  WinbuDownloadItem,
  WinbuEpisodeItem,
  WinbuGenre,
  WinbuListItem,
  WinbuStreamItem,
} from "../types/api";

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

export function isMegaService(value?: string) {
  return Boolean(value?.toLowerCase().includes("mega"));
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

export function routeForAnime(anime: Anime) {
  if (anime.type === "film") {
    return { pathname: "/film/[id]" as const, params: { id: anime.id } };
  }
  if (anime.type === "series") {
    return { pathname: "/series/[id]" as const, params: { id: anime.id } };
  }

  return { pathname: "/anime/[id]" as const, params: { id: anime.id } };
}
