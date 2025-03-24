import {
  HttpOptions,
  HttpResponse,
  IHttpClient,
} from '@/core/application/providers/http-client.provider';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export class AxiosHttpClient implements IHttpClient {
  async post<T>(
    url: string,
    data: any,
    options?: HttpOptions,
  ): Promise<HttpResponse<T>> {
    try {
      const config: AxiosRequestConfig = this.prepateConfig(options);

      const response: AxiosResponse = await axios.post(url, data, config);

      return this.formatResponse<T>(response);
    } catch (err) {
      throw this.handleError(err);
    }
  }

  async get<T>(url: string, options?: HttpOptions): Promise<HttpResponse<T>> {
    try {
      const config: AxiosRequestConfig = this.prepateConfig(options);

      const response: AxiosResponse = await axios.get(url, config);

      return this.formatResponse<T>(response);
    } catch (err) {
      throw this.handleError(err);
    }
  }

  async put<T>(
    url: string,
    data: T,
    options?: HttpOptions,
  ): Promise<HttpResponse<T>> {
    try {
      const config: AxiosRequestConfig = this.prepateConfig(options);

      const response = await axios.put(url, data, config);

      return this.formatResponse<T>(response);
    } catch (err) {
      throw this.handleError(err);
    }
  }

  async delete<T>(
    url: string,
    options?: HttpOptions,
  ): Promise<HttpResponse<T>> {
    try {
      const config: AxiosRequestConfig = this.prepateConfig(options);

      const response = await axios.delete(url, config);

      return this.formatResponse<T>(response);
    } catch (err) {
      throw this.handleError(err);
    }
  }

  private formatResponse<T>(response: AxiosResponse): HttpResponse<T> {
    return {
      data: {
        ...response.data,
        message: response.data.message || undefined,
        error: response.data.error || undefined,
      },
      status: response.status,
    };
  }

  private handleError(error: any): HttpResponse<any> {
    let message = 'Unknown error';
    let status = 500;
    let err = message;

    if (error.response) {
      message =
        error.response.data?.message ||
        error.response.data?.error_description ||
        message;
      status = error.response.status || status;
      err = error.response.data?.error || message;
    } else if (error.request) {
      message = 'Network error or no response received';
    } else {
      message = error.message || 'An unexpected error occurred';
    }

    return {
      data: {
        message,
        error: err,
      },
      status,
    };
  }

  private prepateConfig(options?: HttpOptions): AxiosRequestConfig {
    const config: AxiosRequestConfig = {
      headers: options?.headers || {},
      params: options?.params || {},
      responseType: options?.responseType || 'json',
    };

    return config;
  }
}
