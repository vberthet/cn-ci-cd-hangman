import { Link, Outlet } from '@tanstack/react-router'
import { Footer } from './Footer'

export function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <span className="brand">Hangman Dashboard</span>
        <nav className="nav">
          <Link to="/" activeOptions={{ exact: true }}>
            Overview
          </Link>
          <Link to="/dictionary">Dictionary</Link>
          <Link to="/games">Recent games</Link>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
