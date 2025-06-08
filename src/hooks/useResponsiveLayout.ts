import { useMemo } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { MOBILE_SPACING } from '../utils/mobileOptimization';

interface ResponsiveValues {
  xs?: any;
  sm?: any;
  md?: any;
  lg?: any;
  xl?: any;
}

interface SpacingConfig {
  container: number;
  section: number;
  form: number;
  grid: number;
}

interface ContainerProps {
  maxWidth: 'xl' | 'lg';
  sx: {
    px: ResponsiveValues;
    py: number;
  };
}

interface LayoutConfig {
  height: ResponsiveValues;
  gridSize: ResponsiveValues;
  overflow?: ResponsiveValues;
}

interface TypographyConfig {
  title: {
    fontSize: ResponsiveValues;
    textAlign: ResponsiveValues;
  };
  subtitle: {
    fontSize: ResponsiveValues;
  };
  body: {
    fontSize: ResponsiveValues;
  };
  caption: {
    fontSize: ResponsiveValues;
  };
}

interface ButtonSizing {
  search: {
    minWidth: ResponsiveValues;
    minHeight: ResponsiveValues;
    fontSize: ResponsiveValues;
  };
  action: {
    minHeight: ResponsiveValues;
    fontSize: ResponsiveValues;
  };
}

interface FormFieldSizing {
  input: {
    minHeight: ResponsiveValues;
    fontSize: ResponsiveValues;
  };
}

interface BreakpointInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  currentBreakpoint: 'mobile' | 'tablet' | 'desktop';
}

interface UseResponsiveLayoutReturn {
  containerSpacing: number;
  sectionSpacing: number;
  formSpacing: number;
  gridSpacing: number;
  containerProps: ContainerProps;
  mapLayout: LayoutConfig;
  listLayout: LayoutConfig;
  typography: TypographyConfig;
  buttonSizing: ButtonSizing;
  formFieldSizing: FormFieldSizing;
  breakpointInfo: BreakpointInfo;
  getResponsiveValue: (values: ResponsiveValues | any) => any;
}

/**
 * Custom hook for responsive layout calculations
 *
 * Features:
 * - Mobile-first responsive spacing
 * - Breakpoint-aware layout adjustments
 * - Grid system optimization
 * - Container and component sizing
 * - Performance optimized with useMemo
 */
export const useResponsiveLayout = (isMobile: boolean): UseResponsiveLayoutReturn => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  /**
   * Calculate responsive spacing values
   */
  const spacing = useMemo((): SpacingConfig => {
    if (isMobile) {
      return {
        container: MOBILE_SPACING.CONTAINER_PADDING.xs,
        section: MOBILE_SPACING.SECTION_MARGIN.xs,
        form: MOBILE_SPACING.FORM_SPACING.xs,
        grid: 2,
      };
    }
    
    if (isTablet) {
      return {
        container: MOBILE_SPACING.CONTAINER_PADDING.sm,
        section: MOBILE_SPACING.SECTION_MARGIN.sm,
        form: MOBILE_SPACING.FORM_SPACING.sm,
        grid: 3,
      };
    }
    
    return {
      container: MOBILE_SPACING.CONTAINER_PADDING.md,
      section: MOBILE_SPACING.SECTION_MARGIN.md,
      form: MOBILE_SPACING.FORM_SPACING.md,
      grid: 3,
    };
  }, [isMobile, isTablet]);

  /**
   * Calculate responsive container properties
   */
  const containerProps = useMemo(() => ({
    maxWidth: (isDesktop ? 'xl' : 'lg') as 'xl' | 'lg',
    sx: {
      px: { xs: 2, sm: 3, md: 4 },
      py: spacing.container,
    }
  }), [isDesktop, spacing.container]);

  /**
   * Calculate responsive grid spacing
   */
  const gridSpacing = useMemo(() => {
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 3;
  }, [isMobile, isTablet]);

  /**
   * Calculate responsive map layout
   */
  const mapLayout = useMemo(() => ({
    height: {
      xs: '400px',
      sm: '500px',
      md: '600px',
      lg: '600px',
    },
    gridSize: {
      xs: 12,
      md: 8,
    },
  }), []);

  /**
   * Calculate responsive list layout
   */
  const listLayout = useMemo(() => ({
    height: {
      xs: 'auto',
      md: '600px',
    },
    gridSize: {
      xs: 12,
      md: 4,
    },
    overflow: {
      xs: 'visible',
      md: 'auto',
    },
  }), []);

  /**
   * Calculate responsive typography scaling
   */
  const typography = useMemo(() => ({
    title: {
      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
      textAlign: { xs: 'center', md: 'left' },
    },
    subtitle: {
      fontSize: { xs: '1.1rem', sm: '1.25rem' },
    },
    body: {
      fontSize: { xs: '0.875rem', sm: '1rem' },
    },
    caption: {
      fontSize: { xs: '0.75rem', sm: '0.75rem' },
    },
  }), []);

  /**
   * Calculate responsive button sizing
   */
  const buttonSizing = useMemo(() => ({
    search: {
      minWidth: { xs: '100%', sm: 120 },
      minHeight: { xs: 44, sm: 56 },
      fontSize: { xs: '1rem', sm: '0.875rem' },
    },
    action: {
      minHeight: { xs: 36, sm: 36 },
      fontSize: { xs: '0.8rem', sm: '0.875rem' },
    },
  }), []);

  /**
   * Calculate responsive form field sizing
   */
  const formFieldSizing = useMemo(() => ({
    input: {
      minHeight: { xs: 44, sm: 56 },
      fontSize: { xs: '16px', sm: '14px' }, // Prevent zoom on iOS
    },
  }), []);

  /**
   * Get responsive breakpoint information
   */
  const breakpointInfo = useMemo(() => ({
    isMobile,
    isTablet,
    isDesktop,
    currentBreakpoint: (isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop') as 'mobile' | 'tablet' | 'desktop',
  }), [isMobile, isTablet, isDesktop]);

  return {
    // Spacing
    containerSpacing: spacing.container,
    sectionSpacing: spacing.section,
    formSpacing: spacing.form,
    gridSpacing,
    
    // Layout properties
    containerProps,
    mapLayout,
    listLayout,
    
    // Typography
    typography,
    
    // Component sizing
    buttonSizing,
    formFieldSizing,
    
    // Breakpoint information
    breakpointInfo,
    
    // Utility functions
    getResponsiveValue: (values: ResponsiveValues | any): any => {
      if (typeof values === 'object') {
        if (isMobile && values.xs !== undefined) return values.xs;
        if (isTablet && values.sm !== undefined) return values.sm;
        if (values.md !== undefined) return values.md;
        return values.lg || values.xl || values.md || values.sm || values.xs;
      }
      return values;
    },
  };
};
