import React from 'react'
import styles from './AuthForms.module.css'

const LoginForm = ({ onSubmit, message }) => {
  return (
        <div className={styles.formContainer}>
            <form id="login-form" onSubmit={onSubmit}>
                <h2>Login</h2>
                <label htmlFor="login-username">Username</label>
                <input
                    type="text"
                    name="username"
                    id="login-username"
                    required
                    className={styles.input}
                />
                <label htmlFor="login-password">Password</label>
                <input
                    type="password"
                    name="password"
                    id="login-password"
                    required
                    className={styles.input}
                />

                <button type="submit" className={styles.button}>
                    Login
                </button>
                <button
                    id="forgot-password-btn"
                    type="button"
                    onClick={() => (window.location.href = '/forgot-password')}
                    className={styles.button}
                >
                    Forgot Password
                </button>
                {message.text && (
                    <span className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </span>
                )}
            </form>
        </div>
  )
}

export default LoginForm
