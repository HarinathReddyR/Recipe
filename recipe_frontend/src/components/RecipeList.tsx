import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Grid, Chip } from '@mui/material';
import { Recipe } from '../interface/Recipe'; // Adjust the import path as needed
import RecipeCard from './ReceipeCard';

interface RecipeListProps {
  recipes: Recipe[];
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes = [] }) => {
  console.log("render");
  console.log("recipes:", recipes);

  if (!Array.isArray(recipes)) {
    return <div>Error: Recipes should be an array.</div>; 
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      {recipes.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          No recipes found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
      {recipes.map((recipe) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.title}>
          <RecipeCard
          id={recipe.id}
            title={recipe.title}
            description={recipe.description}
            calories={recipe.calories}
            proteins={recipe.protein}
            sodium={recipe.sodium}
            fat={recipe.fat}
            rating={recipe.rating}
          />
        </Grid>
      ))}
    </Grid>

      )}
    </Box>
  );
};

export default RecipeList;
