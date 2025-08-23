import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './MealPlanner.css'
import axiosInstance from '../../api/axiosConfig';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Footer/Footer';

function MealPlanner() {
    const [mealPlan, setMealPlan] = useState({});
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for the "Add to Plan" form
    const [selectedRecipe, setSelectedRecipe] = useState('');
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [selectedMealType, setSelectedMealType] = useState('Lunch');
    const [formError, setFormError] = useState('');

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

    const fetchMealPlan = useCallback(async () => {
        try {
            // Fetch the user's current meal plan
            const planResponse = await axiosInstance.get('/mealplan/');
            const formattedPlan = formatMealPlan(planResponse.data);
            setMealPlan(formattedPlan);

            // Fetch all available recipes for the dropdown
            const recipesResponse = await axiosInstance.get('/recipe/');
            setRecipes(recipesResponse.data);
            if (recipesResponse.data.length > 0) {
                setSelectedRecipe(recipesResponse.data[0].id);
            }
        } catch (err) {
            setError('Could not load your meal plan.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMealPlan();
    }, [fetchMealPlan]);

    // Helper function to structure the meal plan data for easy display
    const formatMealPlan = (planData) => {
        const plan = {};
        planData.forEach(item => {
            if (!plan[item.day_of_week]) {
                plan[item.day_of_week] = {};
            }
            // It now correctly copies the 'recipe_title' from the API response
            plan[item.day_of_week][item.meal_type] = {
                id: item.id,
                recipe_title: item.recipe_title, 
            };
        });
        return plan;
    };

    const handleAddMeal = async (e) => {
        e.preventDefault();
        setFormError('');

        // --- THIS IS THE FIX ---
        // Check if the selected slot in the current mealPlan state is already filled.
        if (mealPlan[selectedDay] && mealPlan[selectedDay][selectedMealType]) {
            setFormError(`The ${selectedMealType} slot for ${selectedDay} is already taken.`);
            return; // Stop the function before making an API call
        }
        // --- END OF FIX ---

        try {
            await axiosInstance.post('/mealplan/', {
                recipe: selectedRecipe,
                day_of_week: selectedDay,
                meal_type: selectedMealType,
            });
            // Refresh the meal plan to show the new entry
            fetchMealPlan();
        } catch (err) {
            setFormError('An error occurred. This slot might be taken.');
            console.error(err.response?.data || err);
        }
    };

    const handleRemoveMeal = async (mealId) => {
        try {
            await axiosInstance.delete(`/mealplan/${mealId}/`);
            // Refresh the meal plan to remove the entry
            fetchMealPlan();
        } catch (err) {
            setError('Failed to remove meal.');
            console.error(err);
        }
    };


    if (loading) {
        return <div className="message">Loading your meal plan...</div>;
    }

    if (error) {
        return <div className="message" style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div>
            <Navbar/>
            <div className="meal-planner-container">
                <h1>Your Weekly Meal Plan</h1>

                {/* Add to Plan Form */}
                <div className="add-meal-form">
                    <h2>Add a Recipe to Your Plan</h2>
                    <form onSubmit={handleAddMeal}>
                        <select value={selectedRecipe} onChange={(e) => setSelectedRecipe(e.target.value)}>
                            {recipes.map(recipe => (
                                <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
                            ))}
                        </select>
                        <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                            {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                        </select>
                        <select value={selectedMealType} onChange={(e) => setSelectedMealType(e.target.value)}>
                            {mealTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <button type="submit">Add to Plan</button>
                    </form>
                    {formError && <p className="error-message">{formError}</p>}
                </div>

                {/* Weekly Grid */}
                <div className="weekly-grid">
                    {daysOfWeek.map(day => (
                        <div key={day} className="day-column">
                            <h2>{day}</h2>
                            {mealTypes.map(mealType => (
                                <div key={mealType} className="meal-slot">
                                    <h3>{mealType}</h3>
                                    {mealPlan[day] && mealPlan[day][mealType] ? (
                                        <div className="meal-card">
                                            <span>{mealPlan[day][mealType].recipe_title}</span>
                                            <button onClick={() => handleRemoveMeal(mealPlan[day][mealType].id)} className="remove-btn">&times;</button>
                                        </div>
                                    ) : (
                                        <div className="empty-slot">Empty</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default MealPlanner;