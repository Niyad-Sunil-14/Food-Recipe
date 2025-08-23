import React, { useState } from 'react'
import './CreateRecipe.module.css'
import Navbar from '../../components/Layout/Navbar'
import axiosInstance from '../../api/axiosConfig'
import { useNavigate } from 'react-router-dom'

function CreateRecipe() {
    const navigate = useNavigate()
    const [title,setTitle] = useState('')
    const [description,setDescription] = useState('')
    const [prepTime,setPrepTime] = useState('')
    const [cookTime,setCookTime] = useState('')
    const [image,setImage] = useState(null)

     // State for dynamic ingredients list
    const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
    
    // State for dynamic instructions list
    const [instructions, setInstructions] = useState([{ description: '' }]);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // --- Ingredient Handlers ---
    const handleIngredientChange = (index, event) => {
        const values = [...ingredients];
        values[index][event.target.name] = event.target.value;
        setIngredients(values);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
    };

    const removeIngredient = (index) => {
        const values = [...ingredients];
        values.splice(index, 1);
        setIngredients(values);
    };

    // --- Instruction Handlers ---
    const handleInstructionChange = (index, event) => {
        const values = [...instructions];
        values[index][event.target.name] = event.target.value;
        setInstructions(values);
    };

    const addInstruction = () => {
        setInstructions([...instructions, { description: '' }]);
    };

    const removeInstruction = (index) => {
        const values = [...instructions];
        values.splice(index, 1);
        setInstructions(values);
    };

    // --- Image Handler ---
    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    // --- Form Submission ---
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        // FormData is required for file uploads
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('prep_time_minutes', prepTime);
        formData.append('cook_time_minutes', cookTime);
        if (image) {
            formData.append('image', image);
        }

        // Convert arrays of objects to JSON strings to send in FormData
        formData.append('ingredients', JSON.stringify(ingredients));
        formData.append('instructions', JSON.stringify(instructions));

        try {
            const response = await axiosInstance.post('/recipe/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            // Redirect to the new recipe's detail page on success
            navigate('/profile');

        } catch (err) {
            setError('Failed to create recipe. Please check your inputs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

  return (
    <div>
    <Navbar/>
    <div className="antialiased text-gray-800">

    {/* <!-- Main Container --> */}
    <div className="container mx-auto max-w-4xl py-12 px-4">

        {/* <!-- Header --> */}
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif-display font-bold">Share Your Creation</h1>
            <p className="text-gray-500 mt-2">Bring your recipe to life for others to enjoy.</p>
        </div>

        {/* <!-- Recipe Form --> */}
        <form onSubmit={handleSubmit} className="space-y-10">
            {/* <!-- Section 1: Basic Details --> */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 border-b pb-4">Basic Details</h2>
                <div className="grid grid-cols-1 gap-6">
                    {/* <!-- Recipe Title --> */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Recipe Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" id="title" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="e.g., Kerala Style Fish Curry"/>
                    </div>
                    {/* <!-- Description --> */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} id="description" rows="4" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="A short and enticing summary of your dish..."></textarea>
                    </div>
                    {/* <!-- Prep and Cook Time --> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="prep_time" className="block text-sm font-medium text-gray-700 mb-1">Prep Time (minutes)</label>
                            <input value={prepTime} onChange={(e) => setPrepTime(e.target.value)} type="number" id="prep_time" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="e.g., 15"/>
                        </div>
                        <div>
                            <label htmlFor="cook_time" className="block text-sm font-medium text-gray-700 mb-1">Cook Time (minutes)</label>
                            <input value={cookTime} onChange={(e) => setCookTime(e.target.value)} type="number" id="cook_time" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="e.g., 30"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Section 2: Ingredients --> */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 border-b pb-4">Ingredients</h2>
                <div id="ingredients-container" className="space-y-4">
                    {/* <!-- Ingredient Row (Example) --> */}
                    {ingredients.map((ingredient,index) => (
                        <div key={index} className="flex items-center gap-4">
                            <input type="number" name='quantity' className="w-1/3 border-gray-300 rounded-md shadow-sm" placeholder="Quantity (e.g., 2)" values={ingredient.quantity} onChange={(e)=> handleIngredientChange(index,e)}/>
                            <input type="text" name='unit' className="w-1/3 border-gray-300 rounded-md shadow-sm" placeholder="Unit (e.g., cups)" values={ingredient.unit} onChange={(e)=> handleIngredientChange(index,e)}/>
                            <input type="text" name='name' className="w-full border-gray-300 rounded-md shadow-sm" placeholder="Name (e.g., All-Purpose Flour)" values={ingredient.name} onChange={(e)=> handleIngredientChange(index,e)}/>
                            <button onClick={()=>removeIngredient(index)} type="button" className="text-red-500 hover:text-red-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    )
                )}
                </div>
                {/* <!-- Add Ingredient Button --> */}
                <button onClick={addIngredient} type="button" className="mt-6 text-teal-600 font-semibold flex items-center gap-2 hover:text-teal-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                    Add Ingredient
                </button>
            </div>

            {/* <!-- Section 3: Instructions --> */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 border-b pb-4">Instructions</h2>
                <div id="instructions-container" className="space-y-4">
                    {/* <!-- Instruction Row (Example) --> */}
                    {instructions.map((instruction,index)=>(
                        <div key={index} className="flex items-start gap-4">
                            <span className="font-bold text-gray-500 mt-2">{index+1}.</span>
                            <textarea rows="3" name="description" className="w-full border-gray-300 rounded-md shadow-sm" placeholder="Describe this step..." values={instruction.description} onChange={(e)=>handleInstructionChange(index,e)}></textarea>
                            <button onClick={()=>removeInstruction(index)} type="button" className="text-red-500 hover:text-red-700 mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
                {/* <!-- Add Instruction Button --> */}
                <button onClick={addInstruction} type="button" className="mt-6 text-teal-600 font-semibold flex items-center gap-2 hover:text-teal-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                    Add Step
                </button>
            </div>

            {/* <!-- Section 4: Image Upload --> */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 border-b pb-4">Recipe Image</h2>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2"  strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                                <span>Upload a file</span>
                                <input onChange={handleImageChange} id="file-upload" name="file-upload" type="file" className="sr-only"/>
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>

            {/* <!-- Submit Button --> */}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <div className="flex justify-end">
                <button type="submit" className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-teal-700 transition-colors duration-300">
                    {loading ? 'Creating...' : 'Create Recipe'}
                </button>
            </div>
        </form>

    </div>
    </div>
    </div>
  )
}

export default CreateRecipe
