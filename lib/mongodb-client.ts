// ═══════════════════════════════════════════════════════════════════════════════
// MongoDB Client Wrapper (Client-side utilities)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Client-side MongoDB utilities
 * Note: Actual database operations should go through API routes
 */

/**
 * Fetch data from API endpoint
 */
export async function fetchFromApi<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`[MongoDB Client] Fetch error from ${endpoint}:`, error)
    throw error
  }
}

/**
 * POST request to API
 */
export async function postToApi<T = any>(endpoint: string, data: any): Promise<T> {
  return fetchFromApi<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * GET request to API.
 * Accepts relative paths (e.g. "/api/chat") from the browser — Next.js resolves them
 * against the current origin automatically. On the server we build the absolute URL
 * from NEXT_PUBLIC_APP_URL which is auto-injected by next.config.mjs from VERCEL_URL.
 */
export async function getFromApi<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
  // On the client, window.location.origin is always correct — no hardcoded domain needed.
  // On the server, NEXT_PUBLIC_APP_URL is injected by next.config.mjs from Vercel env vars.
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || ""

  // If no baseUrl is available (e.g. during local dev without the var set) and the
  // endpoint is already absolute, use it directly.
  const resolvedUrl = baseUrl ? new URL(endpoint, baseUrl) : new URL(endpoint)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        resolvedUrl.searchParams.append(key, String(value))
      }
    })
  }

  return fetchFromApi<T>(resolvedUrl.toString(), {
    method: "GET",
  })
}

/**
 * PUT request to API
 */
export async function putToApi<T = any>(endpoint: string, data: any): Promise<T> {
  return fetchFromApi<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * DELETE request to API
 */
export async function deleteFromApi<T = any>(endpoint: string): Promise<T> {
  return fetchFromApi<T>(endpoint, {
    method: "DELETE",
  })
}

/**
 * Batch request to API (for multiple operations)
 */
export async function batchRequestToApi<T = any>(endpoint: string, operations: any[]): Promise<T> {
  return postToApi<T>(endpoint, {
    batch: operations,
  })
}
