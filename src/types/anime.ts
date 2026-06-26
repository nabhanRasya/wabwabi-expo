export interface Anime {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  type: "anime" | "series" | "film" | "tvshow" | "donghua" | "others";
  status: "ongoing" | "completed";
  score?: number;
  episodes?: number;
  synopsis?: string;
  year?: number;
  studio?: string;
  episodesList?: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  number: number;
  animeId: string;
  thumbnail?: string;
  aired?: string;
}

export interface EpisodeDetail {
    id: string;
    title: string;
    servers: StreamServer[];
    downloadLinks?: DownloadLink[];
    prevEpisode?: string;
    nextEpisode?: string;
}

export interface StreamServer {
  name: string;
  url: string;
  quality?: string;
  type?: "embed" | "direct";
  post?: string;
  iframe?: string;
}

export interface DownloadLink {
  quality: string;
  links: { server: string; url: string }[];
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
  };
}
