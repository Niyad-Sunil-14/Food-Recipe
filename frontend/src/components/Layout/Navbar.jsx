import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// This component provides the main navigation for the application.
// It uses NavLink to highlight the currently active page.
// It also conditionally renders links for authenticated and unauthenticated users.
function Navbar() {
    const navigate = useNavigate();
    
    // A simple check to see if the user is authenticated.
    // In a real app, this would be managed more robustly with context or Redux.
    const isAuthenticated = !!localStorage.getItem('access_token');

    // Handles the logout process.
    const handleLogout = () => {
        // Remove the tokens from local storage.
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Redirect the user to the login page.
        navigate('/login');
    };

    return (
        <div>
        <div style={linhaStyle}></div>
        <nav style={navStyle}>
            <div style={containerStyle}>
                {/* Brand/Logo Link */}
                <NavLink to="/" style={brandStyle}>
                    Dishly
                </NavLink>

                {/* Main Navigation Links */}
                <div style={linksContainerStyle}>
                    <NavLink to="/" style={linkStyle} className={({ isActive }) => (isActive ? 'active-link' : '')}>
                        Home
                    </NavLink>
                    <NavLink to="/recipe" style={linkStyle} className={({ isActive }) => (isActive ? 'active-link' : '')}>
                        Recipes
                    </NavLink>
                    
                    {/* Conditionally render Meal Planner link for logged-in users */}
                    {isAuthenticated && (
                        <NavLink to="/mealplanner" style={linkStyle} className={({ isActive }) => (isActive ? 'active-link' : '')}>
                            Meal Planner
                        </NavLink>
                    )}
                </div>

                {/* Auth Links */}
                <div style={authLinksStyle}>
                    {isAuthenticated ? (
                        // If user is logged in, show Profile and Logout
                        <>
                            <NavLink to="/profile" style={linkStyle} className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                Profile
                            </NavLink>
                            <button onClick={handleLogout} style={buttonStyle}>
                                Logout
                            </button>
                        </>
                    ) : (
                        // If user is not logged in, show Login and Register
                        <>
                            <NavLink to="/login" style={linkStyle} className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                Login
                            </NavLink>
                            <NavLink to="/register" style={buttonLinkStyle}>
                                Register
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
            
            {/* Basic CSS for active link styling */}
            <style>{`
                .active-link {
                    font-weight: bold;
                    color: #007bff;
                    text-decoration: underline;
                }
            `}</style>
        </nav>
        </div>
    );
}

// Basic inline styles for demonstration purposes.
// In a real application, you would use CSS modules or a library like Tailwind CSS.
const linhaStyle ={
    width: '100%',
    height: '30px',
    background: '#FFDB63',
}

const navStyle = {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    padding: '0 2rem',
    height: '90px',
    display: 'flex',
    alignItems: 'center',
};

const containerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const brandStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    textDecoration: 'none',
};

const linksContainerStyle = {
    display: 'flex',
    gap: '1.5rem',
};

const authLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
};

const linkStyle = {
    color: 'rgb(0 0 0)',
    textDecoration: 'none',
    fontSize: '1.25rem',
};

const buttonStyle = {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#dc3545',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
};

const buttonLinkStyle = {
    ...linkStyle,
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '5px',
};


export default Navbar;