import { Theme } from '@mui/material/styles';
import { getStatusColor } from '../../../../utils/dashboard/dashboardUtils';

/**
 * Calendar styling utilities
 * Extracted to follow Single Responsibility Principle
 */

/**
 * Get event styles based on appointment status
 */
export const getEventStyle = (status: string, isMobile: boolean) => ({
  style: {
    backgroundColor: getStatusColor(status),
    borderColor: getStatusColor(status),
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: isMobile ? '12px' : '14px',
    padding: '2px 4px',
  },
});

/**
 * Get calendar paper styles
 */
export const getCalendarPaperStyles = (theme: Theme, height: number) => ({
  p: 2,
  height: height,
  '& .rbc-calendar': {
    height: '100%',
  },
  // Custom styles for react-big-calendar
  '& .rbc-header': {
    backgroundColor: theme.palette.grey[50],
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1),
    fontWeight: 'medium',
  },
  '& .rbc-today': {
    backgroundColor: theme.palette.primary.light + '20',
  },
  '& .rbc-off-range-bg': {
    backgroundColor: theme.palette.grey[100],
  },
  '& .rbc-event': {
    borderRadius: theme.shape.borderRadius,
    border: 'none',
  },
  '& .rbc-event:focus': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
  '& .rbc-slot-selection': {
    backgroundColor: theme.palette.primary.light + '40',
  },
  '& .rbc-toolbar': {
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  '& .rbc-toolbar button': {
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: 'transparent',
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.rbc-active': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderColor: theme.palette.primary.main,
    },
  },
  // Dark mode support
  ...(theme.palette.mode === 'dark' && {
    '& .rbc-header': {
      backgroundColor: theme.palette.grey[800],
      color: theme.palette.common.white,
    },
    '& .rbc-off-range-bg': {
      backgroundColor: theme.palette.grey[900],
    },
    '& .rbc-today': {
      backgroundColor: theme.palette.primary.dark + '30',
    },
  }),
});
