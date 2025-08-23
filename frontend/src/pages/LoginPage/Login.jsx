import React from 'react'
import './Login.css'
import { useNavigate,NavLink } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { useState } from 'react';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [loading,setLoading] = useState(false)

    const [successMessage,setSuccessMessage] = useState('')
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors on a new submission

        try {
            // Make POST request to the /api/login/ endpoint
            const response = await axiosInstance.post('/login/', {
                username: username,
                password: password
            });

            // Save tokens to localStorage
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            
            setSuccessMessage('Login successful!');

            setLoading(true)

            setTimeout(() => {
                navigate('/');
            }, 3000);

        } catch (err) {
            setError('Invalid username or password.');
            console.error(err);
        }
    };

  return (
    <div className="auth-page-wrapper">
    <div className="form-container">
        <form onSubmit={handleSubmit} method="post">
            <h2>Welcome Back! 🥗</h2>
            <p>Plan your delicious meals today.</p>

            {/* Success Message Pop-up */}
            {successMessage && (
                <div style={{ 
                    padding: '1rem', 
                    marginBottom: '1rem', 
                    backgroundColor: '#d4edda', 
                    color: '#155724', 
                    border: '1px solid #c3e6cb', 
                    borderRadius: '5px' 
                }}>
                    {successMessage}
                </div>
            )}
            
            <div className="input-group">
                <label htmlFor="username">Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" id="username" name="username" placeholder="Enter your username" required/>
            </div>
            
            <div className="input-group">
                <label htmlFor="password">Password</label>
                <input value={password} onChange={(e)=> setPassword(e.target.value)} type="password" id="password" name="password" placeholder="Enter your password" required/>
            </div>
            
            {/* <div className="options">
                 <label className="remember-me">
                    <input type="checkbox" name="remember"/> Remember Me
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a> 
            </div> */}

            {error && (
                <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
                    {error}
                </p>
            )}
            
            <button type="submit" className="btn">{loading ? "Logging in..." : "Login"}</button>
            
            <div className="form-footer">
                <p>Don't have an account? <NavLink to="/register">Sign up</NavLink></p>
            </div>
        </form>
    </div>
    </div>
  )
}

export default Login
