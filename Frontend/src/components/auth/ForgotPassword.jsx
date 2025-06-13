import React, { useState } from 'react'
import '../auth/AuthForms.modules.css'

const ForgotPassword = () => {
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('Procesando solicitud...')
    setMessageType('')
    
    const email = e.target.email.value
    
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      
      setMessage(data.message)
      setMessageType(response.ok ? 'success' : 'error')
    } catch (error) {
      setMessage('Error de conexión. Inténtalo de nuevo más tarde.')
      setMessageType('error')
      console.error('Error:', error)
    }
  };

  return (
    <div className="container">
      <h1>Recuperar Contraseña</h1>
      <div id="message" className={`message ${messageType}`} style={{display: message ? 'block' : 'none'}}>
        {message}
      </div>
      <form id="forgot-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <button type="submit">Enviar Enlace de Recuperación</button>
      </form>
      <p style={{marginTop: '15px'}}>
        <a href="/" style={{color: '#28a745', textDecoration: 'none'}}>← Volver al inicio</a>
      </p>
    </div>
  )
}

export default ForgotPassword