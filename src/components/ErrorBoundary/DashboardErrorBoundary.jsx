import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Alert,
  AlertTitle,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import BugReportIcon from '@mui/icons-material/BugReport';

/**
 * Error Boundary specifically designed for dashboard components
 * Provides user-friendly error messages and recovery options
 */
class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Dashboard Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Report error to monitoring service if available
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Default error UI
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            p: 3,
          }}
        >
          <Card sx={{ maxWidth: 600, width: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BugReportIcon color="error" sx={{ mr: 1, fontSize: '2rem' }} />
                <Typography variant="h5" component="h2">
                  Something went wrong
                </Typography>
              </Box>
              
              <Alert severity="error" sx={{ mb: 2 }}>
                <AlertTitle>Dashboard Error</AlertTitle>
                {this.props.userFriendlyMessage || 
                  'An unexpected error occurred while loading this section of the dashboard.'}
              </Alert>

              {import.meta.env.DEV && this.state.error && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Error Details (Development Only):
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: 'grey.100',
                      p: 2,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      overflow: 'auto',
                      maxHeight: '200px',
                    }}
                  >
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </Box>
                </Box>
              )}
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
              <Button
                variant="outlined"
                onClick={this.handleRetry}
                startIcon={<RefreshIcon />}
              >
                Try Again
              </Button>
              <Button
                variant="contained"
                onClick={this.handleReload}
                color="primary"
              >
                Reload Page
              </Button>
            </CardActions>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

DashboardErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
  onError: PropTypes.func,
  userFriendlyMessage: PropTypes.string,
};

export default DashboardErrorBoundary;
