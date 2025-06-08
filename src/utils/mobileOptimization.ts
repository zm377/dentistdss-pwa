/**
 * Mobile optimization utilities for the dental clinic PWA
 * Provides constants, helpers, and responsive design utilities
 */

// Touch target sizes (following Material Design guidelines)
export const TOUCH_TARGETS = {
  MINIMUM: 44, // Minimum touch target size in pixels
  RECOMMENDED: 48, // Recommended touch target size for mobile
  LARGE: 56, // Large touch target for important actions
} as const;

// Responsive breakpoints (matching Material-UI theme)
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 900,
  LG: 1200,
  XL: 1536,
} as const;

// Mobile-specific spacing values
export const MOBILE_SPACING = {
  CONTAINER_PADDING: {
    xs: 2,
    sm: 3,
    md: 4,
  },
  SECTION_MARGIN: {
    xs: 2,
    sm: 3,
    md: 4,
  },
  FORM_SPACING: {
    xs: 2,
    sm: 2.5,
    md: 3,
  },
} as const;

// Typography scaling for mobile
export const MOBILE_TYPOGRAPHY = {
  SCALE_FACTOR: {
    xs: 0.85,
    sm: 0.9,
    md: 1,
  },
  LINE_HEIGHT: {
    xs: 1.4,
    sm: 1.5,
    md: 1.6,
  },
} as const;

// Image optimization settings
export const IMAGE_OPTIMIZATION = {
  HERO_HEIGHT: {
    xs: 240,
    sm: 300,
    md: 360,
  },
  CARD_HEIGHT: {
    xs: 200,
    sm: 250,
    md: 300,
  },
  QUALITY: {
    mobile: 75,
    desktop: 85,
  },
} as const;

// Type definitions
type SizeVariant = 'small' | 'medium' | 'large';
type DensityVariant = 'tight' | 'normal' | 'loose';
type InputType = 'email' | 'tel' | 'number' | 'url' | 'search' | 'text';

interface ResponsiveSpacing {
  xs: number;
  sm: number;
  md: number;
  [key: string]: number; // Add index signature for Material-UI compatibility
}

interface TouchFriendlyButtonProps {
  minHeight: number;
  padding: string;
}

interface MobileInputProps {
  inputMode: string;
  autoCapitalize: string;
  autoCorrect: string;
  spellCheck: string;
}

interface ResponsiveImageProps {
  src: string;
  alt: string;
  loading: 'eager' | 'lazy';
  sizes: string;
  style: {
    width: string;
    height: string;
    objectFit: string;
  };
}

interface ResponsiveImageOptions {
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

interface MobileContainerProps {
  maxWidth: string;
  sx: {
    px: ResponsiveSpacing;
    py: ResponsiveSpacing;
  };
}

/**
 * Get responsive padding based on screen size
 */
export const getResponsivePadding = (size: SizeVariant = 'medium'): ResponsiveSpacing => {
  const paddingMap: Record<SizeVariant, ResponsiveSpacing> = {
    small: { xs: 1, sm: 1.5, md: 2 },
    medium: { xs: 2, sm: 2.5, md: 3 },
    large: { xs: 2.5, sm: 3, md: 4 },
  };
  return paddingMap[size] || paddingMap.medium;
};

/**
 * Get responsive margin based on screen size
 */
export const getResponsiveMargin = (size: SizeVariant = 'medium'): ResponsiveSpacing => {
  const marginMap: Record<SizeVariant, ResponsiveSpacing> = {
    small: { xs: 1, sm: 1.5, md: 2 },
    medium: { xs: 2, sm: 2.5, md: 3 },
    large: { xs: 3, sm: 4, md: 5 },
  };
  return marginMap[size] || marginMap.medium;
};

/**
 * Get responsive font size using clamp for fluid typography
 */
export const getResponsiveFontSize = (
  minSize: number, 
  maxSize: number, 
  vwSize: number = 2.5
): string => {
  return `clamp(${minSize}rem, ${vwSize}vw, ${maxSize}rem)`;
};

/**
 * Get touch-friendly button props
 */
export const getTouchFriendlyButtonProps = (
  size: SizeVariant = 'medium', 
  isMobile: boolean = false
): TouchFriendlyButtonProps => {
  const sizeMap: Record<SizeVariant, TouchFriendlyButtonProps> = {
    small: {
      minHeight: isMobile ? TOUCH_TARGETS.MINIMUM : 36,
      padding: isMobile ? '10px 18px' : '8px 16px',
    },
    medium: {
      minHeight: isMobile ? TOUCH_TARGETS.RECOMMENDED : 44,
      padding: isMobile ? '14px 24px' : '12px 20px',
    },
    large: {
      minHeight: isMobile ? TOUCH_TARGETS.LARGE : 52,
      padding: isMobile ? '18px 32px' : '16px 28px',
    },
  };
  
  return sizeMap[size] || sizeMap.medium;
};

/**
 * Get mobile-optimized input props
 */
export const getMobileInputProps = (inputType: InputType = 'text'): MobileInputProps => {
  const inputModeMap: Record<InputType, string> = {
    email: 'email',
    tel: 'tel',
    number: 'numeric',
    url: 'url',
    search: 'search',
    text: 'text',
  };

  return {
    inputMode: inputModeMap[inputType] || 'text',
    autoCapitalize: inputType === 'email' ? 'none' : 'sentences',
    autoCorrect: inputType === 'email' ? 'off' : 'on',
    spellCheck: inputType === 'email' ? 'false' : 'true',
  };
};

/**
 * Get responsive grid spacing
 */
export const getResponsiveGridSpacing = (density: DensityVariant = 'normal'): ResponsiveSpacing => {
  const spacingMap: Record<DensityVariant, ResponsiveSpacing> = {
    tight: { xs: 1, sm: 1.5, md: 2 },
    normal: { xs: 2, sm: 2.5, md: 3 },
    loose: { xs: 2.5, sm: 3, md: 4 },
  };
  return spacingMap[density] || spacingMap.normal;
};

/**
 * Check if device is likely a mobile device based on user agent
 */
export const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Get optimized image props for responsive images
 */
export const getResponsiveImageProps = (
  src: string, 
  alt: string, 
  options: ResponsiveImageOptions = {}
): ResponsiveImageProps => {
  const {
    priority = false,
    sizes = '(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw',
    quality = 85,
  } = options;

  return {
    src,
    alt,
    loading: priority ? 'eager' : 'lazy',
    sizes,
    style: {
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
    },
  };
};

/**
 * Get mobile-optimized container props
 */
export const getMobileContainerProps = (maxWidth: string = 'md'): MobileContainerProps => {
  return {
    maxWidth,
    sx: {
      px: MOBILE_SPACING.CONTAINER_PADDING,
      py: MOBILE_SPACING.SECTION_MARGIN,
    },
  };
};

/**
 * Performance optimization: Debounce function for resize events
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default {
  TOUCH_TARGETS,
  BREAKPOINTS,
  MOBILE_SPACING,
  MOBILE_TYPOGRAPHY,
  IMAGE_OPTIMIZATION,
  getResponsivePadding,
  getResponsiveMargin,
  getResponsiveFontSize,
  getTouchFriendlyButtonProps,
  getMobileInputProps,
  getResponsiveGridSpacing,
  isMobileDevice,
  getResponsiveImageProps,
  getMobileContainerProps,
  debounce,
};
