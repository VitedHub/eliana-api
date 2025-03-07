export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface HttpResponse<T> {
  data: T & { message?: string; error?: string };
  status: number;
}

export interface HttpOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
  responseType?:
    | 'json'
    | 'arraybuffer'
    | 'blob'
    | 'text'
    | 'document'
    | 'stream'
    | 'formdata';
}

export abstract class IHttpClient {
  abstract post<T>(
    url: string,
    data: any,
    options?: HttpOptions,
  ): Promise<HttpResponse<T>>;
  abstract get<T>(url: string, options?: HttpOptions): Promise<HttpResponse<T>>;
  abstract put<T>(
    url: string,
    data: any,
    options?: HttpOptions,
  ): Promise<HttpResponse<T>>;
  abstract delete<T>(
    url: string,
    options?: HttpOptions,
  ): Promise<HttpResponse<T>>;
}
