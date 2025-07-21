import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [registrationDetails, setRegistrationDetails] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function handleInput(e) {
        const { name, value } = e.target;
        setRegistrationDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleRegister(e) {
        e.preventDefault(); // ✅ Prevent form reload
        setError('');

        try {
            const res = await fetch("http://localhost:3000/user/register", { // ✅ Fixed API endpoint
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registrationDetails)
            });

            const data = await res.json();

            if (res.ok) {
                alert('🎉 Registration successful! Please login.');
                navigate('/Login'); // ✅ Redirect to Login page
            } else {
                setError(data.message || 'Registration failed!');
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again!');
        }
    }

    return (
        <div className="login-page">
            <form 
                className="login-form d-flex flex-column row-gap-2 justify-content-center align-items-center"
                onSubmit={handleRegister} // ✅ Attach submit handler
            >
                <h2>Register</h2>
                {error && <div style={{ color: 'red' }}>{error}</div>}

                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingName"
                        placeholder="Name"
                        name="name"
                        onChange={handleInput}
                        value={registrationDetails.name}
                        required
                    />
                    <label htmlFor="floatingName">Name</label>
                </div>

                <div className="form-floating mb-3">
                    <input
                        type="tel"
                        className="form-control"
                        id="floatingPhone"
                        placeholder="Mobile Number"
                        name="phoneNumber"
                        onChange={handleInput}
                        value={registrationDetails.phoneNumber}
                        required
                    />
                    <label htmlFor="floatingPhone">Mobile No</label>
                </div>

                <div className="form-floating mb-3">
                    <input
                        type="email"
                        className="form-control"
                        id="floatingEmail"
                        placeholder="Email"
                        name="email"
                        onChange={handleInput}
                        value={registrationDetails.email}
                        required
                    />
                    <label htmlFor="floatingEmail">Email address</label>
                </div>

                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        name="password"
                        onChange={handleInput}
                        value={registrationDetails.password}
                        required
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>

                <button type="submit" className="btn btn-success w-100">
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;
