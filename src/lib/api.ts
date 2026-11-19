
import { authClient } from "@/lib/auth-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ApiOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
  authenticated?: boolean;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    authenticated = false,
    headers,
    ...fetchOptions
  } = options;

  const requestHeaders = new Headers(headers);

  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error(error?.message || "Authentication required.");
    }

    requestHeaders.set("Authorization", `Bearer ${data.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result as T;
}
