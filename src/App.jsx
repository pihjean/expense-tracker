import { useEffect, useRef, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // True kung galing sa email confirmation link (/login?confirmed=true)
  const [confirmed] = useState(
    () => new URLSearchParams(window.location.search).get('confirmed') === 'true'
  )
  const handlingConfirm = useRef(confirmed)

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession()

      if (confirmed && data.session) {
        // Auto-login galing sa confirmation link: i-sign out para sa Login mapunta
        await supabase.auth.signOut()
        setSession(null)
      } else {
        setSession(data.session)
      }

      if (confirmed) {
        // Tanggalin ang tokens sa URL, iwan ang ?confirmed=true
        window.history.replaceState(null, '', '/login?confirmed=true')
      }

      handlingConfirm.current = false
      setLoading(false)
    }
    init()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (handlingConfirm.current) return
        setSession(newSession)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [confirmed])

  if (loading) {
    return (
      <div className="auth-page">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={session ? '/dashboard' : '/login'} replace />}
      />
      <Route
        path="/login"
        element={
          session ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login confirmed={confirmed} />
          )
        }
      />
      <Route
        path="/register"
        element={session ? <Navigate to="/dashboard" replace /> : <Register />}
      />
      <Route
        path="/dashboard"
        element={
          session ? (
            <Dashboard session={session} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}