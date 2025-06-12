import React, { useState } from 'react'
import styles from './AuthForms.module.css'
import WelcomePanel from './WelcomePanel'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

const AuthForms = () => {
  const [activeForm, setActiveForm] = useState(null)
  const [loginMessage, setLoginMessage] = useState({ text: '', type: '' })
  const [registerMessage, setRegisterMessage] = useState({ text: '', type: '' })

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const { username, password } = Object.fromEntries(formData)

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      if (response.ok) {
        setLoginMessage({ text: 'Sesión iniciada.... Entrando...', type: 'success' })
        setTimeout(() => {
          window.location.href = '/protected'
        }, 2000)
      } else {
        setLoginMessage({ text: 'Error al iniciar sesión', type: 'error' })
      }
    } catch (error) {
      setLoginMessage({ text: 'Error al iniciar sesión', type: 'error' })
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
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          username: data.username,
          password: data.password,
          role: data.role
        })
      })

      if (response.ok) {
        setRegisterMessage({ text: 'Usuario registrado correctamente', type: 'success' })
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      } else {
        setRegisterMessage({ text: 'Error al registrar el usuario', type: 'error' })
      }
    } catch (error) {
      setRegisterMessage({ text: 'Error al registrar el usuario', type: 'error' })
    }
  }

  const showLogin = () => setActiveForm('login')
  const showRegister = () => setActiveForm('register')

  return (
        <div className={styles.body}>
            <div className={styles.container}>
                {!activeForm && <WelcomePanel onShowLogin={showLogin} onShowRegister={showRegister} />}

                {activeForm === 'login' && (
                    <LoginForm onSubmit={handleLoginSubmit} message={loginMessage} />
                )}

                {activeForm === 'register' && (
                    <RegisterForm onSubmit={handleRegisterSubmit} message={registerMessage} />
                )}
            </div>
        </div>
  )
}

export default AuthForms
