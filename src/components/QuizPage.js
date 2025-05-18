import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const QuizPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';

  // Placeholder for quiz questions and logic
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [quizFinished, setQuizFinished] = React.useState(false);
  const [userAnswers, setUserAnswers] = React.useState({});

  // Sample quiz data (to be replaced with actual questions)
  const quizQuestions = [
    {
      question: "How often should you brush your teeth daily?",
      options: ["Once", "Twice", "More than twice"],
      correctAnswer: "Twice",
      id: "q1"
    },
    {
      question: "What is the primary cause of cavities?",
      options: ["Sugar", "Bacteria", "Lack of Flossing", "Acidic Foods"],
      correctAnswer: "Bacteria", // Though sugar feeds them
      id: "q2"
    },
    // Add more questions here
  ];

  const handleAnswerOptionClick = (selectedOption) => {
    // Store answer
    setUserAnswers(prev => ({ ...prev, [quizQuestions[currentQuestionIndex].id]: selectedOption }));

    // Check if correct (optional: for immediate feedback or final score)
    if (selectedOption === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < quizQuestions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    setUserAnswers({});
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={isDarkMode ? 4 : 3}
        sx={{
          p: isMobile ? 2 : 4,
          borderRadius: 2,
          bgcolor: isDarkMode ? 'rgba(30, 42, 46, 0.9)' : 'background.paper',
          border: isDarkMode ? '1px solid rgba(0, 230, 180, 0.1)' : 'none'
        }}
      >
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ 
            color: isDarkMode ? '#4db6ac' : 'primary.main',
            mb: 3,
            fontWeight: 'medium' 
          }}
        >
          Dental Health Quiz
        </Typography>

        {!quizFinished ? (
          <Box>
            {quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length ? (
              <Box>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  align="center"
                  sx={{ 
                    mb: isMobile ? 2 :3, 
                    fontWeight: 'normal',
                    color: isDarkMode ? '#e0f7fa' : 'text.primary'
                  }}
                >
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </Typography>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  align="center" 
                  sx={{ 
                    mb: 3, 
                    minHeight: isMobile ? '60px' : '80px', // Ensure consistent height
                    color: isDarkMode ? '#e0f7fa' : 'text.primary'
                  }}
                >
                  {quizQuestions[currentQuestionIndex].question}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                    <Button
                      key={index}
                      fullWidth
                      variant={isDarkMode ? "contained" : "outlined"}
                      color="primary"
                      size={isMobile ? "medium" : "large"}
                      onClick={() => handleAnswerOptionClick(option)}
                      sx={{
                        textTransform: 'none',
                        py: 1.5,
                        justifyContent: 'center',
                        bgcolor: isDarkMode ? 'rgba(0, 137, 123, 0.2)' : 'transparent',
                        color: isDarkMode ? '#e0f7fa' : 'primary.main',
                        borderColor: isDarkMode ? 'rgba(0, 230, 180, 0.3)' : 'primary.main',
                        '&:hover': {
                          bgcolor: isDarkMode ? 'rgba(0, 137, 123, 0.4)' : 'rgba(1, 52, 39, 0.04)',
                          borderColor: isDarkMode ? 'rgba(0, 230, 180, 0.5)' : 'primary.dark',
                        }
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </Box>
              </Box>
            ) : (
              <Typography align="center" color={isDarkMode ? '#e0f7fa' : 'text.secondary'} sx={{my: 4}}>
                No quiz questions available at the moment. Please check back later.
              </Typography>
            )}
          </Box>
        ) : (
          <Box textAlign="center">
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{color: isDarkMode ? '#81c784' : 'green', fontWeight: 'medium'}}>
              Quiz Completed!
            </Typography>
            <Typography variant="h6" sx={{color: isDarkMode ? '#e0f7fa' : 'text.primary', mb: 3}}>
              Your Score: {score} out of {quizQuestions.length}
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={restartQuiz}
              sx={{
                mr: isMobile ? 0 : 1, 
                mb: isMobile ? 1 : 0,
                bgcolor: isDarkMode ? '#00897b' : '#013427',
                color: isDarkMode ? '#e0f2f1' : 'white',
                '&:hover': {
                  bgcolor: isDarkMode ? '#00796b' : '#014d40',
                }
              }}
            >
              Restart Quiz
            </Button>
            <Button 
              variant="outlined" 
              color="primary"
              component={RouterLink} 
              to="/"
              sx={{
                borderColor: isDarkMode ? 'rgba(0, 230, 180, 0.5)' : 'primary.main',
                color: isDarkMode ? '#e0f2f1' : 'primary.main',
                 '&:hover': {
                  borderColor: isDarkMode ? 'rgba(0, 230, 180, 0.7)' : 'primary.dark',
                  bgcolor: isDarkMode ? 'rgba(0, 137, 123, 0.1)' : 'rgba(1, 52, 39, 0.04)',
                }
              }}
            >
              Back to Home
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default QuizPage; 