import React, { useState } from 'react'
import styles from './AuthForms.module.css'
import WelcomePanel from './WelcomePanel'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

const AuthForms = ({ setUser }) => {
  const [activeForm, setActiveForm] = useState(null)
  const [loginMessage, setLoginMessage] = useState({ text: '', type: '' })
  const [registerMessage, setRegisterMessage] = useState({ text: '', type: '' })

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const { username, password } = Object.fromEntries(formData)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        setLoginMessage({ text: 'Inicio de sesión exitoso', type: 'success' })
        setUser(data.user)
      } else {
        setLoginMessage({ text: data.error || 'Error al iniciar sesión', type: 'error' })
      }
    } catch (error) {
      setLoginMessage({ text: 'Error de conexión', type: 'error' })
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    if (data.password !== data['confirm-password']) {
      setRegisterMessage({ text: 'Las contraseñas no coinciden', type: 'error' })
      return
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          username: data.username,
          password: data.password,
          role: data.role
        }),
        credentials: 'include'
      })

      const result = await response.json()

      if (response.ok) {
        setRegisterMessage({
          text: 'Registro exitoso. Redirigiendo...',
          type: 'success'
        })
        setTimeout(() => {
          setActiveForm('login')
          setRegisterMessage({ text: '', type: '' })
        }, 2000)
      } else {
        setRegisterMessage({
          text: result.error || 'Error al registrar',
          type: 'error'
        })
      }
    } catch (error) {
      setRegisterMessage({ text: 'Error de conexión', type: 'error' })
    }
  }

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        {!activeForm && (
          <WelcomePanel
            onShowLogin={() => setActiveForm('login')}
            onShowRegister={() => setActiveForm('register')}
          />
        )}

        {activeForm === 'login' && (
          <LoginForm
            onSubmit={handleLoginSubmit}
            message={loginMessage}
            onBack={() => setActiveForm(null)}
          />
        )}

        {activeForm === 'register' && (
          <RegisterForm
            onSubmit={handleRegisterSubmit}
            message={registerMessage}
            onBack={() => setActiveForm(null)}
          />
        )}
      </div>
    </div>
  )
}

export default AuthForms
