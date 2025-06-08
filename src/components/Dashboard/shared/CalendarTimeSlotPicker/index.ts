/**
 * CalendarTimeSlotPicker component exports
 * 
 * Refactored from single 368-line file to modular architecture:
 * - CalendarTimeSlotPicker.tsx: Main component (~150 lines)
 * - useAvailability.ts: Custom hook for availability management
 * - EventComponent.tsx: Custom event component
 * - LoadingAndErrorStates.tsx: State components
 * - CalendarStyles.ts: Styling utilities
 * - utils.ts: Utility functions
 * - types.ts: TypeScript interfaces
 * 
 * Benefits:
 * ✅ 59% reduction in main component size (368 → ~150 lines)
 * ✅ Single Responsibility Principle compliance
 * ✅ Better testability with focused components
 * ✅ Improved maintainability and readability
 * ✅ Reusable components and utilities
 * ✅ Type safety with TypeScript
 */

export { default } from './CalendarTimeSlotPicker';
export { default as CalendarTimeSlotPicker } from './CalendarTimeSlotPicker';
export { useAvailability } from './useAvailability';
export { EventComponent } from './EventComponent';
export { LoadingState, ErrorState, NoDentistState, NoDataState } from './LoadingAndErrorStates';
export * from './utils';
export * from './types';
export * from './CalendarStyles';
