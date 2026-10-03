export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

export type HttpHeaders = Record<string, string>;

type Httpany = any;
type HttpHeadersInit = any;

export interface HttpRequestInit {
  method?: HttpMethod;
  headers?: HttpHeaders;
  body?: any;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export class HttpError extends Error {
  readonly status: number;
  readonly url: string;

  constructor(status: number, url: string, message?: string) {
    super(message ?? `Request failed with status ${status}`);
    this.name = 'HttpError';
    this.status = status;
    this.url = url;
  }
}

export interface HttpClient {
  request<T = unknown>(url: string, init?: HttpRequestInit): Promise<T>;
  get<T = unknown>(url: string, init?: Omit<HttpRequestInit, 'method'>): Promise<T>;
  post<T = unknown>(
    url: string,
    body?: any | null,
    init?: Omit<HttpRequestInit, 'method' | 'body'>
  ): Promise<T>;
}

function normalizeHeaders(init?: HttpRequestInit): HttpHeadersInit {
  return init?.headers ?? {};
}

export class FetchHttpClient implements HttpClient {
  async request<T = unknown>(url: string, init?: HttpRequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutMs = init?.timeoutMs ?? 10_000;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    const signal = init?.signal
      ? AbortSignal.any([controller.signal, init.signal])
      : controller.signal;

    try {
      const res = await (globalThis as any).fetch(url, {
        method: init?.method ?? 'GET',
        headers: normalizeHeaders(init),
        body: init?.body as any,
        signal,
      });

      if (!res.ok) {
        throw new HttpError(res.status, url);
      }

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return (await (res as any).json()) as T;
      }

      return (await (res as any).text()) as unknown as T;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request to ${url} timed out or was aborted`);
      }
      throw error instanceof Error ? error : new Error(String(error));
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T = unknown>(url: string, init?: Omit<HttpRequestInit, 'method'>): Promise<T> {
    return this.request<T>(url, { ...init, method: 'GET' });
  }

  post<T = unknown>(
    url: string,
    body?: any,
    init?: Omit<HttpRequestInit, 'method' | 'body'>
  ): Promise<T> {
    return this.request<T>(url, { ...init, method: 'POST', body });
  }
}

export const defaultHttpClient = new FetchHttpClient();
