import React from 'react';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  useTheme
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface Book {
  title: string;
  authors: string;
  description: string;
  imageUrl?: string;
  amazonLink: string;
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const { title, authors, description, imageUrl, amazonLink } = book;

  return (
      <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: isDarkMode ? 'rgba(38, 50, 56, 0.9)' : 'background.paper',
            border: isDarkMode ? '1px solid rgba(0, 230, 180, 0.1)' : 'none',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: isDarkMode
                  ? `0 8px 16px rgba(0, 230, 180, 0.2)`
                  : `0 8px 16px rgba(0, 0, 0, 0.15)`
            }
          }}
      >
        <CardActionArea
            href={amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2}}
        >
          <CardMedia
              component="img"
              sx={{
                height: 220,
                width: 150,
                objectFit: 'contain', // Or 'cover' if you prefer
                mb: 1,
                borderRadius: '4px'
              }}
              image={imageUrl || 'https://via.placeholder.com/150x220.png?text=Book+Cover'}
              alt={title}
          />
        </CardActionArea>
        <CardContent sx={{flexGrow: 1, textAlign: 'center'}}>
          <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'medium',
                color: isDarkMode ? '#e0f2f1' : 'text.primary',
                minHeight: '3.2em', // Approx 2 lines with some buffer
                lineHeight: '1.4em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
          >
            {title}
          </Typography>
          <Typography
              variant="body2"
              color={isDarkMode ? 'rgba(255,255,255,0.7)' : "text.secondary"}
              sx={{
                minHeight: '2.8em', // Approx 2 lines
                lineHeight: '1.4em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                mb: 1
              }}
          >
            By: {authors}
          </Typography>
          <Typography
              variant="caption"
              color={isDarkMode ? 'rgba(255,255,255,0.6)' : "text.secondary"}
              sx={{
                minHeight: '4em', // Approx 3 lines
                lineHeight: '1.33em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                mb: 2
              }}
          >
            {description}
          </Typography>
        </CardContent>
        <Box sx={{p: 1, pt: 0, textAlign: 'center'}}>
          <Button
              size="small"
              color="primary"
              variant="contained"
              href={amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<OpenInNewIcon/>}
              sx={{
                bgcolor: isDarkMode ? '#00897b' : '#013427',
                color: isDarkMode ? '#e0f2f1' : 'white',
                '&:hover': {
                  bgcolor: isDarkMode ? '#00796b' : '#014d40',
                }
              }}
          >
            View on Amazon
          </Button>
        </Box>
      </Card>
  );
};

export default BookCard;
export type { BookCardProps, Book };