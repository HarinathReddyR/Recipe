import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import FilterPanel from './components/Filter';
import RecipeList from './components/RecipeList'; 
import RecipeDetails from './components/RecipeDetails'; 
import axios from 'axios';
import { Recipe } from './interface/Recipe'; 
import './App.css';

const App: React.FC = () => {
  const initialFilters = {
    categories: [] as string[],
    ingredients: [] as string[],
    proteins: [0, 100],
    fat: [0, 100],
    sodium: [0, 2000],
    calories: [0, 2000],
    rating: {} as { [key: number]: boolean },
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<typeof initialFilters>(initialFilters);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [topRatedRecipes, setTopRatedRecipes] = useState<Recipe[]>([]);
  const [showTopRated, setShowTopRated] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const fetchRecipes = async (query: string, activeFilters: any) => {
    console.log('Fetching recipes with query and filters', query, activeFilters);
    setSearchQuery(query);
    setShowTopRated(false);
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/recipes/search', {
        params: { search: query, filters: activeFilters },
      });
      console.log('Received response', response.data);
      setRecipes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching recipes', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopRatedRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/recipes/top-rated');
      console.log('Top rated recipes', response.data);
      setTopRatedRecipes(Array.isArray(response.data) ? response.data : []);
      setShowTopRated(true);
    } catch (error) {
      console.error('Error fetching top rated recipes', error);
      setTopRatedRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopRatedRecipes();
  }, []);

  useEffect(() => {
    const hasActiveFilters = Object.values(filters).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'object') {
        return Object.keys(value).some(key => value[+key]);
      }
      return false;
    });

    if (searchQuery && hasActiveFilters) {
      fetchRecipes(searchQuery, filters);
    } else {
      fetchTopRatedRecipes();
      setShowTopRated(true);
    }
  }, [filters, searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilters(initialFilters);
    fetchTopRatedRecipes();
    setShowTopRated(true);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar onSearch={(query) => fetchRecipes(query, filters)} />
        <div className="content" >
          <FilterPanel filters={filters} setFilters={updateFilters} resetFilters={resetFilters} />
          <div className="title-container">
            <Routes>
              <Route
                path="/"
                element={
                  showTopRated ? (
                    <div>
                      <h1 className="title">Top Rated</h1>
                      {loading ? (
                        <div className="loading">Loading...</div>
                      ) : (
                        <RecipeList recipes={topRatedRecipes} />
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="search-results-header">
                        <h1 className="title">Search Results for {searchQuery}</h1>
                        <button className="clear-button" onClick={handleClearSearch}>Clear</button>
                      </div>
                      {loading ? (
                        <div className="loading">Loading...</div>
                      ) : (
                        <RecipeList recipes={recipes} />
                      )}
                    </div>
                  )
                }
              />
              <Route path="/recipe/:id" element={<RecipeDetails />} /> 
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
