import React, { useState } from 'react';
import './Login.css';
import { useNavigate, useLocation } from 'react-router-dom';

function Login() {
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    function handleInput(e) {
        const { name, value } = e.target;
        setLoginForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleLogin(e) {
        e.preventDefault(); // ✅ stop page reload
        setError(''); // Clear previous error

        try {
            const res = await fetch('https://blog-backend-gktd.onrender.com', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginForm)
            });

            const data = await res.json();

            if (res.ok) {
                // ✅ Save user to localStorage
                localStorage.setItem('user', JSON.stringify(data.user)); // or adjust based on your API
                alert('🎉 Login successful!');
                navigate(from, { replace: true }); // ✅ Redirect back to where user was
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Try again!');
        }
    }

    return (
        <div className="login-page">
            <form 
                className="login-form d-flex flex-column row-gap-2 justify-content-center align-items-center"
                onSubmit={handleLogin} // ✅ Attach to form
            >
                <h2>Login</h2>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <div className="form-floating mb-3">
                    <input
                        type="email"
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        name="email"
                        onChange={handleInput}
                        value={loginForm.email}
                        required
                    />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        name="password"
                        onChange={handleInput}
                        value={loginForm.password}
                        required
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <button type="submit" className="btn btn-success w-100">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
