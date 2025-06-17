import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../auth/AuthForms.modules.css'

const UserPanel = ({ user }) => {
  const navigate =  useNavigate()
  return (
    <div>
      <h1>Hola {user.username}</h1>
      <h2>Estas en la seccion de Usuarios</h2>

      <button 
        style={{marginTop: '30px', backgroundColor: '#dc3545'}} 
        onClick={() => navigate('/')}
      >
        Volver
      </button>
    </div>
  )
}

export default UserPanel