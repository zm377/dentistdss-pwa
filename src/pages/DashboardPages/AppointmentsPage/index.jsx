import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Alert,
  Tabs,
  Tab,
  Button,
  useTheme,
  useMediaQuery,
  Typography,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  List as ListIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../context/auth';
import {
  AppointmentCard,
  AppointmentCalendar,
  BookingWizard,
  AppointmentDialog,
  SearchableList
} from '../../../components/Dashboard/shared';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import useAppointments from '../../../hooks/appointment/useAppointments';
import useAppointmentActions from '../../../hooks/appointment/useAppointmentActions';
import useAppointmentBooking from '../../../hooks/appointment/useAppointmentBooking';

/**
 * AppointmentsPage - Unified appointments page for all roles
 *
 * Features:
 * - Role-based appointment views with calendar and list modes
 * - Real-time appointment management
 * - Booking wizard for new appointments
 * - Appointment actions (reschedule, cancel, etc.)
 * - Responsive design with mobile optimization
 */
const AppointmentsPage = ({ userRole = 'PATIENT' }) => {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dialogMode, setDialogMode] = useState('view'); // 'view', 'edit', 'reschedule'
  const [showBookingWizard, setShowBookingWizard] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth() || {};

  // Custom hooks
  const {
    appointments,
    todaysAppointments,
    loading,
    error,
    refreshAppointments,
    updateAppointment,
  } = useAppointments(selectedDate);

  const appointmentActions = useAppointmentActions(updateAppointment);

  const bookingWizard = useAppointmentBooking((newAppointment) => {
    refreshAppointments();
    setShowBookingWizard(false);
  });

  // Event handlers
  const handleAppointmentClick = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setDialogMode('view');
  }, []);

  const handleReschedule = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setDialogMode('reschedule');
  }, []);

  const handleEdit = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setDialogMode('edit');
  }, []);

  const handleCloseDialog = useCallback(() => {
    setSelectedAppointment(null);
    setDialogMode('view');
  }, []);

  const handleViewModeChange = useCallback((event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  }, []);

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  const handleNewAppointment = useCallback((slotInfo = null) => {
    if (slotInfo) {
      bookingWizard.updateBookingData('date', slotInfo.date);
      bookingWizard.updateBookingData('startTime', slotInfo.startTime);
      bookingWizard.updateBookingData('endTime', slotInfo.endTime);
    }
    setShowBookingWizard(true);
  }, [bookingWizard]);

  // Render calendar view
  const renderCalendarView = () => (
    <AppointmentCalendar
      appointments={appointments}
      userRole={userRole}
      selectedDate={selectedDate}
      onSelectEvent={handleAppointmentClick}
      onSelectSlot={handleNewAppointment}
      onNavigate={handleDateChange}
      onNewAppointment={handleNewAppointment}
      showAddButton={userRole === 'PATIENT' || userRole === 'RECEPTIONIST' || userRole === 'CLINIC_ADMIN'}
      height={isMobile ? 500 : 600}
    />
  );

  // Render list view
  const renderListView = () => {
    const searchFields = userRole === 'PATIENT'
      ? ['dentistName', 'serviceType']
      : userRole === 'DENTIST'
      ? ['patientName', 'serviceType']
      : ['patientName', 'dentistName', 'serviceType'];

    const emptyMessage = userRole === 'PATIENT'
      ? 'You have no appointments.'
      : 'No appointments found.';

    const searchPlaceholder = userRole === 'PATIENT'
      ? 'Search by dentist or service type...'
      : userRole === 'DENTIST'
      ? 'Search by patient or service type...'
      : 'Search by patient, dentist, or service type...';

    return (
      <SearchableList
        items={appointments}
        renderItem={(appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            userRole={userRole}
            onViewDetails={handleAppointmentClick}
            onReschedule={handleReschedule}
            onCancel={appointmentActions.cancelAppointment}
            onConfirm={appointmentActions.confirmAppointment}
            onMarkNoShow={appointmentActions.markNoShow}
            onComplete={appointmentActions.completeAppointment}
            compact={isMobile}
          />
        )}
        searchFields={searchFields}
        emptyMessage={emptyMessage}
        searchPlaceholder={searchPlaceholder}
      />
    );
  };

  if (loading) {
    return <Alert severity="info">Loading appointments...</Alert>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ pt: 2, height: '100%' }}>
      {/* Header with View Toggle and Actions */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2,
      }}>
        {/* Title and Today's Count */}
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'medium', mb: 0.5 }}>
            {userRole === 'PATIENT' ? 'My Appointments' : 'Appointments'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {todaysAppointments.length} appointment{todaysAppointments.length !== 1 ? 's' : ''} today
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* View Mode Toggle */}
          <Tabs
            value={viewMode}
            onChange={handleViewModeChange}
            size="small"
            sx={{ minHeight: 'auto' }}
          >
            <Tab
              icon={<CalendarIcon />}
              label={!isMobile ? 'Calendar' : ''}
              value="calendar"
              sx={{ minHeight: 'auto', py: 1 }}
            />
            <Tab
              icon={<ListIcon />}
              label={!isMobile ? 'List' : ''}
              value="list"
              sx={{ minHeight: 'auto', py: 1 }}
            />
          </Tabs>

          {/* New Appointment Button */}
          {(userRole === 'PATIENT' || userRole === 'RECEPTIONIST' || userRole === 'CLINIC_ADMIN') && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleNewAppointment()}
              size={isMobile ? 'small' : 'medium'}
            >
              {isMobile ? 'Book' : 'Book Appointment'}
            </Button>
          )}
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ height: 'calc(100% - 120px)' }}>
        {viewMode === 'calendar' ? renderCalendarView() : renderListView()}
      </Box>

      {/* Appointment Dialog */}
      <AppointmentDialog
        open={!!selectedAppointment}
        onClose={handleCloseDialog}
        appointment={selectedAppointment}
        mode={dialogMode}
        userRole={userRole}
        onReschedule={appointmentActions.rescheduleAppointment}
        onCancel={appointmentActions.cancelAppointment}
        onConfirm={appointmentActions.confirmAppointment}
        onMarkNoShow={appointmentActions.markNoShow}
        onComplete={appointmentActions.completeAppointment}
        loading={appointmentActions.loading}
      />

      {/* Booking Wizard */}
      <BookingWizard
        open={showBookingWizard}
        onClose={() => setShowBookingWizard(false)}
        currentStep={bookingWizard.currentStep}
        bookingData={bookingWizard.bookingData}
        patientData={bookingWizard.patientData}
        errors={bookingWizard.errors}
        clinics={bookingWizard.clinics}
        availableSlots={bookingWizard.availableSlots}
        serviceTypes={bookingWizard.serviceTypes}
        loading={bookingWizard.loading}
        onUpdateBookingData={bookingWizard.updateBookingData}
        onUpdatePatientData={bookingWizard.updatePatientData}
        onNextStep={bookingWizard.nextStep}
        onPreviousStep={bookingWizard.previousStep}
        onSubmitBooking={bookingWizard.submitBooking}
        userRole={userRole}
        isLoggedIn={!!currentUser}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog {...appointmentActions.confirmationDialog} />
      <ConfirmationDialog {...bookingWizard.confirmationDialog} />
    </Box>
  );
};

AppointmentsPage.propTypes = {
  /** User role to determine view type */
  userRole: PropTypes.oneOf(['PATIENT', 'DENTIST', 'RECEPTIONIST', 'CLINIC_ADMIN']),
};

export default AppointmentsPage;
