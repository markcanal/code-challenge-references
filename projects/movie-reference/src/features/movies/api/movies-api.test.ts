import { describe, expect, it, vi } from "vitest";
import { getMovie, parseMovies, searchMovies, searchUrl } from "./movies-api";
const movie = {
  kind: "feature-movie",
  trackId: 42,
  trackName: "A Film",
  trackTimeMillis: 7_200_000,
  trackPrice: 0,
  currency: "USD",
  releaseDate: "2024-01-01T00:00:00Z",
};

describe("movie API boundary", () => {
  it("encodes user input and restricts results to movies", () => {
    const url = new URL(searchUrl("  Jack & Jill  "));
    expect(url.searchParams.get("term")).toBe("Jack & Jill");
    expect(url.searchParams.get("entity")).toBe("movie");
    expect(url.searchParams.get("media")).toBe("movie");
    expect(url.searchParams.get("country")).toBe("US");
  });
  it("maps optional fields, preserves zero prices, filters other media and duplicates", () => {
    const result = parseMovies({
      results: [
        movie,
        movie,
        { kind: "song", trackId: 2 },
        { ...movie, trackId: null },
      ],
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 42,
      title: "A Film",
      year: "2024",
      runtimeMinutes: 120,
      price: 0,
      synopsis: "No synopsis available.",
    });
  });
  it("does not invent missing metadata or accept unsafe URLs", () => {
    expect(
      parseMovies({
        results: [
          {
            ...movie,
            trackPrice: -1,
            artworkUrl100: "javascript:alert(1)",
            trackViewUrl: "http://example.com",
          },
        ],
      })[0],
    ).toMatchObject({
      artwork: undefined,
      storeUrl: undefined,
      price: undefined,
    });
  });
  it("rejects malformed envelopes instead of showing an empty state", () => {
    expect(() => parseMovies({ error: "Unavailable" })).toThrow(
      "unexpected response",
    );
  });
  it("falls back to broad search when movie filters return no results", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ results: [] })))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ results: [movie, { kind: "song", trackId: 99 }] }),
        ),
      );
    vi.stubGlobal("fetch", fetchMock);
    expect(await searchMovies("Batman")).toHaveLength(1);
    const fallback = new URL(fetchMock.mock.calls[1][0]);
    expect(fallback.searchParams.get("term")).toBe("Batman");
    expect(fallback.searchParams.has("entity")).toBe(false);
    expect(fallback.searchParams.has("media")).toBe(false);
    vi.unstubAllGlobals();
  });
  it("returns null when a lookup has no matching movie", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ results: [] }))),
    );
    expect(await getMovie(42)).toBeNull();
    vi.unstubAllGlobals();
  });
  it("passes cancellation to the transport and maps successful results", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ results: [movie] })));
    vi.stubGlobal("fetch", fetchMock);
    const controller = new AbortController();
    expect(await searchMovies("film", controller.signal)).toHaveLength(1);
    expect(fetchMock.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
    vi.unstubAllGlobals();
  });
});
