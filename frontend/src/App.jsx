import './App.css'
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom'
import FoodView from './pages/FoodViewPage/FoodView'
import Register from './pages/RegisterPage/Register'
import Login from './pages/LoginPage/Login'
import Home from './pages/HomePage/Home'
import Profile from './pages/ProfilePage/Profile'
import CreateRecipe from './pages/CreateRecipePage/CreateRecipe'
import EditRecipe from './pages/EditRecipePage/EditRecipe'
import RecipeList from './pages/RecipePage/RecipeList'
import MealPlanner from './pages/MealPlannerPage/MealPlanner'


function App() {
  return (
    <Router>
        <main>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='/login' element={<Login/>} />
                <Route path='/register' element={<Register/>}/>
                <Route path='/profile' element={<Profile/>}/>
                <Route path='/createRecipe' element={<CreateRecipe/>}/>
                <Route path="/recipe/:id" element={<FoodView />} />
                <Route path="/recipe/:id/edit" element={<EditRecipe />} />
                <Route path='/recipe' element={<RecipeList/>} />
                <Route path='/mealplanner' element={<MealPlanner/>}/>
            </Routes>
        </main>
      </Router>
  )
}

export default App
