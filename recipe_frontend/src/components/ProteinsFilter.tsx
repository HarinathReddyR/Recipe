import React from 'react';
import { Slider, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ProteinsFilterProps {
  proteins: number[];
  onProteinsChange: (proteins: number[]) => void;
  onReset: () => void;
}

const ProteinsFilter: React.FC<ProteinsFilterProps> = ({ proteins, onProteinsChange, onReset }) => {
  return (
    <div>
      <Slider
        value={proteins}
        onChange={(_, newValue) => onProteinsChange(newValue as number[])}
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
      {/* <IconButton onClick={onReset} aria-label="reset">
        <RefreshIcon sx={{ color: '#E39616' }} />
      </IconButton> */}
    </div>
  );
};

export default ProteinsFilter;
