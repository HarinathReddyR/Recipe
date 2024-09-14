import React from 'react';
import { Slider, Typography, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface CaloriesFilterProps {
  calories: number[];
  onCaloriesChange: (calories: number[]) => void;
  onReset: () => void;
}

const CaloriesFilter: React.FC<CaloriesFilterProps> = ({ calories, onCaloriesChange, onReset }) => {
  return (
    <div>
      <Typography variant="h6">Filter by Calories</Typography>
      <Slider
        value={calories}
        onChange={(_, newValue) => onCaloriesChange(newValue as number[])}
        valueLabelDisplay="auto"
        min={0}
        max={2000}
        step={10}
        marks={[
          { value: 0, label: '0' },
          { value: 500, label: '500' },
          { value: 1000, label: '1000' },
          { value: 1500, label: '1500' },
          { value: 2000, label: '2000' },
        ]}
        getAriaLabel={() => 'Calories range'}
        disableSwap
        sx={{
          color: '#E39616', 
          '& .MuiSlider-thumb': {
            backgroundColor: '#E39616', 
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#FDECD4', 
          },
          '& .MuiSlider-track': {
            backgroundColor: '#E39616', 
          },
        }}
      />
      {/* <IconButton onClick={onReset} aria-label="reset">
        <RefreshIcon sx={{ color: '#E39616' }} />
      </IconButton> */}
    </div>
  );
};

export default CaloriesFilter;
