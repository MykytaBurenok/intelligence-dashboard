type QueryValue = string | number | boolean | null | undefined;

type RequestJsonOptions = RequestInit & {
  apiName: string;
  query?: Record<string, QueryValue>;
  timeoutMs?: number;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new ApiClientError(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function createUrl(
  baseUrl: string,
  query?: Record<string, QueryValue>,
): string {
  const url = new URL(baseUrl);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== null && value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

export async function requestJson<T>(
  baseUrl: string,
  { apiName, query, headers, timeoutMs = 10_000, signal, ...init }: RequestJsonOptions,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const abortFromCaller = () => controller.abort();

  if (signal?.aborted) {
    controller.abort();
  } else {
    signal?.addEventListener("abort", abortFromCaller, { once: true });
  }

  try {
    const response = await fetch(createUrl(baseUrl, query), {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...headers,
      },
    });

    if (!response.ok) {
      // Do not echo arbitrary upstream response bodies into server logs or UI errors.
      throw new ApiClientError(
        `${apiName} request failed with HTTP ${response.status}`,
        response.status,
      );
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new ApiClientError(`${apiName} returned an invalid JSON response`, response.status);
    }
  } catch (error) {
    if (error instanceof ApiClientError) throw error;

    if (controller.signal.aborted) {
      throw new ApiClientError(
        signal?.aborted
          ? `${apiName} request was cancelled`
          : `${apiName} request timed out after ${timeoutMs}ms`,
      );
    }

    throw new ApiClientError(`${apiName} request failed due to a network error`);
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abortFromCaller);
  }
}
