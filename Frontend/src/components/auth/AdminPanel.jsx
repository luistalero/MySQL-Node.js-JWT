import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdminPanel = ({ user }) => {
  const navigate = useNavigate()
  return (
    <div>
      <h1>Hola {user.username}</h1>
      <h2>Estas en la seccion de Admin</h2>

      <button 
        style={{marginTop: '30px', backgroundColor: '#dc3545'}} 
        onClick={() => navigate('/')}
      >
        Volver
      </button>
    </div>
  )
}

export default AdminPanel