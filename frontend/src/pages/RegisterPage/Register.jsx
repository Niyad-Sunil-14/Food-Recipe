import React, { useState } from 'react'
import './Register.css'
import axiosInstance from '../../api/axiosConfig'
import { NavLink, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [username,setUsername] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [conformPassword,setConformPassword] = useState('')

  const [errors,setErrors]=useState({})

  const [successMessage,setSuccessMessage] = useState('')

  const [loading,setLoading] = useState(false)

  const handleSubmit = async (e) => {
        // Prevent the default browser form submission behavior
        e.preventDefault();

        // 1. Client-side validation: Check if passwords match
        if (password !== conformPassword) {
            setErrors({ conformPassword: "Passwords do not match." });
            return; // Stop the submission
        }

        // 2. Clear any previous errors
        setErrors({});

        try {
            // 3. Make the API call to the registration endpoint
            // dj-rest-auth expects username, email, password, and password2
            const response = await axiosInstance.post('/register/', {
                username: username,
                email: email,
                password: password,
                conformPassword: conformPassword,
            });

            // Set the success message instead of navigating immediately
            setLoading(true)
            setSuccessMessage('Registration successful! Redirecting to login...');

            setTimeout(() => {
                navigate('/login');
            }, 3000);
            
        } catch (err) {
            // 5. Handle errors
            if (err.response && err.response.data) {
                // Set the errors state with the validation errors from the backend
                console.error('Registration failed:', err.response.data);
                setErrors(err.response.data);
            } else {
                // Handle network errors or other unexpected issues
                console.error('An unexpected error occurred:', err);
                setErrors({ general: 'An unexpected error occurred. Please try again.' });
            }
        }
    };

  return (
    <div className="auth-page-wrapper">
      <div className="form-container">
        <form onSubmit={handleSubmit} method="post">
            <h2>Join Us! 🥕</h2>
            <p>Create your account to start planning.</p>

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
                <input value={username} onChange={(e)=>setUsername(e.target.value)} type="text" id="username" name="username" placeholder="Choose a username" required/>
                {errors.username && <p style={{ color: 'red', fontSize: '0.8rem' , marginBottom: '0px' }}>{errors.username}</p>}

            </div>

            <div className="input-group">
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" id="email" name="email" placeholder="Enter your email" required/>
                {errors.email && <p style={{ color: 'red', fontSize: '0.8rem',marginBottom: '0px' }}>{errors.email}</p>}
            </div>
            
            <div className="input-group">
                <label htmlFor="password">Password</label>
                <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" id="password" name="password" placeholder="Create a password" required/>
                {errors.password && <p style={{ color: 'red', fontSize: '0.8rem',marginBottom: '0px' }}>{errors.password}</p>}
            </div>

            <div className="input-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input value={conformPassword} onChange={(e)=>setConformPassword(e.target.value)} type="password" id="confirm-password" name="confirm-password" placeholder="Confirm your password" required/>
                {errors.conformPassword && <p style={{ color: 'red', fontSize: '0.8rem',marginBottom: '0px' }}>{errors.conformPassword}</p>}
            </div>
            
            <button type="submit" className="btn">{loading ? 'Registering...' : 'Register'}</button>
            
            <div className="form-footer">
                <p>Already have an account? <NavLink to="/login">Sign up</NavLink></p>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Register
