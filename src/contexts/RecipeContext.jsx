import { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
  const [initialized, setInitialized] = useState(false);
  
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
        // Fallback to empty array if localStorage is corrupted
        setFavorites([]);
        // Try to clear the corrupted data
        try {
          localStorage.removeItem('favorites');
        } catch (clearErr) {
          console.error('Failed to clear corrupted favorites:', clearErr);
        }
      }
    };
    
    loadFavorites();
    
    // Initial recipes load with random query
    fetchRecipes('').catch(err => {
      console.error('Failed to load initial recipes:', err);
      setError('Failed to load recipes. Please try again later.');
      setRecipes([]);
    }).finally(() => {
      setInitialized(true);
    });
  }, []);
  
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!initialized) return; // Don't save until fully initialized
    
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
      console.log('Saved favorites to localStorage:', favorites.length);
    } catch (err) {
      console.error('Error saving favorites to localStorage:', err);
      // Show error but don't disrupt user experience
      const timeout = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [favorites, initialized]);
  
  // Search for recipes with error handling
  const fetchRecipes = useCallback(async (query, filters = {}, isLoadMore = false) => {
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
      console.error('Error fetching recipes:', err);
      
      // User-friendly error message
      if (err.message?.includes('429')) {
        setError('Too many requests. Please try again later.');
      } else if (err.message?.includes('401')) {
        setError('Authentication error. Please check your API keys.');
      } else if (err.response?.status === 404 || err.message?.includes('404')) {
        setError('No recipes found. Try different search terms.');
      } else {
        setError('Failed to fetch recipes. Please try again later.');
      }
      
      if (!isLoadMore) {
        setRecipes([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [favorites, nextPageUrl]);
  
  // Load more recipes (pagination)
  const loadMoreRecipes = useCallback(() => {
    if (nextPageUrl && !loadingMore) {
      fetchRecipes(searchQuery, {}, true);
    }
  }, [fetchRecipes, nextPageUrl, loadingMore, searchQuery]);
  
  // Refresh recipes with a new random selection
  const refreshRandomRecipes = useCallback(() => {
    setSearchQuery('');
    fetchRecipes('');
  }, [fetchRecipes]);
  
  // Handle search submission
  const handleSearch = useCallback(() => {
    fetchRecipes(searchQuery);
  }, [fetchRecipes, searchQuery]);
  
  // Toggle favorite status with error handling
  const toggleFavorite = useCallback((id) => {
    try {
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
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update favorites. Please try again.');
      const timeout = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [recipes, favorites]);
  
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