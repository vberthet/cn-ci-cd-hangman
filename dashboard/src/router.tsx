import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { ErrorMessage } from './components/ErrorMessage'
import { Layout } from './components/Layout'
import { DictionaryPage } from './pages/DictionaryPage'
import { GamesPage } from './pages/GamesPage'
import { OverviewPage } from './pages/OverviewPage'

const rootRoute = createRootRoute({
  component: Layout,
  errorComponent: ({ error, reset }) => <ErrorMessage error={error} onRetry={reset} />,
  notFoundComponent: () => <p className="notice">Page not found.</p>,
})

const overviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: OverviewPage,
})

const dictionaryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dictionary',
  component: DictionaryPage,
})

const gamesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games',
  component: GamesPage,
})

export const routeTree = rootRoute.addChildren([overviewRoute, dictionaryRoute, gamesRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
