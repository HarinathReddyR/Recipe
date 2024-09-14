import React from 'react';
import { Slider, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface SodiumFilterProps {
  sodium: number[];
  onSodiumChange: (sodium: number[]) => void;
  onReset: () => void;
}

const SodiumFilter: React.FC<SodiumFilterProps> = ({ sodium, onSodiumChange, onReset }) => {
  return (
    <div>
      <Slider
        value={sodium}
        onChange={(_, newValue) => onSodiumChange(newValue as number[])}
        valueLabelDisplay="auto"
        min={0}
        max={2000}
        step={10}
        marks={[
          { value: 0, label: '0mg' },
          { value: 1000, label: '1000mg' },
          { value: 2000, label: '2000mg' },
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
      <IconButton onClick={onReset} aria-label="reset">
        <RefreshIcon sx={{ color: '#E39616' }} />
      </IconButton>
    </div>
  );
};

export default SodiumFilter;
