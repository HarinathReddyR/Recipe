import React from 'react';
import { Slider, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface FatFilterProps {
  fat: number[];
  onFatChange: (fat: number[]) => void;
  onReset: () => void;
}

const FatFilter: React.FC<FatFilterProps> = ({ fat, onFatChange, onReset }) => {
  // const handleReset = () => {
  //   onFatChange([0, 50]); // Reset fat values to the original min and max range
  //   onReset();
  // };

  return (
    <div>
      <Slider
        value={fat}
        onChange={(_, newValue) => onFatChange(newValue as number[])}
        valueLabelDisplay="auto"
        min={0}
        max={100}
        step={1}
        marks={[
          { value: 0, label: '0g' },
          { value: 50, label: '50g' },
          { value: 100, label: '100g' },
        ]}
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
      {/* <IconButton onClick={handleReset} aria-label="reset">
        <RefreshIcon sx={{ color: '#E39616' }} />
      </IconButton> */}
    </div>
  );
};

export default FatFilter;
