import React from 'react';
import { Grid, Typography, Button } from '@mui/material';

interface FiltersProps {
    filters: { [key: string]: boolean }; 
    onFilterChange: (filter: string) => void; 
  }

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6">Filter Options</Typography>
        {/* List of filter options */}
        <div>
          {Object.keys(filters).map((filter) => (
            <Button
              key={filter}
              variant={filters[filter] ? 'contained' : 'outlined'}
              onClick={() => onFilterChange(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h6">Selected Filters</Typography>
        {/* Display selected filter values */}
        <div>
          {Object.entries(filters)
            .filter(([_, selected]) => selected)
            .map(([filter]) => (
              <div key={filter}>{filter}</div>
            ))}
        </div>
      </Grid>
    </Grid>
  );
};

export default Filters;
