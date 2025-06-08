import {
  Home as HomeIcon,
  Chat as ChatIcon,
  Quiz as QuizIcon,
  MenuBook as MenuBookIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import type { NavigationItem } from './types';

/**
 * Header constants
 * Extracted to follow Single Responsibility Principle
 */

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'Home',
    path: '/',
    icon: HomeIcon,
  },
  {
    label: 'Chat',
    path: '/chat',
    icon: ChatIcon,
    requiresAuth: true,
  },
  {
    label: 'Quiz',
    path: '/quiz',
    icon: QuizIcon,
  },
  {
    label: 'Book',
    path: '/book',
    icon: MenuBookIcon,
  },
  {
    label: 'Learn',
    path: '/learn',
    icon: SchoolIcon,
  },
];

export const SCROLL_THRESHOLD = 50;

export const HEADER_STYLES = {
  darkModeGradient: 'linear-gradient(to right, #013427, #014d40)',
  darkModeIconColor: 'rgba(158, 255, 2, 0.92)',
  darkModeTextColor: '#e0f7fa',
  darkModeIconFilter: 'drop-shadow(0 0 2px rgba(248, 89, 45, 0.5))',
  darkModeTextShadow: '0px 0px 8px rgba(224, 247, 250, 0.3)',
} as const;
