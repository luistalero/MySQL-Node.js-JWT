import React from 'react'
import '../auth/AuthForms.modules.css'

const RegisterForm = ({ onSubmit, message = {}, onBack }) => {
  return (
        <div className={"formContainer"}>
            <form id="register-form" onSubmit={onSubmit}>
                <h2>Register</h2>
                <label htmlFor="register-email">Email</label>
                <input
                    type="email"
                    name="email"
                    id="register-email"
                    required
                    className={"input"}
                />

                <label htmlFor="register-username">Username</label>
                <input
                    type="text"
                    name="username"
                    id="register-username"
                    required
                    className={"input"}
                />

                <label htmlFor="register-password">Password</label>
                <input
                    type="password"
                    name="password"
                    id="register-password"
                    required
                    className={"input"}
                />

                <label htmlFor="register-confirm-password">Confirm Password</label>
                <input
                    type="password"
                    name="confirm-password"
                    id="register-confirm-password"
                    required
                    className={"input"}
                />
                <label htmlFor="register-role">Role</label>
                <select
                    name="role"
                    id="register-role"
                    required
                    className={"input"}
                    style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                {message?.text && (
                    <span className={`${"message"} ${"message.type" ? "[message.type]" : ''}`}>
                    {message.text}
                  </span>
                )}

                <button type="submit" className={"button"}>
                    Register
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

export default RegisterForm
