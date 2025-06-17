import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedArea from './components/auth/Protected'
import AdminPanel from './components/auth/AdminPanel'
import UserPanel from './components/auth/UserPanel'
import ForgotPassword from './components/auth/ForgotPassword.jsx'
import ResetPassword from './components/auth/ResetPassword'
import './index.css'
import AuthForms from './components/auth/AuthForm'

function App() {
  const [user, setUser] = useState(null)

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={!user ? <AuthForms setUser={setUser} /> : <Navigate to="/protected" />} />
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