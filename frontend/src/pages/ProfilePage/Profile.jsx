import React, { use, useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosConfig';
import './Profile.css'
import Navbar from '../../components/Layout/Navbar';
import { NavLink } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

function Profile() {
    const [profile,setProfile] = useState(null)
    const [recipe,setRecipe] = useState([])

    const [error,setError] = useState('')
    useEffect(()=>{
        const fetchProfileData = async () => {
            try {
                // Fetch user profile details
                const profileResponse = await axiosInstance.get('profile/');
                setProfile(profileResponse.data);

                const userId = profileResponse.data.id;
                const recipesResponse = await axiosInstance.get(`recipe/?author=${userId}&ordering=latest`);
                setRecipe(recipesResponse.data);
            } catch (err) {
                setError('Failed to load profile data.');
                console.error(err);
            }
        }
        fetchProfileData()
    },[])

    const dateString = profile?.date_joined; // Example date from your backend
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options); 
  return (
    <div>
    <Navbar/>
    {/* <!-- Main Container --> */}
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">

        {/* <!-- Profile Header Section --> */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center">
                {/* <!-- Profile Picture --> */}
                <img 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-teal-500"
                    src={profile?.username ?`https://placehold.co/150x150/a7f3d0/134e4a?text=${profile.username.charAt(0).toUpperCase()} `: "null"}
                    alt="User Profile Picture" 
                />
                {/* <!-- User Info --> */}
                <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-800">{profile?.username}</h1>
                    <p className="text-gray-600 mt-1">{profile?.email}</p>
                    <p className="text-sm text-gray-500 mt-2">{formattedDate}</p>
                </div>
                <div style={{margin:"auto",paddingRight:"19rem"}}>
                    <NavLink to={'/createRecipe'} className="btn-gradient">Create Recipe</NavLink>
                </div>
            </div>
        </div>

        {/* <!-- User's Recipes Section --> */}
        <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Recipes</h2>
            
            {/* <!-- Grid for Recipe Cards --> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* <!-- Recipe Card 1 --> */}
                {(recipe.map(recipes=>(
                    <NavLink to={`/recipe/${recipes.id}`} key={recipes.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
                        <img className="w-full h-48 object-cover" src={recipes.image} alt="A delicious salad"/>
                        <div className="p-5">
                            <h3 className="text-lg font-semibold text-gray-800">{recipes.title}</h3>
                            <p className="text-gray-600 mt-2 text-sm">{recipes.description}</p>
                        </div>
                    </NavLink>
                    )
                ))}
                
            </div>
        </div>

    </div>
    <Footer/>
    </div>
  )
}

export default Profile
