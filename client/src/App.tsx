import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AlertsPage from './pages/AlertsPage'
import AuthPage from './pages/AuthPage'
import SymbolsPage from './pages/SymbolsPage'
import WatchlistPage from './pages/WatchlistPage'

// Every page shows the user's own data, so all of them require login.
const protect = (page: ReactNode) => <ProtectedRoute>{page}</ProtectedRoute>

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/symbols" replace />} />
        <Route path="alerts" element={protect(<AlertsPage />)} />
        <Route path="watchlist" element={protect(<WatchlistPage />)} />
        <Route path="symbols" element={protect(<SymbolsPage />)} />
        <Route path="login" element={<AuthPage mode="login" />} />
        <Route path="register" element={<AuthPage mode="register" />} />
        <Route path="*" element={<Navigate to="/symbols" replace />} />
      </Route>
    </Routes>
  )
}
