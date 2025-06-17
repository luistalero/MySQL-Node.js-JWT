import React, { useState } from 'react'
import '../auth/AuthForms.modules.css'

const ForgotPassword = () => {
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.target.email.value.trim()

    if (!email) {
      setMessage('Por favor ingresa tu correo electrónico')
      setMessageType('error')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setMessage('Por favor ingresa un correo electrónico válido')
      setMessageType('error')
      return
    }

    setMessage('Procesando solicitud...')
    setMessageType('info')
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.toLowerCase() })
      })

      const data = await response.json()
      
      if (!response.ok) {
        if (data.error && data.error.includes('email')) {
          throw new Error(data.error);
        }
        throw new Error(data.error || 'Error al procesar la solicitud');
      }
      
      setMessage(data.message || 'Si el email existe, recibirás un correo de recuperación');
      setMessageType('success');
      e.target.reset();
    } catch (error) {
      setMessage(error.message || 'Error de conexión. Inténtalo de nuevo más tarde.');
      setMessageType('error');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="forgotPasswordContainer">
      <h1 className="forgotPasswordTitle">Recuperar Contraseña</h1>
      {message && (
        <div 
          id="message" 
          className={`forgotPasswordText ${messageType}`} 
          style={{ display: message ? 'block' : 'none' }}
        >
          {message}
        </div>
      )}
      <form 
        id="forgot-password-form" 
        className="forgotPasswordForm" 
        onSubmit={handleSubmit}
      >
        <div className="forgotPasswordFormGroup">
          <label htmlFor="email" className="forgot-password-label">Correo Electrónico:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            placeholder="Ingresa tu correo registrado" 
            className="forgotPasswordInput"
          />
        </div>
        <button 
          type="submit" 
          className="forgotPasswordButton" 
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
        </button>
      </form>
      <p className="groupBackToLoginLink">
        <a href="/" className="backToLoginLink">¿Recordaste tu contraseña? Inicia sesión</a>
        <br />
        <a 
          href="/" 
          className="backToLoginLink" 
          style={{ color: '#28a745', textDecoration: 'none' }}
        >
          ← Volver al inicio
        </a>
      </p>
    </div>
  )
}

export default ForgotPassword