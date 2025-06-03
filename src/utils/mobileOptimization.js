/**
 * Mobile optimization utilities for the dental clinic PWA
 * Provides constants, helpers, and responsive design utilities
 */

// Touch target sizes (following Material Design guidelines)
export const TOUCH_TARGETS = {
  MINIMUM: 44, // Minimum touch target size in pixels
  RECOMMENDED: 48, // Recommended touch target size for mobile
  LARGE: 56, // Large touch target for important actions
};

// Responsive breakpoints (matching Material-UI theme)
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 900,
  LG: 1200,
  XL: 1536,
};

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
};

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
};

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
};

/**
 * Get responsive padding based on screen size
 * @param {string} size - Size variant (small, medium, large)
 * @returns {object} Responsive padding object
 */
export const getResponsivePadding = (size = 'medium') => {
  const paddingMap = {
    small: { xs: 1, sm: 1.5, md: 2 },
    medium: { xs: 2, sm: 2.5, md: 3 },
    large: { xs: 2.5, sm: 3, md: 4 },
  };
  return paddingMap[size] || paddingMap.medium;
};

/**
 * Get responsive margin based on screen size
 * @param {string} size - Size variant (small, medium, large)
 * @returns {object} Responsive margin object
 */
export const getResponsiveMargin = (size = 'medium') => {
  const marginMap = {
    small: { xs: 1, sm: 1.5, md: 2 },
    medium: { xs: 2, sm: 2.5, md: 3 },
    large: { xs: 3, sm: 4, md: 5 },
  };
  return marginMap[size] || marginMap.medium;
};

/**
 * Get responsive font size using clamp for fluid typography
 * @param {number} minSize - Minimum font size in rem
 * @param {number} maxSize - Maximum font size in rem
 * @param {number} vwSize - Viewport width percentage
 * @returns {string} CSS clamp value
 */
export const getResponsiveFontSize = (minSize, maxSize, vwSize = 2.5) => {
  return `clamp(${minSize}rem, ${vwSize}vw, ${maxSize}rem)`;
};

/**
 * Get touch-friendly button props
 * @param {string} size - Button size (small, medium, large)
 * @param {boolean} isMobile - Whether the device is mobile
 * @returns {object} Button props object
 */
export const getTouchFriendlyButtonProps = (size = 'medium', isMobile = false) => {
  const sizeMap = {
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
 * @param {string} inputType - Type of input (email, tel, text, etc.)
 * @returns {object} Input props object
 */
export const getMobileInputProps = (inputType = 'text') => {
  const inputModeMap = {
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
 * @param {string} density - Spacing density (tight, normal, loose)
 * @returns {object} Responsive spacing object
 */
export const getResponsiveGridSpacing = (density = 'normal') => {
  const spacingMap = {
    tight: { xs: 1, sm: 1.5, md: 2 },
    normal: { xs: 2, sm: 2.5, md: 3 },
    loose: { xs: 2.5, sm: 3, md: 4 },
  };
  return spacingMap[density] || spacingMap.normal;
};

/**
 * Check if device is likely a mobile device based on user agent
 * @returns {boolean} True if mobile device
 */
export const isMobileDevice = () => {
  if (typeof navigator === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Get optimized image props for responsive images
 * @param {string} src - Image source
 * @param {string} alt - Alt text
 * @param {object} options - Additional options
 * @returns {object} Image props object
 */
export const getResponsiveImageProps = (src, alt, options = {}) => {
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
 * @param {string} maxWidth - Maximum width (xs, sm, md, lg, xl)
 * @returns {object} Container props object
 */
export const getMobileContainerProps = (maxWidth = 'md') => {
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
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
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
