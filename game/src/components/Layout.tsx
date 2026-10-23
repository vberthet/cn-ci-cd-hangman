import { Link, Outlet } from '@tanstack/react-router'
import { Footer } from './Footer'

export function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="brand">
          Hangman
        </Link>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
