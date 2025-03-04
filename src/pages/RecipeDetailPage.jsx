import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaRegHeart, FaUtensils, FaClock, FaFire } from 'react-icons/fa';
import { getRecipeById } from '../services/api';
import { useRecipes } from '../contexts/RecipeContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { toggleFavorite, favorites } = useRecipes();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if this recipe is in favorites
  const isFavorite = favorites.some(fav => fav.id === id);
  
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const recipeData = await getRecipeById(id);
        setRecipe({...recipeData, isFavorite});
      } catch (err) {
        console.error('Error fetching recipe details:', err);
        setError('Failed to load recipe details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipeDetails();
  }, [id, isFavorite]);
  
  const handleFavoriteClick = () => {
    if (recipe) {
      toggleFavorite(recipe.id);
      setRecipe({...recipe, isFavorite: !recipe.isFavorite});
    }
  };
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!recipe) return <ErrorMessage message="Recipe not found" />;
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-primary hover:text-primary-dark mb-4 sm:mb-6">
        <FaArrowLeft className="mr-2" /> Back to recipes
      </Link>
      
      {/* Recipe header */}
      <div className="relative">
        <img 
          src={recipe.image} 
          alt={recipe.name} 
          className="w-full h-56 sm:h-64 md:h-80 object-cover rounded-xl"
        />
        <button
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-3 rounded-full bg-white bg-opacity-80 shadow-md"
          onClick={handleFavoriteClick}
        >
          {recipe.isFavorite ? (
            <FaHeart className="text-accent-red text-lg sm:text-xl" />
          ) : (
            <FaRegHeart className="text-gray-600 text-lg sm:text-xl" />
          )}
        </button>
      </div>
      
      {/* Recipe title and source */}
      <div className="mt-4 sm:mt-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{recipe.name}</h1>
        {recipe.source && (
          <p className="text-gray-600">
            By <span className="font-medium">{recipe.source}</span>
          </p>
        )}
      </div>
      
      {/* Recipe info */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-3 sm:mt-4 text-gray-700">
        {recipe.totalTime > 0 && (
          <div className="flex items-center">
            <FaClock className="mr-1 sm:mr-2 text-primary" />
            <span>{recipe.totalTime} mins</span>
          </div>
        )}
        
        <div className="flex items-center">
          <FaUtensils className="mr-1 sm:mr-2 text-primary" />
          <span>{recipe.servings} Servings</span>
        </div>
        
        {recipe.calories > 0 && (
          <div className="flex items-center">
            <FaFire className="mr-1 sm:mr-2 text-primary" />
            <span>{recipe.calories} calories</span>
          </div>
        )}
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
        {recipe.tags && recipe.tags.map((tag, index) => (
          <span 
            key={index} 
            className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-100 text-gray-800 rounded-full text-xs sm:text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
      
      {/* Ingredients */}
      <div className="mt-6 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">Ingredients</h2>
        <ul className="space-y-1 sm:space-y-2">
          {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-2 sm:mr-3"></span>
              <span className="text-sm sm:text-base">{ingredient}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Instructions */}
      <div className="mt-6 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">Instructions</h2>
        {recipe.url ? (
          <div>
            <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
              This recipe is available on the original source website. Click the button below to view the complete cooking instructions.
            </p>
            <a 
              href={recipe.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition"
            >
              View Full Recipe
            </a>
          </div>
        ) : (
          <p className="text-sm sm:text-base text-gray-700">
            No instructions available for this recipe.
          </p>
        )}
      </div>
      
      {/* Nutrition info if available */}
      {recipe.nutrients && Object.keys(recipe.nutrients).length > 0 && (
        <div className="mt-6 sm:mt-8 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">Nutrition</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {Object.entries(recipe.nutrients)
              .filter(([key, value]) => {
                return ['ENERC_KCAL', 'PROCNT', 'FAT', 'CHOCDF', 'FIBTG', 'SUGAR', 'CHOLE', 'NA'].includes(key);
              })
              .map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-500">{value.label}</p>
                  <p className="text-base sm:text-lg font-medium">
                    {Math.round(value.quantity)} {value.unit}
                  </p>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailPage;