import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { routeTree } from '../router'

type Handler = (body: unknown) => { status?: number; body?: unknown }

/**
 * Replaces fetch with a fake API. Keys are "METHOD /path" (query string included).
 * Unknown routes answer 404.
 */
export function mockApi(routes: Record<string, Handler>) {
  const fetchMock = vi.fn(async (url: string, init: RequestInit = {}) => {
    const key = `${init.method ?? 'GET'} ${url}`
    const handler = routes[key]
    if (!handler) return new Response(null, { status: 404 })
    const { status = 200, body } = handler(init.body ? JSON.parse(String(init.body)) : undefined)
    return new Response(body === undefined ? null : JSON.stringify(body), { status })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

/** Renders the whole app (router + query client) at the given URL. */
export function renderApp(path: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  })
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}
