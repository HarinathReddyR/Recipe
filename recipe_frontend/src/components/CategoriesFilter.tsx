import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Box, Typography, Chip, CircularProgress, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RefreshIcon from '@mui/icons-material/Refresh';

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategories, onCategoryChange }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data); 
        setFilteredCategories(response.data.slice(0, 20));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const availableCategories = categories.filter(category => !selectedCategories.includes(category));
    const results = availableCategories.filter(category => category.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredCategories(results.slice(0, page * 20));
    setShowMore(results.length > page * 20);
  }, [searchTerm, page, categories, selectedCategories]);

  const handleShowMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleShowLess = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleCategoryClick = (category: string) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    onCategoryChange(newSelectedCategories);
  };

  const handleClearCategories = () => {
    onCategoryChange([]);
  };

  const handleDeselectCategory = (category: string) => {
    const newSelectedCategories = selectedCategories.filter(c => c !== category);
    onCategoryChange(newSelectedCategories);
  };

  return (
    <Box>
      <TextField
        variant="outlined"
        label="Search Categories"
        fullWidth
        margin="normal"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      <Button
        onClick={handleClearCategories}
        variant="outlined"
        sx={{ marginBottom: 2, borderColor: '#E39616', color: '#E39616', '&:hover': { borderColor: '#d87c14', color: '#d87c14' } }}
      >
        Clear
      </Button>
      
      {/* Display Selected Categories */}
      <Box mb={2}>
        <Typography variant="subtitle1">Selected Categories:</Typography>
        <Box display="flex" flexWrap="wrap" mb={2}>
          {selectedCategories.map(category => (
            <Chip
              key={category}
              label={category}
              onDelete={() => handleDeselectCategory(category)}
              deleteIcon={<CancelIcon sx={{ color: '#E39616' }} />}
              color="primary"
              variant="filled"
              sx={{
                margin: 0.5,
                maxWidth: '300px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                backgroundColor: '#E39616',
                color: '#fff'
              }}
            />
          ))}
        </Box>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box mb={2}>
            <Box display="flex" flexWrap="wrap" mb={2}>
              {filteredCategories.map(category => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => handleCategoryClick(category)}
                  color="default"
                  variant="outlined"
                  sx={{
                    margin: 0.5,
                    maxWidth: '300px', 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    borderColor: '#E39616',
                    color: '#E39616',
                    '&:hover': { borderColor: '#d87c14', color: '#d87c14' }
                  }}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ marginTop: 2 }}>
            {page > 1 && (
              <Button
                onClick={handleShowLess}
                variant="contained"
                sx={{ marginRight: 1, backgroundColor: '#E39616', color: '#fff', '&:hover': { backgroundColor: '#d87c14' } }}
                startIcon={<ArrowDropDownIcon sx={{ color: '#fff' }} />}
              >
                Show Less
              </Button>
            )}
            {showMore && (
              <Button
                onClick={handleShowMore}
                variant="contained"
                sx={{ backgroundColor: '#E39616', color: '#fff', '&:hover': { backgroundColor: '#d87c14' } }}
                endIcon={<ArrowDropDownIcon sx={{ color: '#fff' }} />}
              >
                Show More
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default CategoryFilter;
