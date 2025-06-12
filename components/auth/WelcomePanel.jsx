import React from 'react'
import styles from './AuthForms.module.css'

const WelcomePanel = ({ onShowLogin, onShowRegister }) => {
  return (
        <div className={`${styles.formContainer} ${styles.welcomeContainer}`}>
            <h2 className={styles.welcomeTitle}>Bienvenido</h2>
            <p className={styles.welcomeText}>¿Qué deseas hacer?</p>
            <button className={styles.button} onClick={onShowLogin}>
                Iniciar Sesión
            </button>
            <button className={styles.button} onClick={onShowRegister}>
                Registrarse
            </button>
        </div>
  )
}

export default WelcomePanel
