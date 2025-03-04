import { useRecipes } from '../contexts/RecipeContext';
import SearchBar from '../components/recipe/SearchBar';
import RecipeGrid from '../components/recipe/RecipeGrid';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { FaSync, FaArrowDown } from 'react-icons/fa';

const HomePage = () => {
  const { 
    recipes, 
    loading, 
    loadingMore,
    error, 
    searchQuery,
    hasMoreRecipes,
    loadMoreRecipes,
    refreshRandomRecipes
  } = useRecipes();
  
  const getTitle = () => {
    if (!searchQuery) return "Recommended Recipes";
    return `Results for "${searchQuery}"`;
  };
  
  const getSubtitle = () => {
    if (!searchQuery) return "Popular choices";
    return `${recipes.length} recipes found`;
  };
  
  const handleRefresh = () => {
    refreshRandomRecipes();
  };
  
  const handleLoadMore = () => {
    loadMoreRecipes();
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <SearchBar />
      
      {error && <ErrorMessage message={error} />}
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-4 sm:mt-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{getTitle()}</h2>
              <p className="text-gray-500">{getSubtitle()}</p>
            </div>
            
            {!searchQuery && (
              <button 
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                aria-label="Refresh recommendations"
              >
                <FaSync className="mr-2" /> Refresh
              </button>
            )}
          </div>
          
          <RecipeGrid recipes={recipes} title="" subtitle="" />
          
          {/* Show More Button */}
          {hasMoreRecipes && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className={`flex items-center justify-center mx-auto px-6 py-3 rounded-full shadow-md transition-colors ${
                  loadingMore 
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                {loadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin mr-2"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <FaArrowDown className="mr-2" /> Show More Recipes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;