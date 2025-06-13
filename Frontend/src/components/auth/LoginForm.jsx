import React from 'react'
import '../auth/AuthForms.modules.css'


const LoginForm = ({ onSubmit, message }) => {
  return (
        <div className={"formcontainer"}>
            <form id="login-form" onSubmit={onSubmit}>
                <h2>Login</h2>
                <label htmlFor="login-username">Username</label>
                <input
                    type="text"
                    name="username"
                    id="login-username"
                    required
                    className={"input"}
                />
                <label htmlFor="login-password">Password</label>
                <input
                    type="password"
                    name="password"
                    id="login-password"
                    required
                    className={"input"}
                />

                <button type="submit" className={"button"}>
                    Login
                </button>
                <button
                    id="forgot-password-btn"
                    type="button"
                    onClick={() => (window.location.href = '/forgot-password')}
                    className={"button"}
                >
                    Forgot Password
                </button>
                {message.text && (
                    <span className={`${"message"} ${"[message.type]"}`}>
                        {message.text}
                    </span>
                )}
            </form>
        </div>
  )
}

export default LoginForm
