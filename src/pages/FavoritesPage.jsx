import { useRecipes } from '../contexts/RecipeContext';
import RecipeCard from '../components/recipe/RecipeCard';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const { favorites } = useRecipes();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">My Favorites</h2>
        <p className="text-gray-500">Your saved recipes</p>
      </div>
      
      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500 mb-4">You haven't saved any recipes yet.</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-full"
          >
            <FaPlus className="mr-2" /> Browse Recipes
          </Link>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {favorites.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark"
            >
              <FaPlus className="text-lg" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;