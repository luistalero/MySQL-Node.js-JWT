import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../index.css'

const ProtectedArea = ({ user }) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      })
      navigate('/')
      window.location.reload()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <div className="protected-container">
      <h1>Área Protegida</h1>
      <div className="user-info">
        <p>Bienvenido, <strong>{user.username}</strong></p>
        <p>Tu rol es: <strong>{user.role}</strong></p>
        <p>Email: <strong>{user.email}</strong></p>
      </div>

      <div className="actions">
        {user.role === 'admin' && (
          <button
            className="btn admin-btn"
            onClick={() => navigate('/admin')}
          >
            Panel de Administración
          </button>
        )}

        <button
          className="btn user-btn"
          onClick={() => navigate('/user')}
        >
          Panel de Usuario
        </button>

        <button
          className="btn logout-btn"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}

export default ProtectedArea
