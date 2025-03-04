import { createContext, useState, useContext, useEffect } from 'react';
import { searchRecipes } from '../services/api';

const RecipeContext = createContext();

export const useRecipes = () => useContext(RecipeContext);

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  
  // Load favorites from localStorage on initial render
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites);
          setFavorites(parsedFavorites);
          console.log('Loaded favorites from localStorage:', parsedFavorites.length);
        }
      } catch (err) {
        console.error('Error loading favorites from localStorage:', err);
      }
    };
    
    loadFavorites();
    
    // Initial recipes load with random query
    fetchRecipes('');
  }, []);
  
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
      console.log('Saved favorites to localStorage:', favorites.length);
    } catch (err) {
      console.error('Error saving favorites to localStorage:', err);
    }
  }, [favorites]);
  
  // Search for recipes
  const fetchRecipes = async (query, filters = {}, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setNextPageUrl(null); // Reset pagination when starting a new search
    }
    setError(null);
    
    try {
      // If loading more, use the nextPageUrl, otherwise use the query
      const url = isLoadMore ? nextPageUrl : null;
      const { recipes: newRecipes, nextPage } = await searchRecipes(query, filters, url);
      
      // Mark favorites in the results by checking ID against favorites array
      const updatedRecipes = newRecipes.map(recipe => ({
        ...recipe,
        isFavorite: favorites.some(fav => fav.id === recipe.id)
      }));
      
      if (isLoadMore) {
        // Append new recipes to existing ones
        setRecipes(prevRecipes => [...prevRecipes, ...updatedRecipes]);
      } else {
        // Replace existing recipes
        setRecipes(updatedRecipes);
      }
      
      // Store the next page URL for pagination
      setNextPageUrl(nextPage);
    } catch (err) {
      setError(err.message || 'Failed to fetch recipes');
      if (!isLoadMore) {
        setRecipes([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  
  // Load more recipes (pagination)
  const loadMoreRecipes = () => {
    if (nextPageUrl && !loadingMore) {
      fetchRecipes(searchQuery, {}, true);
    }
  };
  
  // Refresh recipes with a new random selection
  const refreshRandomRecipes = () => {
    setSearchQuery('');
    fetchRecipes('');
  };
  
  // Handle search submission
  const handleSearch = () => {
    fetchRecipes(searchQuery);
  };
  
  // Toggle favorite status
  const toggleFavorite = (id) => {
    // Find the recipe in either recipes or favorites arrays
    const recipe = recipes.find(r => r.id === id) || favorites.find(f => f.id === id);
    
    if (!recipe) {
      console.error('Recipe not found:', id);
      return;
    }
    
    // Check if already in favorites
    const isFavorite = favorites.some(fav => fav.id === id);
    
    if (isFavorite) {
      // Remove from favorites
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== id));
    } else {
      // Add to favorites
      const recipeToAdd = {...recipe, isFavorite: true};
      setFavorites(prevFavorites => [...prevFavorites, recipeToAdd]);
    }
    
    // Update recipe in the recipes array
    setRecipes(prevRecipes => 
      prevRecipes.map(r => 
        r.id === id 
          ? {...r, isFavorite: !r.isFavorite} 
          : r
      )
    );
  };
  
  const value = {
    recipes,
    loading,
    loadingMore,
    error,
    searchQuery,
    setSearchQuery,
    handleSearch,
    toggleFavorite,
    favorites,
    hasMoreRecipes: !!nextPageUrl,
    loadMoreRecipes,
    refreshRandomRecipes
  };
  
  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
};