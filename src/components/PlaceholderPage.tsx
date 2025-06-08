import React from 'react';
import {
  Box,
  Typography,
  Alert,
  Card,
  CardContent,
  Container,
} from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

/**
 * Placeholder component for pages that haven't been converted to TypeScript yet
 */
const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  title, 
  description = "This page is currently being migrated to TypeScript and will be available soon." 
}) => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              py: 4,
            }}
          >
            <ConstructionIcon
              sx={{
                fontSize: 64,
                color: 'warning.main',
                mb: 2,
              }}
            />
            <Typography variant="h4" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {description}
            </Typography>
            <Alert severity="info" sx={{ maxWidth: 500 }}>
              This page is currently under development as part of our TypeScript migration. 
              Please check back soon for the full functionality.
            </Alert>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PlaceholderPage;
