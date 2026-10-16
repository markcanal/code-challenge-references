import { ApiError, getJson } from "@/shared/api/http";
import type { Movie } from "@/features/movies/model/movie";

// Keep Apple-specific fields at the boundary. Screens consume Movie only.
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
const text = (value: unknown) =>
  typeof value === "string" && value.trim() ? value : undefined;
const number = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;
const https = (value: unknown) => {
  const url = text(value);
  return url?.startsWith("https://") ? url : undefined;
};

export function parseMovies(payload: unknown): Movie[] {
  if (!record(payload) || !Array.isArray(payload.results)) {
    throw new ApiError("The movie service returned an unexpected response.");
  }
  const movies = new Map<number, Movie>();
  for (const item of payload.results) {
    if (!record(item) || item.kind !== "feature-movie") continue;
    const id = number(item.trackId);
    const title = text(item.trackName);
    if (!id || !Number.isSafeInteger(id) || id < 1 || !title) continue;
    const runtime = number(item.trackTimeMillis);
    const price = number(item.trackPrice);
    const date = text(item.releaseDate);
    movies.set(id, {
      id,
      title,
      creator: text(item.artistName) ?? "Unknown creator",
      genre: text(item.primaryGenreName) ?? "Movie",
      year:
        date && /^\d{4}-/.test(date) ? date.slice(0, 4) : "Year unavailable",
      synopsis:
        text(item.longDescription) ??
        text(item.shortDescription) ??
        "No synopsis available.",
      artwork: https(item.artworkUrl100),
      runtimeMinutes:
        runtime && runtime > 0 ? Math.round(runtime / 60_000) : undefined,
      rating: text(item.contentAdvisoryRating),
      price: price !== undefined && price >= 0 ? price : undefined,
      currency: text(item.currency),
      storeUrl: https(item.trackViewUrl),
    });
  }
  return [...movies.values()];
}

export const STORE_COUNTRY = "US";
export function searchUrl(term: string) {
  const params = new URLSearchParams({
    term: term.trim(),
    media: "movie",
    entity: "movie",
    country: STORE_COUNTRY,
    limit: "50",
  });
  return `https://itunes.apple.com/search?${params}`;
}
export async function searchMovies(term: string, signal?: AbortSignal) {
  const movies = parseMovies(await getJson(searchUrl(term), signal));
  if (movies.length) return movies;
  // Some storefront responses return no matches with movie filters applied.
  // Broaden the request, then retain only feature-movie records in the mapper.
  const params = new URLSearchParams({
    term: term.trim(),
    country: STORE_COUNTRY,
    limit: "50",
  });
  return parseMovies(
    await getJson(`https://itunes.apple.com/search?${params}`, signal),
  );
}
export async function getMovie(id: number, signal?: AbortSignal) {
  const payload = await getJson(
    `https://itunes.apple.com/lookup?id=${id}&country=${STORE_COUNTRY}`,
    signal,
  );
  return parseMovies(payload).find((movie) => movie.id === id) ?? null;
}
