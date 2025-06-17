import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import '../auth/AuthForms.modules.css'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const password = e.target.password.value
    const confirmPassword = e.target.confirmPassword.value
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      setMessage('La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales')
      setMessageType('error')
      return
    }
    
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden')
      setMessageType('error')
      return
    }
    
    try {
      const response = await fetch(`/api/reset-password?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      })

      const data = await response.json()
      
      if (response.ok) {
        setMessage(data.message || 'Contraseña actualizada correctamente')
        setMessageType('success')
        
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      } else {
        setMessage(data.message || 'Error al actualizar la contraseña')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Error de conexión. Inténtalo de nuevo más tarde.')
      setMessageType('error')
      console.error('Error:', error)
    }
  }

  return (
    <div className="container">
      <h1>Crear Nueva Contraseña</h1>
      <div id="message" className={`message ${messageType}`} style={{display: message ? 'block' : 'none'}}>
        {message}
      </div>
      <form id="reset-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Nueva Contraseña:</label>
          <input type="password" id="password" name="password" required minLength="8" />
          <small>Mínimo 8 caracteres, con mayúsculas, minúsculas y caracteres especiales</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required />
        </div>
        
        <button type="submit">Actualizar Contraseña</button>
      </form>
    </div>
  )
}

export default ResetPassword