import { afterEach, describe, expect, it, vi } from "vitest";
import { getJson } from "./http";
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
describe("HTTP failures", () => {
  it("preserves rate limit status for retry policy", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("", { status: 429 })),
    );
    await expect(getJson("https://example.com")).rejects.toMatchObject({
      status: 429,
    });
  });
  it("provides a useful network error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Network failed")),
    );
    await expect(getJson("https://example.com")).rejects.toThrow(
      "Check your connection",
    );
  });
  it("aborts in-flight transport when the caller cancels", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url, options) =>
          new Promise((_resolve, reject) => {
            options.signal.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")),
            );
          }),
      ),
    );
    const controller = new AbortController();
    const request = getJson("https://example.com", controller.signal);
    controller.abort();
    await expect(request).rejects.toMatchObject({ name: "AbortError" });
  });
  it("times out a stalled request", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url, options) =>
          new Promise((_resolve, reject) => {
            options.signal.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")),
            );
          }),
      ),
    );
    const assertion = expect(getJson("https://example.com")).rejects.toThrow(
      "Check your connection",
    );
    await vi.advanceTimersByTimeAsync(15_000);
    await assertion;
  });
});
