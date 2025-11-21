"use client"

const DEFAULT_BASE_URL = "http://localhost:3000"
const runtimeEnv =
  (typeof globalThis !== "undefined" && (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_BASE_URL) ||
  (typeof window !== "undefined" && (window as any)?.NEXT_PUBLIC_API_BASE_URL) ||
  undefined
const baseUrl = runtimeEnv || DEFAULT_BASE_URL

export interface ApiError extends Error {
  status?: number
  data?: unknown
}

function resolveUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${baseUrl}${normalized}`
}

type ApiOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: BodyInit | Record<string, unknown>
  headers?: HeadersInit
  token?: string
  skipJson?: boolean
  rawResponse?: boolean
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, skipJson, rawResponse, headers, body, ...rest } = options
  const finalHeaders = new Headers(headers)
  if (!finalHeaders.has("Content-Type") && body !== undefined && typeof body !== "string" && !(body instanceof FormData)) {
    finalHeaders.set("Content-Type", "application/json")
  }
  if (token) {
    finalHeaders.set("Authorization", `Bearer ${token}`)
  }

  const payload =
    body && typeof body !== "string" && !(body instanceof FormData)
      ? JSON.stringify(body)
      : body

  const response = await fetch(resolveUrl(path), {
    ...rest,
    headers: finalHeaders,
    body: payload,
    cache: "no-store",
  })

  if (!response.ok) {
    let data: unknown = undefined
    try {
      data = await response.json()
    } catch (error) {
    }

    const errorMessage = (data as any)?.message || `Request failed with status ${response.status}`
    const error: ApiError = new Error(errorMessage)
    error.status = response.status
    error.data = data
    
    if (response.status !== 401) {
      console.error(`API Error [${response.status}]:`, errorMessage)
    }
    
    throw error
  }

  if (rawResponse) {
    return response as unknown as T
  }

  if (skipJson) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function getApiBaseUrl() {
  return baseUrl
}
