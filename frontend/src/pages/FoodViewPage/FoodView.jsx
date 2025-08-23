import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import "./FoodView.css"
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Footer/Footer';
import Login from '../LoginPage/Login';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode


function FoodView() {
    const { id } = useParams(); 
    
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const isAuthenticated = !!localStorage.getItem('access_token');
    const [isOwner, setIsOwner] = useState(false); // State to track ownership

    const checkOwnership = (recipeData) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (Number(recipeData.author.id) === Number(decodedToken.user_id)) {
                setIsOwner(true);
            }
        }
    };

    const fetchRecipe = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/recipe/${id}/`);
            setRecipe(response.data);
            checkOwnership(response.data);
        } catch (err) {
            setError("Failed to fetch recipe. It may not exist.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsLoggedIn(true);
        }
        fetchRecipe();
    }, [id, fetchRecipe]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setReviewError('');

        if (rating < 1 || rating > 5) {
            setReviewError('Please select a rating between 1 and 5.');
            return;
        }

        try {
            await axiosInstance.post('/review/', {
                recipe: id,
                rating: rating,
                comment: comment,
            });
            
            setComment('');
            setRating(5);
            fetchRecipe();

        } catch (err) {
            // This is the new, more robust error handling block
            if (err.response && err.response.data) {
                const errorData = err.response.data;
                
                // Log the actual error from the backend to the console for debugging
                console.error("Backend Validation Error:", errorData); 

                // Convert the error data to a string to easily search for keywords
                const errorString = JSON.stringify(errorData);

                if (errorString.includes("You cannot review your own recipe")) {
                    setReviewError("You cannot review your own recipe.");
                } else {
                    setReviewError("You have already submitted a review for this recipe.");
                }
            } else {
                // Handle network errors
                setReviewError("Could not connect to the server. Please try again later.");
            }
        }
    };

    if (loading) {
        return <div className="message">Loading recipe...</div>;
    }

    if (error) {
        return <div className="message" style={{ color: 'red' }}>{error}</div>;
    }

    if (!recipe) {
        return <div className="message">Recipe not found.</div>;
    }

    const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;

    return (
      <div>
        {isAuthenticated ? (
        <div>
            <Navbar/>
                <div className="recipe-detail-container">
                    {isOwner && (
                        <div className="edit-button-container">
                            <NavLink to={`/recipe/${id}/edit`} className="edit-button">
                                Edit Recipe
                            </NavLink>
                        </div>
                    )}
                    {/* --- Header Section --- */}
                    <div className="recipe-header">
                        <h1 className="recipe-title">{recipe.title}</h1>
                        <p className="recipe-author">By {recipe.author.username}</p>
                        <p className="recipe-description">{recipe.description}</p>
                    </div>

                    {/* --- Image and Details Section --- */}
                    <div className="recipe-main-content">
                        <div className="recipe-image-container">
                            <img src={recipe.image || 'https://placehold.co/600x400/E2E8F0/A0AEC0?text=No+Image'} alt={recipe.title} className="recipe-image" />
                        </div>
                        <div className="timing-details">
                            <div className="time-box">
                                <span className="time-label">Prep Time</span>
                                <span className="time-value">{recipe.prep_time_minutes} mins</span>
                            </div>
                            <div className="time-box">
                                <span className="time-label">Cook Time</span>
                                <span className="time-value">{recipe.cook_time_minutes} mins</span>
                            </div>
                            <div className="time-box">
                                <span className="time-label">Total Time</span>
                                <span className="time-value">{totalTime} mins</span>
                            </div>
                        </div>
                    </div>

                    {/* --- Ingredients and Instructions Section --- */}
                    <div className="recipe-body">
                        {/* Ingredients List */}
                        <div className="section">
                            <h2 className="section-title">Ingredients</h2>
                            <ul className="list">
                                {recipe.ingredients && recipe.ingredients.map(ing => (
                                    <li key={ing.id} className="list-item">
                                        {ing.quantity} {ing.unit} {ing.name}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Instructions List */}
                        <div className="section">
                            <h2 className="section-title">Instructions</h2>
                            <ol className="list">
                                {recipe.instructions && recipe.instructions.map(inst => (
                                    <li key={inst.id} className="instruction-item">
                                        <strong style={{marginRight: '8px'}}>Step {inst.step_number}:</strong>
                                        <p>{inst.description}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                    <div className="reviews-section">
                        <h2 className="section-title">Reviews</h2>

                        {/* Display Existing Reviews */}
                        <div className="review-list">
                            {recipe.review && recipe.review.length > 0 ? (
                                recipe.review.map(reviews => (
                                    <div key={reviews.id} className="review-item">
                                        <div className="review-header">
                                            <span className="review-author">{reviews.user}</span>
                                            <span className="review-rating">{'★'.repeat(reviews.rating)}{'☆'.repeat(5 - reviews.rating)}</span>
                                        </div>
                                        <p className="review-comment">{reviews.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet. Be the first to share your thoughts!</p>
                            )}
                        </div>

                        {/* Review Submission Form */}
                        {isLoggedIn && (
                            <div className="review-form-container">
                                <h3 className="review-form-title">Leave a Review</h3>
                                <form onSubmit={handleSubmitReview}>
                                    <div className="rating-input">
                                        <label>Your Rating:</label>
                                        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                                            <option value="5">5 - Excellent</option>
                                            <option value="4">4 - Good</option>
                                            <option value="3">3 - Average</option>
                                            <option value="2">2 - Not a fan</option>
                                            <option value="1">1 - Poor</option>
                                        </select>
                                    </div>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Share your thoughts on this recipe..."
                                        required
                                        className="review-textarea"
                                    />
                                    {reviewError && <p className="error-message">{reviewError}</p>}
                                    <button type="submit" className="submit-button">Submit Review</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            <Footer/>
        </div>
        ) : (<Login/>)}
      </div>
    );
}

export default FoodView;
