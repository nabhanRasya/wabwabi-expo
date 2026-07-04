export type ContentType = "anime" | "series" | "film" | "tvshow" | "donghua" | "others";

export interface Anime {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  type: ContentType;
  status?: string;
  score?: string;
  episode?: string;
  rank?: string;
  time?: string;
  views?: string;
  synopsis?: string;
  description?: string;
  season?: string;
  duration?: string;
  studio?: string;
  releaseDate?: string;
  genres?: Genre[];
  episodesList?: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  number?: number;
  animeId?: string;
  thumbnail?: string;
  aired?: string;
  active?: boolean;
}

export interface EpisodeDetail {
  id: string;
  title: string;
  streams: StreamServer[];
  downloads: DownloadLink[];
  navigation?: {
    prev?: EpisodeLink | null;
    next?: EpisodeLink | null;
  };
  allEpisodes?: Episode[];
}

export interface StreamServer {
  name: string;
  quality?: string;
  url?: string;
  type?: "embed" | "direct";
  post?: string;
  nume?: string;
  iframe?: string;
  serverType?: string;
}

export interface DownloadLink {
  quality: string;
  links: { server: string; url: string }[];
}

export interface EpisodeLink {
  id: string;
  title?: string;
  url?: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  pagination?: Pagination;
}
