import { FaSearch } from 'react-icons/fa';
import { useRecipes } from '../../contexts/RecipeContext';

const SearchBar = () => {
  const { searchQuery, setSearchQuery, handleSearch } = useRecipes();
  
  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
      <form onSubmit={onSubmit} className="relative">
        <input
          type="text"
          placeholder="What do you want to cook today?"
          className="w-full rounded-full border border-gray-300 py-2 sm:py-3 pl-4 pr-10 sm:pl-5 sm:pr-12 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          type="submit" 
          className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
        >
          <FaSearch className="text-lg sm:text-xl" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;