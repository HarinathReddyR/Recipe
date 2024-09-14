import React, { useState } from 'react';
import { Collapse, IconButton, Typography, Box, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CategoriesFilter from './CategoriesFilter';
import IngredientsFilter from './IngredientsFilter';
import ProteinsFilter from './ProteinsFilter';
import FatFilter from './FatFilter';
import SodiumFilter from './SodiumFilter';
import RatingFilter from './RatingFilter';
import CaloriesFilter from './CaloriesFilter'; 
import ReplayIcon from '@mui/icons-material/Replay';
import ClearIcon from '@mui/icons-material/Clear';

interface FilterPanelProps {
  filters: {
    categories: string[];
    ingredients: string[];
    proteins: number[];
    fat: number[];
    sodium: number[];
    calories: number[]; 
    rating: { [key: number]: boolean };
  };
  setFilters: (filters: Partial<{
    categories: string[];
    ingredients: string[];
    proteins: number[];
    fat: number[];
    sodium: number[];
    calories: number[]; 
    rating: { [key: number]: boolean };
  }>) => void;
  resetFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, resetFilters }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleExpandClick = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleClear = (section: string) => {
    switch (section) {
      case 'categories':
        setFilters({ categories: [] });
        break;
      case 'ingredients':
        setFilters({ ingredients: [] });
        break;
      case 'proteins':
        setFilters({ proteins: [0, 100] }); 
        break;
      case 'fat':
        setFilters({ fat: [0, 100] });
        break;
      case 'sodium':
        setFilters({ sodium: [0, 2000] });
        break;
      case 'calories':
        setFilters({ calories: [0, 2000] }); 
        break;
      case 'rating':
        setFilters({ rating: {} });
        break;
      default:
        break;
    }
  };

  return (
    <div >
      <Box display="flex" alignItems="center" mb={2} p={2} >
        <Typography variant="h5" sx={{ flexGrow: 1 , fontWeight: 'bold', color: 'black' }}>
          Filter Search
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#E39616',
            color: '#fff',
            '&:hover': { backgroundColor: '#d87c14' }
          }}
          onClick={resetFilters}
        >
          Reset
        </Button>
      </Box>

      <Section
        title="Categories"
        expanded={expandedSection === 'categories'}
        onExpandClick={() => handleExpandClick('categories')}
        onClear={() => handleClear('categories')}
      >
        <CategoriesFilter
          selectedCategories={filters.categories}
          onCategoryChange={(categories) => setFilters({ categories })}
        />
      </Section>

      <Section
        title="Ingredients"
        expanded={expandedSection === 'ingredients'}
        onExpandClick={() => handleExpandClick('ingredients')}
        onClear={() => handleClear('ingredients')}
      >
        <IngredientsFilter
          selectedIngredients={filters.ingredients}
          onIngredientChange={(ingredients) => setFilters({ ingredients })}
        />
      </Section>

      <Section
        title="Proteins"
        expanded={expandedSection === 'proteins'}
        onExpandClick={() => handleExpandClick('proteins')}
        onClear={() => handleClear('proteins')}
      >
        <ProteinsFilter
          proteins={filters.proteins}
          onProteinsChange={(proteins) => setFilters({ proteins })}
          onReset={() => handleClear('proteins')}
        />
      </Section>

      <Section
        title="Fat"
        expanded={expandedSection === 'fat'}
        onExpandClick={() => handleExpandClick('fat')}
        onClear={() => handleClear('fat')}
      >
        <FatFilter
          fat={filters.fat}
          onFatChange={(fat) => setFilters({ fat })}
          onReset={() => handleClear('fat')}
        />
      </Section>

      <Section
        title="Sodium"
        expanded={expandedSection === 'sodium'}
        onExpandClick={() => handleExpandClick('sodium')}
        onClear={() => handleClear('sodium')}
      >
        <SodiumFilter
          sodium={filters.sodium}
          onSodiumChange={(sodium) => setFilters({ sodium })}
          onReset={() => handleClear('sodium')}
        />
      </Section>

      <Section
        title="Calories"
        expanded={expandedSection === 'calories'}
        onExpandClick={() => handleExpandClick('calories')}
        onClear={() => handleClear('calories')}
      >
        <CaloriesFilter
          calories={filters.calories}
          onCaloriesChange={(calories) => setFilters({ calories })}
          onReset={() => handleClear('calories')}
        />
      </Section>

      <Section
        title="Rating"
        expanded={expandedSection === 'rating'}
        onExpandClick={() => handleExpandClick('rating')}
        onClear={() => handleClear('rating')}
      >
        <RatingFilter
          rating={filters.rating}
          onRatingChange={(rating) => setFilters({ rating })}
        />
      </Section>
    </div>
  );
};

interface SectionProps {
  title: string;
  expanded: boolean;
  onExpandClick: () => void;
  onClear: () => void;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, expanded, onExpandClick, onClear, children }) => {
  return (
    <Box mb={2}>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
          {title}
        </Typography>
        <IconButton onClick={onExpandClick} sx={{ marginLeft: 'auto' }}>
          <ExpandMoreIcon
            sx={{
              color: '#E39616', 
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          />
        </IconButton>
        <IconButton onClick={onClear} sx={{ marginLeft: 1 }} aria-label="clear">
          <ReplayIcon sx={{ color: '#E39616' }} /> 
        </IconButton>
      </Box>
      <Collapse in={expanded}>
        <Box mt={2}>{children}</Box>
      </Collapse>
    </Box>
  );
};

export default FilterPanel;
