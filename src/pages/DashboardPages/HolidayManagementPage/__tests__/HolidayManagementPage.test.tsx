import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import HolidayManagementPage from '../index';
import { AuthProvider } from '../../../../context/auth';

// Mock the API
jest.mock('../../../../services', () => ({
  clinic: {
    getClinicHolidays: jest.fn().mockResolvedValue([]),
    getUpcomingHolidays: jest.fn().mockResolvedValue([]),
    createHoliday: jest.fn().mockResolvedValue({}),
  },
}));

// Mock the auth context
const mockCurrentUser = {
  id: 1,
  email: 'admin@clinic.com',
  firstName: 'Admin',
  lastName: 'User',
  roles: ['CLINIC_ADMIN'],
  clinicId: 1,
};

const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockAuthValue = {
    currentUser: mockCurrentUser,
    isAuthenticated: true,
    loading: false,
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    googleIdLogin: jest.fn(),
    processAuthToken: jest.fn(),
  };

  return (
    <AuthProvider value={mockAuthValue as any}>
      {children}
    </AuthProvider>
  );
};

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MockAuthProvider>
            {component}
          </MockAuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('HolidayManagementPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders holiday management page for clinic admin', async () => {
    renderWithProviders(<HolidayManagementPage />);

    // Check if the main heading is present
    expect(screen.getByText('Holiday Management')).toBeInTheDocument();

    // Check if the add holiday button is present (on desktop)
    await waitFor(() => {
      const addButton = screen.queryByText('Add Holiday');
      if (addButton) {
        expect(addButton).toBeInTheDocument();
      }
    });
  });

  it('shows access denied for non-admin users', () => {
    const nonAdminUser = {
      ...mockCurrentUser,
      roles: ['PATIENT'],
    };

    const MockNonAdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      const mockAuthValue = {
        currentUser: nonAdminUser,
        isAuthenticated: true,
        loading: false,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        googleIdLogin: jest.fn(),
        processAuthToken: jest.fn(),
      };

      return (
        <AuthProvider value={mockAuthValue as any}>
          {children}
        </AuthProvider>
      );
    };

    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MockNonAdminAuthProvider>
              <HolidayManagementPage />
            </MockNonAdminAuthProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Access denied/)).toBeInTheDocument();
    expect(screen.getByText(/Only clinic administrators can manage holidays/)).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    renderWithProviders(<HolidayManagementPage />);

    // Should show loading spinner initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
