type QueryValue = string | number | boolean | null | undefined;

type RequestJsonOptions = RequestInit & {
  apiName: string;
  query?: Record<string, QueryValue>;
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
  const value = process.env[name];

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
  { apiName, query, headers, ...init }: RequestJsonOptions,
): Promise<T> {
  const response = await fetch(createUrl(baseUrl, query), {
    ...init,
    headers: {
      Accept: "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const detail = body ? `: ${body.slice(0, 240)}` : "";

    throw new ApiClientError(
      `${apiName} request failed with ${response.status}${detail}`,
      response.status,
    );
  }

  return (await response.json()) as T;
}
