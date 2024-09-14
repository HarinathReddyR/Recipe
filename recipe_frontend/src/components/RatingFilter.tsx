import React from 'react';
import { Button, Box, Typography, Checkbox, FormControlLabel } from '@mui/material';

interface RatingFilterProps {
  rating: { [key: number]: boolean }; 
  onRatingChange: (rating: { [key: number]: boolean }) => void;
}

const RatingFilter: React.FC<RatingFilterProps> = ({ rating, onRatingChange }) => {
  
  
  const handleRatingChange = (star: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedRatings = {
      ...rating,
      [star]: event.target.checked, 
    };
    onRatingChange(updatedRatings); 
  };

  
  const handleClearRating = () => {
    onRatingChange({
      5: false,
      4: false,
      3: false,
    });
  };

  return (
    <Box>
      {/* <Typography variant="h6" sx={{ color: '#000000', fontWeight: 'bold' }}> 
        Rating
      </Typography> */}
      
      {/* 5 Star Rating */}
      <FormControlLabel
        control={
          <Checkbox
            checked={rating[5] || false}
            onChange={handleRatingChange(5)}
            sx={{
              color: '#E39616', 
              '&.Mui-checked': {
                color: '#E39616', 
              },
            }}
          />
        }
        label="5 Star Rating"
      />

      {/* 4 Star & Above Rating */}
      <FormControlLabel
        control={
          <Checkbox
            checked={rating[4] || false}
            onChange={handleRatingChange(4)}
            sx={{
              color: '#E39616', 
              '&.Mui-checked': {
                color: '#E39616', 
              },
            }}
          />
        }
        label="4 Star & Above"
      />

      {/* 3 Star & Above Rating */}
      <FormControlLabel
        control={
          <Checkbox
            checked={rating[3] || false}
            onChange={handleRatingChange(3)}
            sx={{
              color: '#E39616', 
              '&.Mui-checked': {
                color: '#E39616', 
              },
            }}
          />
        }
        label="3 Star & Above"
      />

      {/* Clear button */}
      <Button onClick={handleClearRating} variant="outlined"   sx={{ marginBottom: 2, borderColor: '#E39616', color: '#E39616', '&:hover': { borderColor: '#d87c14', color: '#d87c14' } }}>
        Clear
      </Button>
    </Box>
  );
};

export default RatingFilter;
