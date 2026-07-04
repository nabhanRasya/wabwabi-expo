import type { Anime, ContentType, DownloadLink, Episode, Genre, StreamServer } from "./anime";

export interface WinbuPagination {
  current_page?: number;
  total_pages?: number;
  has_next_page?: boolean;
  next_page?: number | null;
  prev_page?: number | null;
  has_prev_page?: boolean;
}

export interface WinbuListItem {
  title?: string;
  id?: string;
  slug?: string;
  type?: string;
  image?: string;
  thumbnail?: string;
  rating?: string;
  score?: string;
  episode?: string;
  rank?: string;
  time?: string;
  views?: string;
  description?: string;
  synopsis?: string;
  url?: string;
  link?: string;
}

export interface WinbuGenre {
  id?: string;
  name?: string;
  slug?: string;
  count?: number;
  url?: string;
}

export interface WinbuEpisodeItem {
  title?: string;
  id?: string;
  link?: string;
  url?: string;
  active?: boolean;
}

export interface WinbuStreamItem {
  resolution?: string;
  server?: string;
  data?: {
    post?: string;
    nume?: string;
    iframe?: string;
    type?: string;
  };
}

export interface WinbuDownloadItem {
  resolution?: string;
  quality?: string;
  links?: { server?: string; url?: string }[];
}

export interface HomeResponse {
  status: string;
  creator?: string;
  source?: string;
  data?: Record<string, WinbuListItem[]>;
}

export interface ListResponse {
  status: string;
  creator?: string;
  message?: string;
  data?: WinbuListItem[];
  results?: WinbuListItem[];
  pagination?: WinbuPagination;
}

export interface GenresResponse {
  status: string;
  creator?: string;
  total?: number;
  data?: WinbuGenre[];
}

export interface DetailResponse {
  status: string;
  creator?: string;
  type?: ContentType | string;
  data?: {
    title?: string;
    image?: string;
    synopsis?: string;
    info?: {
      rating?: string;
      season?: string;
      genres?: WinbuGenre[];
      status?: string;
      type?: string;
      episodes_count?: string;
      duration?: string;
      studio?: string;
      release_date?: string;
    };
    episodes?: WinbuEpisodeItem[];
    recommendations?: WinbuListItem[];
    streams?: WinbuStreamItem[];
    downloads?: WinbuDownloadItem[];
  };
}

export interface EpisodeResponse {
  status: string;
  creator?: string;
  data?: {
    title?: string;
    downloads?: WinbuDownloadItem[];
    streams?: WinbuStreamItem[];
    navigation?: {
      prev?: { id?: string; link?: string } | null;
      next?: { id?: string; link?: string } | null;
    };
    all_episodes?: WinbuEpisodeItem[];
  };
}

export interface ServerEmbedResponse {
  status: string;
  creator?: string;
  embed_url?: string;
  html?: string;
}

export interface HomeSection {
  key: string;
  title: string;
  items: Anime[];
  href?: {
    pathname: "/catalog";
    params?: Record<string, string>;
  };
}

export interface NormalizedDetail {
  anime: Anime;
  recommendations: Anime[];
  downloads: DownloadLink[];
  streams: StreamServer[];
  episodes: Episode[];
  type: ContentType;
}
