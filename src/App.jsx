import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecipeProvider } from './contexts/RecipeContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <RecipeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="recipe/:id" element={<RecipeDetailPage />} />
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
                    <p className="text-gray-600 mb-4">We couldn't find the page you're looking for.</p>
                    <a href="/" className="px-4 py-2 bg-primary text-white rounded-md">
                      Go Back Home
                    </a>
                  </div>
                </div>
              } />
            </Route>
          </Routes>
        </Router>
      </RecipeProvider>
    </ErrorBoundary>
  );
}

export default App;