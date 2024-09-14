import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Recipe } from '../interface/Recipe';
import { Typography, Card, CardContent, Box, Divider } from '@mui/material';
import { FaStar } from 'react-icons/fa';
import '../css/RecipeDetails.css'; 

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  
  const ingredients = recipe.ingredients || [];
  const directions = recipe.directions || [];
  const categories = recipe.categories || [];

  return (
    <Card variant="outlined">
      <CardContent>
        
        <Box textAlign="center" mb={2}>
          <Typography variant="h3" sx={{ color: 'black', fontWeight: 'bold' }}>
            {recipe.title}
          </Typography>
        </Box>

        
        {recipe.description && (
          <Typography variant="body1" paragraph>
            {recipe.description}
          </Typography>
        )}

        {/* Rating Section */}
        <Box mb={2}>
          <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }} gutterBottom>
            Rating:
          </Typography>
          <Box className="rating-stars">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`rating-star ${index < recipe.rating ? 'filled' : ''}`}
              />
            ))}
            <Typography variant="body2" sx={{ ml: 1 }}>
              {recipe.rating} / 5
            </Typography>
          </Box>
        </Box>

        {/* Ingredients Section */}
        <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }} gutterBottom>
          Ingredients:
        </Typography>
        <ul>
          {ingredients.map((ingredient, index) => (
            <li key={index}>
              <Typography variant="body1">{ingredient}</Typography>
            </li>
          ))}
        </ul>

        {/* Directions Section */}
        <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }} gutterBottom>
          Directions:
        </Typography>
        <ol>
          {directions.map((direction, index) => (
            <li key={index}>
              <Typography variant="body1">{direction}</Typography>
            </li>
          ))}
        </ol>

        {/* Categories Section */}
        {categories.length > 0 && (
          <>
            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }} gutterBottom>
              Categories:
            </Typography>
            <Box className="categories-container">
              {categories.map((category, index) => (
                <Box key={index} className="category-item">
                  <Typography variant="body2">{category}</Typography>
                </Box>
              ))}
            </Box>
          </>
        )}

        {/* Nutritional Information Section */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }} gutterBottom>
          Nutritional Information:
        </Typography>
        <Typography variant="body2">Calories: {recipe.calories}kcal</Typography>
        <Typography variant="body2">Protein: {recipe.protein}g</Typography>
        <Typography variant="body2">Sodium: {recipe.sodium}mg</Typography>
        <Typography variant="body2">Fat: {recipe.fat}g</Typography>
        <Typography variant="body2">Rating: {recipe.rating} / 5</Typography>

        {/* Date Section */}
        {recipe.date && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Date Added: {new Date(recipe.date).toLocaleDateString()}
          </Typography>
        )}
        <br/>
        <br/>
        

      </CardContent>
    </Card>
  );
};

export default RecipeDetails;
