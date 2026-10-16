export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function getJson(
  url: string,
  signal?: AbortSignal,
): Promise<unknown> {
  const debug = typeof __DEV__ !== "undefined" && __DEV__;
  const started = Date.now();
  if (debug) console.log("[API] GET", url);
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  const timeout = setTimeout(abort, 15_000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (debug)
      console.log(
        "[API] HTTP",
        response.status,
        `${Date.now() - started}ms`,
        url,
      );
    if (!response.ok) {
      throw new ApiError(
        response.status === 429
          ? "Too many requests. Please wait a minute before trying again."
          : "The movie service is unavailable. Please try again.",
        response.status,
      );
    }
    const payload: unknown = await response.json();
    if (debug) console.log("[API] RESPONSE", url, JSON.stringify(payload));
    return payload;
  } catch (error) {
    if (debug)
      console.log(
        "[API] ERROR",
        url,
        `${Date.now() - started}ms`,
        String(error),
      );
    if (signal?.aborted) throw error;
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      "Could not load movies. Check your connection and try again.",
    );
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
}
