import React, { useEffect, useState } from 'react'
import './Cards.css'
import axiosInstance from '../../api/axiosConfig';
import { NavLink } from 'react-router-dom';


function Cards() {
  const [recipe,setRecipe] = useState([])
  const [error,setError] = useState('')
  const [loading,setLoading] = useState(true)

  useEffect(() => {
        const fetchTopRecipes = async () => {
            try {
                // Fetch the recipes from the main endpoint. They are already sorted by the backend.
                const response = await axiosInstance.get('/recipe/');
                setRecipe(response.data);
            } catch (err) {
                setError('Could not load recipes. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTopRecipes();
    }, []);

     if (loading) {
        return <div className="message">Loading top recipes...</div>;
    }

    if (error) {
      return <div className="message" style={{ color: 'red' }}>{error}</div>;
    }
  return (
    <div>
      <section className="cards">
        <h2 className="titulo">Top Recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* <!-- Card 1 --> */}
        {recipe.map(recipes => (
            <div className="card" key={recipes.id}>
              <img src={recipes.image} alt="Waffles"/>
              <div className="card-content">
                <h3>{recipes.title}</h3>
                <p>{recipes.description}</p>
                <NavLink to={`/recipe/${recipes.id}`} key={recipes.id} >
                  <button className="ver-mais-btn">See recipe</button>
                </NavLink>
              </div>
            </div>
        ))}
          </div>
      </section>
    </div>
  )
}

export default Cards
