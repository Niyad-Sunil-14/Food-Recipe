import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import './RecipeList.css'
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Footer/Footer';

function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State for the search term
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                // The search term is added as a query parameter to the URL
                const response = await axiosInstance.get(`/recipe/`, {
                    params: { search: searchTerm }
                });
                setRecipes(response.data);
            } catch (err) {
                setError('Could not load recipes.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        // This timeout prevents the API from being called on every single keystroke
        const delayDebounceFn = setTimeout(() => {
            fetchRecipes();
        }, 700); // Wait 500ms after the user stops typing

        // Cleanup function to cancel the timeout if the user types again
        return () => clearTimeout(delayDebounceFn);

    }, [searchTerm]); // Re-run the effect whenever the searchTerm changes

  return (
    <div>
        <Navbar/>
        <div className="all-recipes-container">
            <div className="search-header">
                <h1>Explore All Recipes</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search for a recipe..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {loading && <div className="message">Searching...</div>}
            {error && <div className="message" style={{ color: 'red' }}>{error}</div>}
            
            {!loading && (
                <div className="recipe-grid">
                    {recipes.length > 0 ? (
                        recipes.map(recipe => (
                            <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="recipe-card-link">
                                <div className="recipe-card">
                                    <img 
                                        src={recipe.image || 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=No+Image'} 
                                        alt={recipe.title} 
                                        className="recipe-card-image" 
                                    />
                                    <div className="recipe-card-content">
                                        <h3 className="recipe-card-title">{recipe.title}</h3>
                                        <p className="recipe-card-author">By {recipe.author.username}</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="message">No recipes found for "{searchTerm}".</p>
                    )}
                </div>
            )}
        </div>
        <Footer/>
    </div>
  )
}

export default RecipeList
