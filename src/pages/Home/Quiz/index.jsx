import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    LinearProgress,
    useTheme,
    useMediaQuery,
    Grid,
    FormControl
} from '@mui/material';
import { green, red } from '@mui/material/colors';

// Questions data as provided previously
const userProvidedQuestions = [
    { q: '🪥 How often do you brush your teeth daily?', a: ['Once', 'Twice', 'More than twice'], correct: ['Twice', 'More than twice'] },
    { q: '🧵 Do you floss daily?', a: ['Yes', 'No'], correct: ['Yes'] },
    { q: '🦷 How often do you visit the dentist?', a: ['Yearly', 'Every few years', 'Never'], correct: ['Yearly'] },
    { q: '🍭 Do you eat sugary snacks often?', a: ['Yes', 'No', 'Sometimes'], correct: ['No'] },
    { q: '🧃 Do you drink soft drinks regularly?', a: ['Yes', 'No'], correct: ['No'] },
    { q: '⏰ How long do you brush your teeth each time?', a: ['Less than 1 min', '1-2 mins', 'More than 2 mins'], correct: ['1-2 mins', 'More than 2 mins'] },
    { q: '😬 Do your gums bleed while brushing?', a: ['Yes', 'No'], correct: ['No'] },
    { q: '🛌 Do you brush before going to bed?', a: ['Yes', 'No'], correct: ['Yes'] },
    { q: '👶 Do your children also follow proper dental hygiene?', a: ['Yes', 'No', 'I don\'t have kids'], correct: ['Yes', 'I don\'t have kids'] },
    { q: '📆 When was your last dental check-up?', a: ['Within 6 months', '1 year ago', 'More than 1 year ago'], correct: ['Within 6 months'] },
    { q: '🪞 Do you check your teeth for plaque or tartar?', a: ['Yes', 'No'], correct: ['Yes'] },
    { q: '🪥 What kind of toothbrush do you use?', a: ['Manual', 'Electric', 'Other'], correct: ['Electric'] },
    { q: '🧼 Do you use mouthwash daily?', a: ['Yes', 'No'], correct: ['Yes'] },
    { q: '🍽️ Do you brush your teeth after meals?', a: ['Yes', 'Sometimes', 'No'], correct: ['Yes'] },
    { q: '🦠 Have you ever had a cavity filled?', a: ['Yes', 'No'], correct: ['No'] },
    { q: '🧀 Do you consume a lot of dairy products?', a: ['Yes', 'No'], correct: ['Yes'] },
    { q: '😷 Do you suffer from bad breath often?', a: ['Yes', 'No'], correct: ['No'] },
    { q: '💧 Do you drink enough water daily?', a: ['Yes', 'No'], correct: ['Yes'] },
    { q: '😴 Do you grind your teeth while sleeping?', a: ['Yes', 'No', 'I don\'t know'], correct: ['No'] },
    { q: '🪥 Do you replace your toothbrush every 3 months?', a: ['Yes', 'No'], correct: ['Yes'] }
];

const quizQuestions = userProvidedQuestions.map((item, index) => ({
    id: `q${index + 1}`,
    question: item.q,
    options: item.a,
    correctAnswers: item.correct,
}));

