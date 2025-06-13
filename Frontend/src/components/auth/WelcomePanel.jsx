import React from 'react'
import '../auth/AuthForms.modules.css'

const WelcomePanel = ({ onShowLogin, onShowRegister }) => {
  return (
        <div className={"formcontainer welcomeContainer"}>
            <h2 className={"welcomeTitle"}>Bienvenido</h2>
            <p className={"welcomeText"}>¿Qué deseas hacer?</p>
            <button className={"button"} onClick={onShowLogin}>
                Iniciar Sesión
            </button>
            <button className={"button"} onClick={onShowRegister}>
                Registrarse
            </button>
        </div>
  )
}

export default WelcomePanel
