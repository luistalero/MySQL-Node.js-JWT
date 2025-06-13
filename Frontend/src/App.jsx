import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedArea from './components/auth/Protected'
import AdminPanel from './components/auth/AdminPanel'
import UserPanel from './components/auth/UserPanel'
import ForgotPassword from './components/auth/ForgotPassword.jsx'
import ResetPassword from './components/auth/ResetPassword'
import './index.css'
import WelcomePanel from './components/auth/WelcomePanel'

function App () {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  return (
    <Router>
      <div className="app">
        <Routes>
        <Route path="/api" element={<WelcomePanel />} />
          {/* <Route path="/" element={
            !user ? <AuthForms setUser={setUser} /> : <Navigate to="/protected" />
          } /> */}
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/protected" element={
            user ? <ProtectedArea user={user} /> : <Navigate to="/" />
          } />
          <Route path="/admin" element={
            user?.role === 'admin' ? <AdminPanel user={user} /> : <Navigate to="/" />
          } />
          <Route path="/user" element={
            user ? <UserPanel user={user} /> : <Navigate to="/" />
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
