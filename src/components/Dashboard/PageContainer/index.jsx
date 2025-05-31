import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Toolbar,
  Container,
} from '@mui/material';

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
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        minHeight: '100vh',
        overflow: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? '#F4F6F8' : '#121212',
        p: { xs: 2, md: 3 },
        ...sx,
      }}
      {...otherProps}
    >
      <Toolbar />
      <Container
        maxWidth={maxWidth}
        disableGutters={disableGutters}
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
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