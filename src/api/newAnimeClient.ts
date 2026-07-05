import { AxiosError, AxiosResponse, create } from "axios";

const NEW_API_BASE_URL = "https://www.sankavollerei.web.id/";

interface NewAnimeErrorBody {
  message?: string;
  statusMessage?: string;
  ok?: boolean;
}

export const newAnimeApiClient = create({
  baseURL: NEW_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

newAnimeApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const payload = response.data as NewAnimeErrorBody;

    if (payload?.ok === false) {
      throw new Error(payload.message || payload.statusMessage || "Server Error");
    }

    return response.data;
  },
  (error: AxiosError<NewAnimeErrorBody>) => {
    if (error.response) {
      throw new Error(
        error.response.data?.message ||
          error.response.data?.statusMessage ||
          "Server Error",
      );
    }

    throw new Error("Network error. Cek koneksi internet kamu.");
  },
);
