import { injectable } from "inversify";
import { ApiError } from "./api-error";
import type { ApiClient } from "./api-client.interface";
import type { RequestOptions } from "./request-options";

@injectable()
export class MockApiClient implements ApiClient {
  async get<T>(_url: string, _options?: RequestOptions): Promise<T> {
    throw new ApiError("MockApiClient.get is not implemented.");
  }

  async post<T>(
    _url: string,
    _body?: unknown,
    _options?: RequestOptions
  ): Promise<T> {
    throw new ApiError("MockApiClient.post is not implemented.");
  }

  async patch<T>(
    _url: string,
    _body?: unknown,
    _options?: RequestOptions
  ): Promise<T> {
    throw new ApiError("MockApiClient.patch is not implemented.");
  }

  async delete<T>(_url: string, _options?: RequestOptions): Promise<T> {
    throw new ApiError("MockApiClient.delete is not implemented.");
  }
}
