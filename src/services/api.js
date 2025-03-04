import axios from 'axios';

// Access environment variables
const API_ID = import.meta.env.VITE_EDAMAM_APP_ID;
const API_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;
const BASE_URL = 'https://api.edamam.com/api/recipes/v2';

// Array of popular search terms for random recommendations
const POPULAR_SEARCH_TERMS = [
  'chicken', 'pasta', 'vegetarian', 'soup', 'salmon', 
  'beef', 'dinner', 'quick', 'breakfast', 'salad',
  'easy', 'dessert', 'healthy', 'rice', 'steak',
  'mexican', 'italian', 'asian', 'mediterranean', 'indian',
  'fish', 'pork', 'bread', 'vegan', 'grilled'
];

// Create axios instance for Edamam API
const edamamApi = axios.create({
  baseURL: BASE_URL,
  params: {
    app_id: API_ID,
    app_key: API_KEY,
    type: 'public', // Required parameter for v2 API
  },
});

// Get a random search term
const getRandomSearchTerm = () => {
  const randomIndex = Math.floor(Math.random() * POPULAR_SEARCH_TERMS.length);
  return POPULAR_SEARCH_TERMS[randomIndex];
};

// Search recipes with query and optional filters
export const searchRecipes = async (query = '', filters = {}, nextUrl = null) => {
  try {
    let response;
    
    // If we have a nextUrl (from pagination), use that
    if (nextUrl) {
      // Extract only the path and query parameters from the full URL
      const url = new URL(nextUrl);
      const path = url.pathname.replace('/api/recipes/v2', '') || '';
      const queryParams = {};
      
      // Convert URLSearchParams to plain object
      for (const [key, value] of url.searchParams.entries()) {
        queryParams[key] = value;
      }
      
      response = await edamamApi.get(path, { params: queryParams });
    } 
    // For initial/empty search, use a random popular term
    else if (!query) {
      const randomTerm = getRandomSearchTerm();
      console.log(`Using random search term: ${randomTerm}`);
      
      response = await edamamApi.get('', { 
        params: {
          q: randomTerm,
          random: true, // Add randomization if API supports it
          ...filters,
        }
      });
    } 
    // For normal search with query
    else {
      response = await edamamApi.get('', { 
        params: {
          q: query,
          ...filters,
        }
      });
    }
    
    // Check for a valid response structure
    if (!response.data || !response.data.hits || !Array.isArray(response.data.hits)) {
      console.error('Unexpected API response structure:', response.data);
      return { recipes: [], nextPage: null };
    }
    
    // Extract the "next" page URL if it exists
    const nextPage = response.data._links?.next?.href || null;
    
    // Transform the recipes
    const recipes = transformRecipes(response.data);
    
    return { recipes, nextPage };
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

// Get recipe by ID
export const getRecipeById = async (id) => {
  try {
    // Edamam API v2 requires a different endpoint format for getting by ID
    const response = await edamamApi.get(`/${id}`);
    
    if (!response.data || !response.data.recipe) {
      console.error('Unexpected API response structure for recipe detail:', response.data);
      throw new Error('Recipe not found');
    }
    
    return transformRecipe(response.data.recipe);
  } catch (error) {
    console.error('Error getting recipe by ID:', error);
    
    // If we get a 404, try finding it in local storage as a fallback
    if (error.response && error.response.status === 404) {
      const fallbackRecipe = findRecipeInLocalStorage(id);
      if (fallbackRecipe) {
        return fallbackRecipe;
      }
    }
    
    throw error;
  }
};

// Fallback function to find a recipe in local storage
const findRecipeInLocalStorage = (id) => {
  try {
    // Check favorites in localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      const foundRecipe = favorites.find(recipe => recipe.id === id);
      if (foundRecipe) return foundRecipe;
    }
    
    // Check recently viewed recipes if you have that feature
    const recentlyViewed = localStorage.getItem('recentlyViewed');
    if (recentlyViewed) {
      const recipes = JSON.parse(recentlyViewed);
      const foundRecipe = recipes.find(recipe => recipe.id === id);
      if (foundRecipe) return foundRecipe;
    }
  } catch (error) {
    console.error('Error finding recipe in localStorage:', error);
  }
  
  return null;
};

// Transform API response to match our app's format
const transformRecipes = (data) => {
  // Safety check for data.hits
  if (!data || !data.hits || !Array.isArray(data.hits)) {
    console.error('Invalid data structure for transformRecipes:', data);
    return [];
  }

  return data.hits.map((hit) => {
    // Safety check for hit.recipe
    if (!hit || !hit.recipe) {
      console.warn('Invalid hit structure:', hit);
      return null;
    }
    
    return transformRecipe(hit.recipe, hit._links?.self?.href);
  }).filter(recipe => recipe !== null); // Remove any null values
};

const transformRecipe = (recipe, selfLink = '') => {
  if (!recipe) {
    return null;
  }
  
  // Extract ID from self link if available
  let id = '';
  if (selfLink) {
    const idMatch = selfLink.match(/\/([^\/]+)$/);
    if (idMatch) id = idMatch[1];
  } else if (recipe.uri) {
    // Extract ID from uri as fallback
    const uriMatch = recipe.uri.match(/#recipe_([a-zA-Z0-9]+)/);
    if (uriMatch) id = uriMatch[1];
  }

  // Transform dietary labels into our tag format
  const tags = [
    ...(recipe.dietLabels || []),
    ...(recipe.healthLabels || [])
  ].filter(label => {
    // Filter for common dietary tags that match our UI
    return [
      'Sugar-Conscious', 
      'Keto-Friendly', 
      'Low-Sugar',
      'Vegan',
      'Vegetarian',
      'Pescatarian',
      'Dairy-Free',
      'Gluten-Free',
      'Wheat-Free',
      'Egg-Free',
      'Peanut-Free',
      'Tree-Nut-Free',
      'Soy-Free',
      'Mediterranean',
      'DASH',
      'Paleo'
    ].includes(label);
  });

  // Map cuisine type to a more consistent format
  let cuisine = 'Global Kitchen';
  if (recipe.cuisineType && recipe.cuisineType.length > 0) {
    const cuisineType = recipe.cuisineType[0].charAt(0).toUpperCase() + recipe.cuisineType[0].slice(1);
    cuisine = `${cuisineType} Kitchen`;
  }

  return {
    id: id || `recipe_${Math.random().toString(36).substr(2, 9)}`, // Fallback ID if none found
    name: recipe.label || 'Unnamed Recipe',
    image: recipe.image || '/api/placeholder/300/200', // Fallback image
    cuisine,
    servings: Math.ceil(recipe.yield) || 4,
    tags: tags.length > 0 ? tags : ['General'],
    ingredients: recipe.ingredientLines || [],
    nutrients: recipe.totalNutrients || {},
    url: recipe.url,
    totalTime: recipe.totalTime || 0,
    calories: Math.round(recipe.calories) || 0,
    isFavorite: false, // Will be updated by our favorites context
    source: recipe.source || '',
  };
};

export default {
  searchRecipes,
  getRecipeById
};