import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Tooltip } from '@mui/material';
import { FaFire, FaLeaf, FaTint, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../css/RecipeCard.css'; 

interface RecipeCardProps {
  id: number;
  title: string;
  description?: string | null;
  calories: number | null;
  proteins: number | null;
  sodium: number | null;
  fat: number | null;
  rating: number | null;
}


const formatValue = (value: number | null): string => {
  return value !== null && value !== undefined ? value.toString() : 'NA';
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  description = '',
  calories,
  proteins,
  sodium,
  fat,
  rating,
}) => {
  const MAX_DESCRIPTION_LENGTH = 60;

  
  const truncatedDescription =
    description && description.length > MAX_DESCRIPTION_LENGTH
      ? `${description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
      : description;

  return (
    <Link to={`/recipe/${id}`} style={{ textDecoration: 'none' }}>
      <Card className="recipe-card" variant="outlined">
        {/* Top part: Title and Description */}
        <CardContent className="card-content">
          <Typography variant="h5" component="div" className="card-title">
            {title}
          </Typography>
          
          {/* Description with smaller font size */}
          <Box className="description-container">
            <Typography
              variant="body2"
              color="text.secondary"
              className="recipe-description"
            >
              {truncatedDescription}
            </Typography>
            {description && description.length > MAX_DESCRIPTION_LENGTH && (
              <Link to={`/recipe/${id}`} className="learn-more-link"> Learn more</Link>
            )}
          </Box>
        </CardContent>

        {/* Bottom part: Nutritional Info and Rating */}
        <Box className="bottom-section">
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
            {/* Calories */}
            <Grid item xs={2.5} style={{ textAlign: 'center' }}>
              <Tooltip title={`Calories: ${formatValue(calories)} kcal`} arrow>
                <Box className="value-container" style={{ fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  {formatValue(calories)}
                  <FaFire className="icon" style={{ marginTop: '4px' }} />
                </Box>
              </Tooltip>
            </Grid>

            {/* Proteins */}
            <Grid item xs={2.5} style={{ textAlign: 'center' }}>
              <Tooltip title={`Proteins: ${formatValue(proteins)} g`} arrow>
                <Box className="value-container" style={{ fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  {formatValue(proteins)}
                  <FaLeaf className="icon" style={{ marginTop: '4px' }} />
                </Box>
              </Tooltip>
            </Grid>

            {/* Sodium */}
            <Grid item xs={2.5} style={{ textAlign: 'center' }}>
              <Tooltip title={`Sodium: ${formatValue(sodium)} mg`} arrow>
                <Box className="value-container" style={{ fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  {formatValue(sodium)}
                  <FaTint className="icon" style={{ marginTop: '4px' }} />
                </Box>
              </Tooltip>
            </Grid>

            {/* Fat */}
            <Grid item xs={2.5} style={{ textAlign: 'center' }}>
              <Tooltip title={`Fat: ${formatValue(fat)} g`} arrow>
                <Box className="value-container" style={{ fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  {formatValue(fat)}
                  <FaFire className="icon" style={{ marginTop: '4px' }} />
                </Box>
              </Tooltip>
            </Grid>

            {/* Rating with Gold Star */}
            <Grid item xs={2.5} className="detail-item">
              <Tooltip title={`Rating: ${formatValue(rating)} stars`} arrow>
                <Box className="rating-container" style={{ cursor: 'pointer' }}>
                  <FaStar className="rating-icon" />
                  <Typography variant="body2" className="rating-value">
                    {formatValue(rating)}
                  </Typography>
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Link>
  );
};

export default RecipeCard;
