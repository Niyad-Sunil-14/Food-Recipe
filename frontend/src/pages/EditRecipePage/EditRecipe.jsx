import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import './EditRecipe.css'; // Import the new CSS file
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Footer/Footer';

function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();

    // State for the main recipe details
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // State for dynamic lists
    const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
    const [instructions, setInstructions] = useState([{ description: '' }]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch existing recipe data when the component loads
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axiosInstance.get(`/recipe/${id}/`);
                const recipe = response.data;
                
                setTitle(recipe.title);
                setDescription(recipe.description);
                setPrepTime(recipe.prep_time_minutes);
                setCookTime(recipe.cook_time_minutes);
                setIngredients(recipe.ingredients);
                setInstructions(recipe.instructions);
                setImagePreview(recipe.image); // For displaying the current image

            } catch (err) {
                setError('Failed to load recipe data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);


    // --- Handlers for Ingredients and Instructions (same as create page) ---
    const handleIngredientChange = (index, event) => {
        const values = [...ingredients];
        values[index][event.target.name] = event.target.value;
        setIngredients(values);
    };
    const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
    const removeIngredient = (index) => {
        const values = [...ingredients];
        values.splice(index, 1);
        setIngredients(values);
    };

    const handleInstructionChange = (index, event) => {
        const values = [...instructions];
        values[index][event.target.name] = event.target.value;
        setInstructions(values);
    };
    const addInstruction = () => setInstructions([...instructions, { description: '' }]);
    const removeInstruction = (index) => {
        const values = [...instructions];
        values.splice(index, 1);
        setInstructions(values);
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
        setImagePreview(URL.createObjectURL(event.target.files[0]));
    };

    // --- Form Submission ---
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('prep_time_minutes', prepTime);
        formData.append('cook_time_minutes', cookTime);
        if (image) {
            formData.append('image', image);
        }
        formData.append('ingredients', JSON.stringify(ingredients));
        formData.append('instructions', JSON.stringify(instructions));

        try {
            // Use PUT request to update the existing recipe
            await axiosInstance.put(`/recipe/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            // Redirect to the recipe's detail page on success
            navigate(`/recipe/${id}`);

        } catch (err) {
            setError('Failed to update recipe. Please check your inputs.');
            console.error(err.response.data);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{color: 'red'}}>{error}</div>;

    return (
        <div>
        <Navbar/>
        <div className="edit-recipe-container">
            <h1>Edit Your Recipe</h1>
            <form onSubmit={handleSubmit}>
                {/* Basic Details */}
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-input" />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="form-input form-textarea" />
                <div className="input-group">
                    <input type="number" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} required className="form-input" />
                    <input type="number" value={cookTime} onChange={(e) => setCookTime(e.target.value)} required className="form-input" />
                </div>
                
                {/* Image Preview and Upload */}
                {imagePreview && <img src={imagePreview} alt="Recipe preview" className="image-preview" />}
                <input type="file" accept="image/*" onChange={handleImageChange} className="form-input" />

                {/* Ingredients & Instructions */}
                <h2 className="section-title">Ingredients</h2>
                {ingredients.map((ing, index) => (
                    <div key={index} className="dynamic-row">
                        <input type="number" name="quantity" placeholder="Qty" value={ing.quantity} onChange={e => handleIngredientChange(index, e)} className="form-input ingredient-qty-input" />
                        <input type="text" name="unit" placeholder="Unit" value={ing.unit} onChange={e => handleIngredientChange(index, e)} className="form-input ingredient-unit-input" />
                        <input type="text" name="name" placeholder="Name" value={ing.name} onChange={e => handleIngredientChange(index, e)} required className="form-input ingredient-name-input" />
                        <button type="button" onClick={() => removeIngredient(index)} className="remove-button">&times;</button>
                    </div>
                ))}
                <button type="button" onClick={addIngredient} className="add-button">+ Add Ingredient</button>

                <h2 className="section-title">Instructions</h2>
                {instructions.map((inst, index) => (
                    <div key={index} className="dynamic-row">
                        <span style={{ fontWeight: 'bold' }}>{index + 1}.</span>
                        <textarea name="description" placeholder="Step" value={inst.description} onChange={e => handleInstructionChange(index, e)} required className="form-input instruction-textarea" />
                        <button type="button" onClick={() => removeInstruction(index)} className="remove-button">&times;</button>
                    </div>
                ))}
                <button type="button" onClick={addInstruction} className="add-button">+ Add Step</button>

                {/* Submission */}
                <button type="submit" disabled={loading} className="submit-button">
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
        <Footer/>
        </div>
    );
}

export default EditRecipe;