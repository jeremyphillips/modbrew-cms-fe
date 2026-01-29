import type { ApiPayload } from '~api/base'

const apiBase = import.meta.env.VITE_API_BASE

export interface ApiError {
  message: string
  status: number
}

export async function apiFetch<T = ApiPayload>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${apiBase}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API request failed: ${res.status} - ${text}, options: ${JSON.stringify(options)}`)
  }

  return res.json()
}
