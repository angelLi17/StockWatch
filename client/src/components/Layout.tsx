import { signOut } from 'firebase/auth'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { auth } from '../lib/firebase'

const navItems = [
  { to: '/alerts', label: 'Alerts' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/symbols', label: 'Symbols' },
]

export default function Layout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      <header className="bg-navy">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-6">
          <Link to="/" className="text-3xl font-bold tracking-tight">
            StockWatch
          </Link>
          {user && (
            <div className="ml-auto flex items-center gap-4 text-sm">
              <span className="hidden text-muted sm:inline">{user.email}</span>
              <button onClick={() => signOut(auth)} className="text-muted hover:text-ink">
                Log out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pt-8 pb-36">
        <Outlet />
      </main>

      {user && (
        <nav className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 rounded-full bg-navy px-3 py-2 shadow-lg shadow-black/50">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-6 py-2 text-sm font-medium transition-colors sm:px-10 ${
                  isActive ? 'text-ink' : 'text-dim hover:text-soft'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}
