import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { ErrorMessage } from './components/ErrorMessage'
import { Layout } from './components/Layout'
import { GamePage } from './pages/GamePage'
import { HomePage } from './pages/HomePage'

const rootRoute = createRootRoute({
  component: Layout,
  errorComponent: ({ error, reset }) => <ErrorMessage error={error} onRetry={reset} />,
  notFoundComponent: () => <p className="notice">Page not found.</p>,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games/$gameId',
  params: {
    parse: ({ gameId }) => ({ gameId: Number(gameId) }),
    stringify: ({ gameId }) => ({ gameId: String(gameId) }),
  },
  component: GamePage,
})

export const routeTree = rootRoute.addChildren([homeRoute, gameRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
