export interface NewAnimePagination {
  currentPage?: number;
  hasPrevPage?: boolean;
  prevPage?: number | null;
  hasNextPage?: boolean;
  nextPage?: number | null;
  totalPages?: number;
}

export interface NewAnimeGenre {
  title?: string;
  genreId?: string;
  href?: string;
  otakudesuUrl?: string;
}

export interface NewAnimeSynopsis {
  paragraphs?: string[];
}

export interface NewAnimeItem {
  title?: string;
  poster?: string;
  episodes?: number;
  releaseDay?: string;
  latestReleaseDate?: string;
  lastReleaseDate?: string;
  status?: string;
  score?: string;
  studios?: string;
  season?: string;
  animeId?: string;
  slug?: string;
  href?: string;
  url?: string;
  otakudesuUrl?: string;
  synopsis?: string | NewAnimeSynopsis;
  genreList?: NewAnimeGenre[];
}

export interface NewAnimeListGroup {
  startWith?: string;
  animeList?: NewAnimeItem[];
}

export interface NewAnimeListResponse {
  status: string;
  creator?: string;
  statusCode?: number;
  statusMessage?: string;
  message?: string;
  ok?: boolean;
  data?:
    | {
        animeList?: NewAnimeItem[];
        list?: NewAnimeListGroup[];
      }
    | NewAnimeItem[];
  results?: NewAnimeItem[];
  pagination?: NewAnimePagination | null;
}

export interface NewHomeResponse {
  status: string;
  creator?: string;
  statusCode?: number;
  statusMessage?: string;
  message?: string;
  ok?: boolean;
  data?: {
    ongoing?: {
      href?: string;
      otakudesuUrl?: string;
      animeList?: NewAnimeItem[];
    };
    completed?: {
      href?: string;
      otakudesuUrl?: string;
      animeList?: NewAnimeItem[];
    };
  };
  pagination?: NewAnimePagination | null;
}

export interface NewScheduleDay {
  day?: string;
  anime_list?: NewAnimeItem[];
}

export interface NewScheduleResponse {
  status: string;
  creator?: string;
  data?: NewScheduleDay[];
}

export interface NewGenreListResponse {
  status: string;
  creator?: string;
  statusCode?: number;
  statusMessage?: string;
  message?: string;
  ok?: boolean;
  data?: {
    genreList?: NewAnimeGenre[];
  };
  pagination?: NewAnimePagination | null;
}

export interface NewAnimeEpisodeItem {
  title?: string;
  eps?: number;
  date?: string;
  episodeId?: string;
  href?: string;
  otakudesuUrl?: string;
}

export interface NewBatchLink {
  title?: string;
  batchId?: string;
  href?: string;
  otakudesuUrl?: string;
}

export interface NewAnimeDetailResponse {
  status: string;
  creator?: string;
  statusCode?: number;
  statusMessage?: string;
  message?: string;
  ok?: boolean;
  data?: {
    title?: string;
    poster?: string;
    japanese?: string;
    score?: string;
    producers?: string;
    type?: string;
    status?: string;
    episodes?: number;
    duration?: string;
    aired?: string;
    studios?: string;
    batch?: NewBatchLink | null;
    synopsis?: string | NewAnimeSynopsis;
    genreList?: NewAnimeGenre[];
    episodeList?: NewAnimeEpisodeItem[];
    recommendedAnimeList?: NewAnimeItem[];
  };
  pagination?: NewAnimePagination | null;
}

export interface NewEpisodeLink {
  title?: string;
  episodeId?: string;
  href?: string;
  otakudesuUrl?: string;
}

export interface NewStreamServerItem {
  title?: string;
  name?: string;
  server?: string;
  serverId?: string;
  id?: string;
  slug?: string;
  href?: string;
}

export interface NewStreamQuality {
  title?: string;
  serverList?: NewStreamServerItem[];
}

export interface NewDownloadUrl {
  title?: string;
  name?: string;
  server?: string;
  url?: string;
}

export interface NewDownloadQuality {
  title?: string;
  size?: string;
  urls?: NewDownloadUrl[];
}

export interface NewDownloadFormat {
  title?: string;
  qualities?: NewDownloadQuality[];
}

export interface NewDownloadCollection {
  qualities?: NewDownloadQuality[];
  formats?: NewDownloadFormat[];
}

export interface NewEpisodeResponse {
  status: string;
  creator?: string;
  statusCode?: number;
  statusMessage?: string;
  message?: string;
  ok?: boolean;
  data?: {
    title?: string;
    animeId?: string;
    releaseTime?: string;
    defaultStreamingUrl?: string;
    hasPrevEpisode?: boolean;
    prevEpisode?: NewEpisodeLink | null;
    hasNextEpisode?: boolean;
    nextEpisode?: NewEpisodeLink | null;
    server?: {
      qualities?: NewStreamQuality[];
    };
    downloadUrl?: NewDownloadCollection;
    info?: {
      credit?: string;
      encoder?: string;
      duration?: string;
      type?: string;
      genreList?: NewAnimeGenre[];
      episodeList?: NewAnimeEpisodeItem[];
    };
  };
  pagination?: NewAnimePagination | null;
}

export interface NewBatchResponse {
  status: string;
  creator?: string;
  statusCode?: number;
  statusMessage?: string;
  message?: string;
  ok?: boolean;
  data?: {
    title?: string;
    animeId?: string;
    poster?: string;
    japanese?: string;
    type?: string;
    score?: string;
    episodes?: number;
    duration?: string;
    studios?: string;
    producers?: string;
    aired?: string;
    credit?: string;
    genreList?: NewAnimeGenre[];
    downloadUrl?: NewDownloadCollection;
  };
  pagination?: NewAnimePagination | null;
}

export interface NewServerResponse {
  status: string;
  creator?: string;
  statusCode?: number;
  statusMessage?: string;
  message?: string;
  ok?: boolean;
  data?: {
    url?: string;
    embed_url?: string;
    embedUrl?: string;
    html?: string;
  };
  pagination?: NewAnimePagination | null;
}