const Quiz = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDarkMode = theme.palette.mode === 'dark';

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const autoAdvanceTimerRef = useRef(null);

    const handleOptionSelect = (questionId, answer) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answer,
        }));

        if (autoAdvanceTimerRef.current) {
            clearTimeout(autoAdvanceTimerRef.current);
        }

        if (questionId === quizQuestions[currentQuestionIndex].id) {
            autoAdvanceTimerRef.current = setTimeout(() => {
                if (currentQuestionIndex < quizQuestions.length - 1) {
                    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                } else {
                    setShowResults(true);
                }
            }, 700); // Auto-advance after 0.7 seconds
        }
    };

    useEffect(() => {
        // Clear timer if the current question changes for reasons other than auto-advance itself
        // or if component unmounts
        return () => {
            if (autoAdvanceTimerRef.current) {
                clearTimeout(autoAdvanceTimerRef.current);
            }
        };
    }, [currentQuestionIndex]);

    const handlePreviousQuestion = () => {
        if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
        setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    };

    const handleNextQuestion = () => {
        if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            setShowResults(true); // Should be "View Results" button
        }
    };

    const handleRetakeQuiz = () => {
        if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setShowResults(false);
    };

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

    if (showResults) {
        let score = 0;
        quizQuestions.forEach(q => {
            if (q.correctAnswers.includes(userAnswers[q.id])) {
                score++;
            }
        });

        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, borderRadius: 2, bgcolor: isDarkMode ? 'grey.800' : 'background.paper' }}>
                    <Typography variant={isMobile ? "h5" : "h4"} component="h1" align="center" gutterBottom color={isDarkMode ? theme.palette.primary.light : theme.palette.primary.main} mb={3}>
                        Quiz Results
                    </Typography>
                    <Typography variant="h6" align="center" mb={3} color={isDarkMode ? 'grey.300' : 'text.secondary'}>
                        Your Score: {score} out of {quizQuestions.length}
                    </Typography>
                    {quizQuestions.map(q => {
                        const userAnswer = userAnswers[q.id];
                        const isCorrect = userAnswer !== undefined && q.correctAnswers.includes(userAnswer);
                        return (
                            <Paper
                                key={q.id}
                                elevation={1}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    borderRadius: '8px',
                                    borderLeft: `5px solid ${isCorrect ? (isDarkMode ? green[300] : green[500]) : (isDarkMode ? red[300] : red[500])}`,
                                    bgcolor: isDarkMode ? 'grey.700' : (isCorrect ? green[50] : red[50])
                                }}
                            >
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: isDarkMode ? 'grey.100' : 'text.primary' }}>
                                    {q.question}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, color: isDarkMode ? 'grey.300' : 'text.secondary' }}>
                                    Your answer:
                                    <Typography component="span" sx={{ fontWeight: 'bold', color: isCorrect ? (isDarkMode ? green[300] : green[700]) : (isDarkMode ? red[300] : red[700]) }}>
                                        {userAnswer || "Not answered"}
                                    </Typography>
                                </Typography>
                                <Typography variant="body2" sx={{ color: isDarkMode ? 'grey.300' : 'text.secondary' }}>
                                    Our recommendation(s):
                                    <Typography component="span" sx={{ fontWeight: 'bold', color: isDarkMode ? green[300] : green[700] }}>
                                        {q.correctAnswers.join(', ')}
                                    </Typography>
                                </Typography>
                            </Paper>
                        );
                    })}
                    <Box textAlign="center" mt={4}>
                        <Button variant="contained" color="primary" onClick={handleRetakeQuiz}>
                            Retake Quiz
                        </Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    if (!currentQuestion) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h6">Loading quiz...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: isMobile ? 2 : 3, borderRadius: 2, bgcolor: isDarkMode ? 'grey.800' : 'background.paper' }}>
                <Typography variant={isMobile ? "h6" : "h5"} component="h1" align="center" gutterBottom color={isDarkMode ? theme.palette.primary.light : theme.palette.primary.main} mb={1}>
                    Dental Hygiene Quiz
                </Typography>
                <Box sx={{ width: '100%', mb: 2 }}>
                    <LinearProgress variant="determinate" value={progress} />
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
                        Question {currentQuestionIndex + 1} of {quizQuestions.length}
                    </Typography>
                </Box>

                <Box sx={{ minHeight: isMobile ? 'auto' : '100px', mb: 2 }}>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} component="h2" sx={{ fontWeight: 'medium', color: isDarkMode ? 'grey.100' : 'text.primary' }}>
                        {currentQuestion.question}
                    </Typography>
                </Box>

                <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                    <RadioGroup
                        aria-label={currentQuestion.question}
                        name={`question-${currentQuestion.id}`}
                        value={userAnswers[currentQuestion.id] || ''}
                        onChange={(e) => handleOptionSelect(currentQuestion.id, e.target.value)}
                    >
                        <Grid container spacing={1.5}>
                            {currentQuestion.options.map((option, index) => (
                                <Grid item size={12} xs={12} sm={6} key={index}>
                                    <FormControlLabel
                                        value={option}
                                        control={<Radio sx={{
                                            color: isDarkMode ? 'grey.400' : 'grey.600',
                                            '&.Mui-checked': {
                                                color: theme.palette.primary.main,
                                            }
                                        }} />}
                                        label={option}
                                        sx={{
                                            width: '100%',
                                            p: 1,
                                            borderRadius: '4px',
                                            bgcolor: userAnswers[currentQuestion.id] === option
                                                ? (isDarkMode ? theme.palette.primary.dark : theme.palette.primary.light)
                                                : (isDarkMode ? 'grey.700' : 'grey.100'),
                                            color: userAnswers[currentQuestion.id] === option
                                                ? (isDarkMode ? 'white' : theme.palette.primary.contrastText)
                                                : (isDarkMode ? 'grey.100' : 'text.primary'),
                                            '&:hover': {
                                                bgcolor: isDarkMode ? theme.palette.primary.dark : theme.palette.primary.light,
                                                opacity: 0.9
                                            }
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </RadioGroup>
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant="outlined" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                        Previous
                    </Button>
                    {currentQuestionIndex < quizQuestions.length - 1 ? (
                        <Button variant="contained" onClick={handleNextQuestion}>
                            Next
                        </Button>
                    ) : (
                        <Button variant="contained" color="success" onClick={() => setShowResults(true)}>
                            View Results
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Quiz; 