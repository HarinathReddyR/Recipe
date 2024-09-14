import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase, styled, alpha, Box, MenuItem, CircularProgress } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import Popup from './PopUp'; 
import Filters from './Filterwindow'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'white',
  border: `1px solid ${theme.palette.text.primary}`,
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.8),
  },
  width: 'auto',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'black',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '30ch',
      '&:focus': {
        width: '35ch',
      },
    },
    '&::placeholder': {
      color: alpha(theme.palette.text.primary, 0.6),
    },
  },
}));

const FilterButton = styled(IconButton)(({ theme }) => ({
  color: 'black',
  boxShadow: theme.shadows[2],
}));

const SuggestionsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: 'white',
  borderRadius: '4px',
  boxShadow: theme.shadows[3],
  maxHeight: '300px',
  overflowY: 'auto',
  zIndex: 1300, 
}));

const Navbar: React.FC<{ onSearch: (keyword: string) => void }> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newKeyword = event.target.value;
    setKeyword(newKeyword);

    if (newKeyword) {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/suggestions', {
          params: {
            query: newKeyword,
            searchBy: 'title', 
          },
        });
        setSuggestions(response.data);
        setAnchorEl(event.target); 
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
      setAnchorEl(null); 
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
  
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index} style={{ fontWeight: 'bold' }}>{part}</strong>
      ) : (
        part
      )
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    setKeyword(suggestion); 
    onSearch(suggestion); 
    navigate('/'); 
    setSuggestions([]); 
    setAnchorEl(null); 
  };

  const handleMenuClose = () => {
    setSuggestions([]);
    setAnchorEl(null); 
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      onSearch(keyword); 
      navigate('/'); 
      setSuggestions([]); 
      setAnchorEl(null);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#fdecd4', 
        color: '#333', 
        boxShadow: 'none',
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="./chef.png" alt="Logo" style={{ height: 40, marginRight: 16 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              background: "black",
              fontSize:"30px",
              fontWeight:"bold",
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
          EPIRECIPES
          </Typography>
        </div>
        <Search>
          <SearchIconWrapper>
            <SearchIcon sx={{ color: 'black' }} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={keyword}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoFocus // Ensures user can keep typing
          />
          {Boolean(anchorEl) && (
            <SuggestionsContainer>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                suggestions.map((suggestion, index) => (
                  <MenuItem key={index} onClick={() => handleSuggestionClick(suggestion)} sx={{ color: 'black' }}>
                    {highlightText(suggestion, keyword)}
                  </MenuItem>
                ))
              )}
            </SuggestionsContainer>
          )}
        </Search>
        <FilterButton size="large" edge="end" aria-label="filter" onClick={handleButtonClick}>
          <FilterListIcon />
        </FilterButton>
        <Popup title="Filter" openPopup={openPopup} setOpenPopup={setOpenPopup}>
          <Filters filters={{}} onFilterChange={function (filter: string): void {
            throw new Error('Function not implemented.');
          }} />
        </Popup>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
