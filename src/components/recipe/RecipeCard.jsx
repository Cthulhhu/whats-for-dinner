import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaUtensils } from 'react-icons/fa';
import { useRecipes } from '../../contexts/RecipeContext';

const RecipeCard = ({ recipe }) => {
  const { toggleFavorite } = useRecipes();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const getTagColor = (tag) => {
    // Map specific tags to specific colors
    const tagColors = {
      'Sugar-Conscious': 'bg-blue-200 text-blue-800',
      'Keto-Friendly': 'bg-green-200 text-green-800',
      'Low-Sugar': 'bg-indigo-200 text-indigo-800',
      'Egg-Free': 'bg-yellow-200 text-yellow-800',
      'Peanut-Free': 'bg-orange-200 text-orange-800',
      'Mediterranean': 'bg-purple-200 text-purple-800',
      'Vegetarian': 'bg-emerald-200 text-emerald-800',
      'Vegan': 'bg-teal-200 text-teal-800',
      'Gluten-Free': 'bg-lime-200 text-lime-800',
      'Dairy-Free': 'bg-cyan-200 text-cyan-800',
    };
    
    return tagColors[tag] || 'bg-gray-200 text-gray-800';
  };
  
  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Prevent navigating to detail page
    e.stopPropagation(); // Prevent event bubbling
    toggleFavorite(recipe.id);
  };
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  return (
    <Link to={`/recipe/${recipe.id}`} className="block h-full">
      <div className="recipe-card h-full flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md">
        <div className="relative">
          {/* Using Tailwind aspect ratio plugin */}
          <div className="aspect-w-4 aspect-h-3 overflow-hidden">
            <img 
              src={recipe.image} 
              alt={recipe.name}
              className={`w-full h-full object-cover recipe-img ${imageLoaded ? '' : 'loading'}`}
              onLoad={handleImageLoad}
            />
          </div>
          
          {/* Fallback for aspect ratio */}
          {/* 
          <div className="aspect-container">
            <div className="aspect-content">
              <img 
                src={recipe.image} 
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          */}
          
          <button
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 z-10 shadow-sm"
            onClick={handleFavoriteClick}
          >
            {recipe.isFavorite ? (
              <FaHeart className="text-accent-red text-sm" />
            ) : (
              <FaRegHeart className="text-gray-600 text-sm" />
            )}
          </button>
          
          <div className="absolute bottom-2 left-2 bg-white bg-opacity-80 rounded-full px-2 py-0.5 flex items-center text-xs shadow-sm">
            <FaUtensils className="mr-1" size={10} /> {recipe.servings} Servings
          </div>
        </div>
        
        <div className="p-3 flex-grow flex flex-col">
          <h3 className="font-bold text-base mb-1 hover:text-primary transition-colors text-ellipsis-2">
            {recipe.name}
          </h3>
          <p className="text-gray-600 text-xs mb-2">{recipe.cuisine}</p>
          
          <div className="flex flex-wrap gap-1 mt-auto">
            {recipe.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index} 
                className={`inline-block px-2 py-0.5 rounded-full text-xs ${getTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;