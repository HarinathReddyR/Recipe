import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Box, Typography, Grid, Chip, CircularProgress, TextField } from '@mui/material';

interface IngredientFilterProps {
  selectedIngredients: string[];
  onIngredientChange: (ingredients: string[]) => void;
}

const IngredientFilter: React.FC<IngredientFilterProps> = ({ selectedIngredients, onIngredientChange }) => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [displayedIngredients, setDisplayedIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredIngredients, setFilteredIngredients] = useState<string[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/ingredients');
        setIngredients(response.data);
        setFilteredIngredients(response.data.slice(0, 20)); 
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  useEffect(() => {
    const results = ingredients.filter(ingredient => ingredient.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredIngredients(results.slice(0, page * 20));
    setShowMore(results.length > page * 20);
  }, [searchTerm, page, ingredients]);

  const handleShowMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleShowLess = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleIngredientClick = (ingredient: string) => {
    const newSelectedIngredients = selectedIngredients.includes(ingredient)
      ? selectedIngredients.filter(i => i !== ingredient)
      : [...selectedIngredients, ingredient];
    onIngredientChange(newSelectedIngredients);
  };

  const handleClearIngredients = () => {
    onIngredientChange([]);
  };

  return (
    <Box>
      {/* <Typography variant="h6">Ingredients</Typography> */}
      <TextField
        variant="outlined"
        label="Search Ingredients"
        fullWidth
        margin="normal"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      <Button onClick={handleClearIngredients} variant="outlined" color="secondary" sx={{ marginBottom: 2 }}>
        Clear
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container spacing={1}>
            {filteredIngredients.map(ingredient => (
              <Grid item xs={6} sm={4} md={3} key={ingredient}>
                <Chip
                  label={ingredient}
                  clickable
                  color={selectedIngredients.includes(ingredient) ? 'primary' : 'default'}
                  onClick={() => handleIngredientClick(ingredient)}
                  variant={selectedIngredients.includes(ingredient) ? 'filled' : 'outlined'}
                  sx={{ margin: 0.5 }}
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ marginTop: 2 }}>
            {page > 1 && (
              <Button onClick={handleShowLess} variant="contained" sx={{ marginRight: 1 }}>
                Show Less
              </Button>
            )}
            {showMore && (
              <Button onClick={handleShowMore} variant="contained">
                Show More
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default IngredientFilter;
