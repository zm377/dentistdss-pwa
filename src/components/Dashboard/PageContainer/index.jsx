import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Toolbar,
  Container,
  useTheme,
} from '@mui/material';
import { getResponsivePadding } from '../../../utils/mobileOptimization';

/**
 * PageContainer - A reusable page layout component that provides consistent
 * page structure with responsive design, proper spacing, and background styling.
 *
 * This component handles:
 * - Main content area layout with responsive width calculations
 * - Toolbar spacing for fixed headers
 * - Container wrapper with responsive padding
 * - Background color theming
 * - Flexible content rendering through children
 */
const PageContainer = ({
  children,
  drawerWidth = 240,
  maxWidth = false,
  disableGutters = false,
  sx = {},
  containerSx = {},
  ...otherProps
}) => {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        minHeight: '100vh',
        overflow: 'auto',
        backgroundColor: theme.palette.background.default,
        p: getResponsivePadding('medium'),
        transition: theme.transitions.create(['background-color'], {
          duration: theme.transitions.duration.standard,
        }),
        ...sx,
      }}
      {...otherProps}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
      <Container
        maxWidth={maxWidth}
        disableGutters={disableGutters}
        sx={{
          px: getResponsivePadding('medium'),
          py: { xs: 1, sm: 2 },
          ...containerSx,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  drawerWidth: PropTypes.number,
  maxWidth: PropTypes.oneOfType([
    PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    PropTypes.bool,
  ]),
  disableGutters: PropTypes.bool,
  sx: PropTypes.object,
  containerSx: PropTypes.object,
};

export default PageContainer;