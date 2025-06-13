import React from 'react'

const AdminPanel = ({ user }) => {
  return (
    <div>
      <h1>Hola {user.username}</h1>
      <h2>Estas en la seccion de Admin</h2>

      <button 
        style={{marginTop: '30px', backgroundColor: '#dc3545'}} 
        onClick={() => window.location.href='/'}
      >
        Volver
      </button>
      <button 
        style={{marginTop: '10px', backgroundColor: '#007bff'}} 
        onClick={() => window.location.href='/protected'}
      >
        Protected
      </button>
    </div>
  )
}

export default AdminPanel