import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  getMovie,
  searchMovies,
  STORE_COUNTRY,
} from "@/features/movies/api/movies-api";

export const movieKeys = {
  search: (term: string) => ["movies", STORE_COUNTRY, "search", term] as const,
  detail: (id: number) => ["movies", STORE_COUNTRY, "detail", id] as const,
};
export const movieOptions = (id: number) =>
  queryOptions({
    queryKey: movieKeys.detail(id),
    queryFn: ({ signal }) => getMovie(id, signal),
    enabled: Number.isSafeInteger(id) && id > 0,
  });
export function useMovies(term: string, enabled = true) {
  return useQuery({
    queryKey: movieKeys.search(term),
    queryFn: ({ signal }) => searchMovies(term, signal),
    enabled: enabled && term.length >= 2,
  });
}
