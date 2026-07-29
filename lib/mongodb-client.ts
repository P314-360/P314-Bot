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
 * GET request to API
 */
export async function getFromApi<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
  const url = new URL(endpoint, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return fetchFromApi<T>(url.toString(), {
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
