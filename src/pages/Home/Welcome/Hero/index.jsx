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
    useTheme,
    Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import dentalQuestionImg from '../../../../assets/d2.jpg';
import findDentistImg from '../../../../assets/d5.jpeg';

const Hero = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const white_t = theme.palette.common.white_t || 'rgba(255, 255, 255, 0.2)';
    const secondary_A100_t = (theme.palette.secondary && theme.palette.secondary.A100_t) || 'rgba(77, 182, 172, 0.2)';

    return (

        <Container maxWidth="lg" sx={{ my: 4, textAlign: 'center' }}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mb: 3
                }}
            >
                <Box
                    component="span"
                    sx={{
                        textShadow: isDarkMode
                            ? '0 0 10px rgba(0, 230, 180, 0.6), 0 0 20px rgba(0, 230, 180, 0.4)'
                            : '0 0 10px rgba(1, 52, 39, 0.3), 0 0 20px rgba(1, 52, 39, 0.2)',
                        letterSpacing: '0.5px',
                        position: 'relative',
                        display: 'inline-block',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80px',
                            height: '3px',
                            background: isDarkMode
                                ? `linear-gradient(90deg, transparent, ${theme.palette.secondary.light}, transparent)`
                                : `linear-gradient(90deg, transparent, ${theme.palette.primary.dark}, transparent)`,
                            borderRadius: '2px'
                        }
                    }}
                >
                    Dental Chat
                </Box>
                <Box
                    component="span"
                    sx={{
                        color: isDarkMode ? theme.palette.text.secondary : 'inherit'
                    }}
                >
                    {' with Live Dentists'}
                </Box>
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{
                        mx: 2,
                        fontWeight: 'medium',
                        color: isDarkMode ? theme.palette.success.light : 'primary.main'
                    }}
                >
                    Ask Dental Questions
                </Typography>
                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        borderColor: isDarkMode ? theme.palette.secondary.light : 'primary.main'
                    }}
                />
                <Typography
                    variant="h6"
                    sx={{
                        mx: 2,
                        fontWeight: 'medium',
                        color: isDarkMode ? theme.palette.success.light : 'primary.main'
                    }}
                >
                    Find a Clinic
                </Typography>
            </Box>

            <Grid container spacing={4} sx={{ mt: 2, justifyContent: 'center' }}>
                {[{
                    title: "Ask a dental question",
                    image: dentalQuestionImg,
                    alt: "Dental Questions",
                    link: "/chat"
                }, {
                    title: "Find a clinic",
                    image: findDentistImg,
                    alt: "Find a Clinic",
                    link: "/find-a-clinic"
                }].map((item, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <Card
                            elevation={isDarkMode ? 4 : 2}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                border: isDarkMode ? `1px solid ${theme.palette.divider}` : 'none',
                                '&:hover': {
                                    boxShadow: theme.shadows[isDarkMode ? 8 : 4]
                                }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                                <CardMedia
                                    component="img"
                                    height="360"
                                    image={item.image}
                                    alt={item.alt}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 2,
                                        filter: isDarkMode ? 'brightness(0.9)' : 'none'
                                    }}
                                />
                                <Button
                                    component={RouterLink}
                                    to={item.link}
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    sx={{
                                        borderRadius: 8, // Keep unique border radius
                                        px: 3,
                                        '&:hover': {
                                            transform: 'translateY(-3px)',
                                            boxShadow: theme.shadows[6]
                                        },
                                        textShadow: isDarkMode
                                            ? '0 1px 3px rgba(0, 0, 0, 0.4)'
                                            : '0 1px 2px rgba(0, 0, 0, 0.2)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: '-100%',
                                            width: '100%',
                                            height: '100%',
                                            background: isDarkMode
                                                ? `linear-gradient(90deg, transparent, ${secondary_A100_t}, transparent)`
                                                : `linear-gradient(90deg, transparent, ${white_t}, transparent)`,
                                            transition: 'all 0.5s ease'
                                        },
                                        '&:hover::before': {
                                            left: '100%'
                                        }
                                    }}
                                >
                                    <Box sx={{ fontWeight: 'medium', display: 'inline-block' }}>
                                        {item.title}
                                    </Box>
                                </Button>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 2 }}
                                >
                                    click here
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Hero;