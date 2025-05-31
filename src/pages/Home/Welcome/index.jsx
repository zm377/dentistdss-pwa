import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Container,
  Card,
  CardContent,
  CardMedia,
  TextField,
  useTheme,
  CardActionArea,
  Divider
} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';

import dentalQuestionImg from '../../../assets/d2.jpg';
import findDentistImg from '../../../assets/d5.jpeg';
import dentalCareKidsImg from '../../../assets/d6.jpg';
import Hero from './Hero';

const Welcome = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const secondary_A100_t = (theme.palette.secondary && theme.palette.secondary.A100_t) || 'rgba(77, 182, 172, 0.2)';

  return (
      <Box sx={{width: '100%'}}>

        <Hero/>

        <Box sx={{
          bgcolor: isDarkMode ? theme.palette.grey[900] : theme.palette.grey[100],
          py: 5,
          my: 4,
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}>
          <Container maxWidth="md">
            <CardActionArea
                component={RouterLink}
                to="/quiz"
                sx={{
                  display: 'block',
                  textDecoration: 'none',
                  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
                  bgcolor: 'background.paper',
                  border: isDarkMode ? `1px solid ${theme.palette.divider}` : 'none',
                  borderRadius: 2,
                  p: 4,
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: theme.shadows[isDarkMode ? 6 : 3]
                  },
                }}
            >
              <Typography
                  variant="h5"
                  component="h2"
                  align="center"
                  gutterBottom
                  sx={{
                    color: isDarkMode ? theme.palette.secondary.light : 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    textShadow: isDarkMode ? `0 0 8px ${secondary_A100_t}` : 'none',
                    fontWeight: 'medium'
                  }}
              >
                🦷 Dental Health Quiz
              </Typography>

              <Typography
                  variant="subtitle1"
                  align="center"
                  sx={{
                    mb: 3,
                    fontWeight: 'medium',
                    color: 'text.primary'
                  }}
              >
                💭 Test your dental knowledge and learn more about oral health!
              </Typography>

              <Button
                  fullWidth
                  variant="contained"
                  color="primary" // Uses theme.palette.primary.main for bgcolor and contrastText for color
                  sx={{
                    mt: 3,
                    textTransform: 'none',
                    py: 1.5,
                  }}
              >
                Start Dental Health Quiz
              </Button>
            </CardActionArea>
          </Container>
        </Box>

        {/* Book an Appointment Section */}
        <Container maxWidth="md" sx={{my: 6}}>
          <Typography
              variant="h4"
              component="h2"
              align="center"
              gutterBottom
              sx={{
                mb: 4,
                fontWeight: 'medium',
                color: 'text.primary',
                textShadow: isDarkMode ? `0 0 10px ${secondary_A100_t}` : 'none'
              }}
          >
            Book an Appointment
          </Typography>

          <Paper
              elevation={isDarkMode ? 4 : 2}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: isDarkMode ? `1px solid ${theme.palette.divider}` : 'none'
              }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Your Name"
                    variant="outlined"
                    placeholder="Enter your full name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    variant="outlined"
                    InputLabelProps={{shrink: true}}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Time"
                    type="time"
                    variant="outlined"
                    InputLabelProps={{shrink: true}}
                />
              </Grid>
              <Grid item xs={12} sx={{textAlign: 'center'}}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      borderRadius: 1, // Keep specific border radius if intended
                      px: 4,
                      py: 1.8,
                      fontWeight: 'medium',
                      textShadow: isDarkMode ? '0 1px 3px rgba(0, 0, 0, 0.4)' : 'none',
                    }}
                >
                  Book Now
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>

        {/* Dental Care Image */}
        <Box sx={{my: 6, textAlign: 'center'}}>
          <Container maxWidth="lg">
            <CardMedia
                component="img"
                image={dentalCareKidsImg}
                alt="Dental Care for Kids"
                sx={{
                  borderRadius: 2,
                  maxHeight: '300px',
                  objectFit: 'cover',
                  filter: isDarkMode ? 'brightness(0.85)' : 'none',
                  border: isDarkMode ? `1px solid ${theme.palette.divider}` : 'none',
                  boxShadow: isDarkMode ? theme.shadows[3] : 'none'
                }}
            />
          </Container>
        </Box>

        {/* Learn About Dental Care Section */}
        <Container maxWidth="md" sx={{my: 6}}>
          <Typography
              variant="h4"
              component="h2"
              align="center"
              gutterBottom
              sx={{
                mb: 4,
                fontWeight: 'medium',
                color: 'text.primary',
                textShadow: isDarkMode ? `0 0 10px ${secondary_A100_t}` : 'none'
              }}
          >
            Learn About Dental Care
          </Typography>

          <Grid container spacing={3}>
            {[{
              title: "How to Brush Properly",
              text: "Use circular motions, not hard scrubbing."
            }, {
              title: "Avoid Sugary Snacks",
              text: "Sugar increases risk of cavities. Eat fresh fruits instead."
            }, {
              title: "Benefits of Regular Dental Visits",
              text: "Detect issues early and maintain overall health."
            }].map((item, index) => (
                <Grid item size={12} xs={12} sm={6} md={4} key={index}>
                  <Paper
                      elevation={isDarkMode ? 3 : 1}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        borderRadius: 2,
                        bgcolor: isDarkMode ? theme.palette.grey[800] : theme.palette.grey[50],
                        border: isDarkMode ? `1px solid ${theme.palette.divider}` : 'none',
                        mb: index < 2 ? 2 : 0 // Add margin bottom to all but the last item
                      }}
                  >
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          color: isDarkMode ? theme.palette.success.light : 'text.primary',
                          fontWeight: 'medium'
                        }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '1.6rem' // Kept specific font size if intended
                        }}
                    >
                      {item.text}
                    </Typography>
                  </Paper>
                </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
  );
};

export default Welcome;
