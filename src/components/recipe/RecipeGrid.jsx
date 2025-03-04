import RecipeCard from './RecipeCard';

const RecipeGrid = ({ recipes, showHeader = false, title = "", subtitle = "" }) => {
  return (
    <div>
      {showHeader && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-500">{subtitle}</p>
        </div>
      )}
      
      {recipes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg sm:text-xl text-gray-500">No recipes found. Try a different search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeGrid;