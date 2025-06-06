import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Event as EventIcon,
  Person as PersonIcon,
  MedicalServices as MedicalServicesIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { getResponsivePadding, getResponsiveMargin } from '../../../utils/mobileOptimization';
import { useAuth } from '../../../context/auth';
import {
  getDashboardWelcomeMessage,
  getStatusChip,
  formatAppointmentTime,
  formatAppointmentText,
  getAppointmentServiceType
} from '../../../utils/chatUtils.jsx';
import api from '../../../services';

/**
 * OverviewPage - Dashboard overview page for all roles
 *
 * Features:
 * - Role-specific welcome message and content
 * - Today's appointments and quick stats
 * - Real API integration replacing mock data
 * - Responsive design with Material-UI
 */
const OverviewPage = ({ userRole = 'PATIENT' }) => {
  const [clinicDetails, setClinicDetails] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { currentUser } = useAuth() || {};
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Load dashboard data based on user role
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!currentUser?.id) {
        setError('User information not available.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        // Load clinic details if available
        if (currentUser?.clinicId) {
          try {
            const clinicData = await api.clinic.getClinicById(currentUser.clinicId);
            setClinicDetails(clinicData);
          } catch (err) {
            console.warn('Could not load clinic data:', err);
          }
        }

        // Load role-specific data
        if (userRole === 'DENTIST') {
          // Load today's appointments for dentist
          try {
            const today = new Date().toISOString().split('T')[0];
            const appointmentsResponse = await api.appointment.getDentistAppointments(currentUser.id, today);
            setTodayAppointments(appointmentsResponse.data || []);
          } catch (err) {
            console.warn('Could not load dentist appointments:', err);
            setTodayAppointments([]);
          }
        } else if (userRole === 'PATIENT') {
          // Load patient data and appointments
          try {
            const appointmentsResponse = await api.appointment.getPatientAppointments(currentUser.id);
            setTodayAppointments(appointmentsResponse.data || []);

            // Load patient profile data
            const profileResponse = await api.user.getProfile(currentUser.id);
            setPatientData(profileResponse.data || null);
          } catch (err) {
            console.warn('Could not load patient data:', err);
            setTodayAppointments([]);
            setPatientData(null);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load dashboard information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [currentUser?.id, currentUser?.clinicId, userRole]);

  // Get welcome message using utility function
  const welcomeMessage = getDashboardWelcomeMessage(userRole, currentUser, clinicDetails);

  if (loading) {
    return (
      <Box sx={{ p: getResponsivePadding('medium') }}>
        <LinearProgress />
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            textAlign: 'center',
            fontSize: { xs: '0.8rem', sm: '0.875rem' }
          }}
        >
          Loading your dashboard...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: getResponsivePadding('medium') }}>
        <Alert
          severity="error"
          sx={{
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            '& .MuiAlert-message': {
              fontSize: 'inherit'
            }
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: getResponsivePadding('medium') }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        gutterBottom
        sx={{
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          fontWeight: 600,
          mb: getResponsiveMargin('medium')
        }}
      >
        {welcomeMessage}
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        {/* Welcome Card */}
        <Grid item size={6} xs={12} sm={6} md={6} lg={4}>
          <Card
            sx={{
              minHeight: 300,
              borderRadius: 2,
              transition: theme.transitions.create(['box-shadow'], {
                duration: theme.transitions.duration.shorter,
              }),
              '&:hover': {
                boxShadow: theme.shadows[4],
              }
            }}
          >
            <CardContent sx={{ p: getResponsivePadding('medium') }}>
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                gutterBottom
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 0.5, sm: 1 },
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  fontWeight: 600,
                  flexDirection: { xs: 'column', sm: 'row' },
                  textAlign: { xs: 'center', sm: 'left' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {userRole === 'DENTIST' && <MedicalServicesIcon color="primary" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
                  {userRole === 'PATIENT' && <PersonIcon color="primary" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
                  {userRole === 'CLINIC_ADMIN' && <TrendingUpIcon color="primary" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
                  {userRole === 'RECEPTIONIST' && <AccessTimeIcon color="primary" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
                  {userRole === 'SYSTEM_ADMIN' && <AssignmentIcon color="primary" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
                  Dashboard Overview
                </Box>
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  lineHeight: { xs: 1.5, sm: 1.6 },
                  textAlign: { xs: 'center', sm: 'left' }
                }}
              >
                {userRole === 'DENTIST' && "Here's your clinical overview for today. Check your appointments and patient updates."}
                {userRole === 'PATIENT' && "Track your dental health journey and manage your appointments."}
                {userRole === 'CLINIC_ADMIN' && "Manage your clinic operations from this dashboard."}
                {userRole === 'RECEPTIONIST' && "Manage patient appointments and clinic communications."}
                {userRole === 'SYSTEM_ADMIN' && "Monitor system operations and manage platform-wide settings."}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Appointments - For Dentist and Patient */}
        {(userRole === 'DENTIST' || userRole === 'PATIENT') && (
          <Grid item size={3} xs={12} md={8}>
            <Card
              sx={{
                minHeight: 300,
                minWidth: 300,
                borderRadius: 2,
                transition: theme.transitions.create(['box-shadow'], {
                  duration: theme.transitions.duration.shorter,
                }),
                '&:hover': {
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              <CardContent sx={{ p: getResponsivePadding('medium') }}>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 600
                  }}
                >
                  <EventIcon color="primary" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                  {userRole === 'DENTIST' ? "Today's Appointments" : "My Appointments"}
                </Typography>

                {todayAppointments.length === 0 ? (
                  <Alert
                    severity="info"
                    sx={{
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      '& .MuiAlert-message': {
                        fontSize: 'inherit'
                      }
                    }}
                  >
                    {userRole === 'DENTIST' ?
                      "No appointments scheduled for today." :
                      "You have no upcoming appointments."
                    }
                  </Alert>
                ) : (
                  <List sx={{ p: 0 }}>
                    {todayAppointments.slice(0, 5).map((appointment, index) => (
                      <ListItem
                        key={appointment.id || index}
                        divider={index < todayAppointments.length - 1}
                        sx={{
                          px: { xs: 0, sm: 1 },
                          py: { xs: 1, sm: 1.5 },
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'flex-start', sm: 'center' }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: { xs: 'auto', sm: 56 }, mr: { xs: 0, sm: 2 } }}>
                          <AccessTimeIcon
                            color="action"
                            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{
                              display: 'flex',
                              alignItems: { xs: 'flex-start', sm: 'center' },
                              gap: 1,
                              flexDirection: { xs: 'column', sm: 'row' }
                            }}>
                              <Typography
                                variant="subtitle2"
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                              >
                                {formatAppointmentTime(appointment)}
                              </Typography>
                              {getStatusChip(appointment.status)}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: { xs: 0.5, sm: 0 } }}>
                              <Typography
                                variant="body2"
                                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                              >
                                {formatAppointmentText(appointment, userRole)}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                              >
                                {getAppointmentServiceType(appointment)}
                                {appointment.notes && ` - ${appointment.notes}`}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Quick Stats - Role specific */}
        <Grid item size={3} xs={12} md={4}>
          <Card
            sx={{
              minHeight: 300,
              minWidth: 300,
              borderRadius: 2,
              transition: theme.transitions.create(['box-shadow'], {
                duration: theme.transitions.duration.shorter,
              }),
              '&:hover': {
                boxShadow: theme.shadows[4],
              }
            }}
          >
            <CardContent sx={{ p: getResponsivePadding('medium') }}>
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                gutterBottom
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 0.5, sm: 1 },
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  fontWeight: 600
                }}
              >
                <AssignmentIcon color="primary" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                Quick Stats
              </Typography>

              {userRole === 'DENTIST' && (
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    Today's Schedule
                  </Typography>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    color="primary"
                    sx={{
                      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
                      fontWeight: 700
                    }}
                  >
                    {todayAppointments.length}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    Appointments
                  </Typography>
                </Box>
              )}

              {userRole === 'PATIENT' && patientData && (
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    Next Appointment
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 500,
                      mb: 1
                    }}
                  >
                    {todayAppointments.length > 0 ?
                      new Date(todayAppointments[0].appointmentDate || todayAppointments[0].date).toLocaleDateString() :
                      'Not scheduled'
                    }
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      fontSize: { xs: '0.75rem', sm: '0.8rem' }
                    }}
                  >
                    Last Visit: {patientData.lastVisit || 'No previous visits'}
                  </Typography>
                </Box>
              )}

              {userRole === 'CLINIC_ADMIN' && (
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    Clinic Status
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 500,
                      mb: 0.5
                    }}
                  >
                    {clinicDetails?.name || 'Clinic Name'}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                  >
                    Active Operations
                  </Typography>
                </Box>
              )}

              {userRole === 'RECEPTIONIST' && (
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    Today's Schedule
                  </Typography>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    color="primary"
                    sx={{
                      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
                      fontWeight: 700
                    }}
                  >
                    {todayAppointments.length}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    Appointments to Manage
                  </Typography>
                </Box>
              )}

              {userRole === 'SYSTEM_ADMIN' && (
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    System Status
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 500,
                      mb: 0.5
                    }}
                  >
                    Platform Active
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                  >
                    All Systems Operational
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewPage;
