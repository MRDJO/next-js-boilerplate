import { inject, injectable } from "inversify";
import type { AuthService } from "@/core/auth/auth.types";
import { env } from "@/core/config/env";
import { TOKENS } from "@/core/di/tokens";
import { ApiError } from "./api-error";
import type { ApiClient } from "./api-client.interface";
import type { RequestOptions } from "./request-options";

const buildRequestBody = (body: unknown) => {
  if (body === undefined) {
    return undefined;
  }

  if (body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
};

@injectable()
export class FetchApiClient implements ApiClient {
  constructor(
    @inject(TOKENS.AuthService) private readonly authService: AuthService
  ) {}

  async get<T>(url: string, options?: RequestOptions) {
    return this.request<T>(url, { ...options, method: "GET" });
  }

  async post<T>(url: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body: buildRequestBody(body),
    });
  }

  async patch<T>(url: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(url, {
      ...options,
      method: "PATCH",
      body: buildRequestBody(body),
    });
  }

  async delete<T>(url: string, options?: RequestOptions) {
    return this.request<T>(url, { ...options, method: "DELETE" });
  }

  private async request<T>(url: string, options: RequestOptions) {
    if (!env.backendBaseUrl) {
      throw new ApiError("NEXTBACKEND_URL is missing.");
    }

    const headers = await this.getHeaders(options.body);
    const response = await fetch(`${env.backendBaseUrl}${url}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const payload = await this.parseResponse(response);

    if (!response.ok) {
      throw new ApiError(
        this.extractMessage(payload) ?? "Request failed.",
        response.status,
        payload
      );
    }

    return payload as T;
  }

  private async getHeaders(body?: BodyInit | null) {
    const token = await this.authService.getAccessToken();
    const isFormData =
      typeof FormData !== "undefined" && body instanceof FormData;

    return {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };
  }

  private async parseResponse(response: Response) {
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return response.json();
    }

    return response.text();
  }

  private extractMessage(payload: unknown) {
    if (!payload || typeof payload !== "object") {
      return undefined;
    }

    if ("message" in payload && typeof payload.message === "string") {
      return payload.message;
    }

    return undefined;
  }
}
