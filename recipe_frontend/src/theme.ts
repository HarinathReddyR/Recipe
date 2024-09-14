// src/theme.ts

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E39616',
    },
    background: {
      default: '#FDECD4',
    },
    text: {
      primary: '#000000',
    },
  },
  components: {
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#E39616', // Slider color
        },
        thumb: {
          backgroundColor: '#E39616', // Thumb color
        },
        track: {
          backgroundColor: '#E39616', // Track color
        },
        rail: {
          backgroundColor: '#FDECD4', // Rail color
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#E39616', // Checkbox color
          '&.Mui-checked': {
            color: '#E39616', // Checked color
          },
        },
      },
    },
  },
});

export default theme;
