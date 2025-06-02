import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import api from '../../services';
import useConfirmationDialog from '../dashboard/useConfirmationDialog';

/**
 * Custom hook for appointment booking workflow
 * 
 * Features:
 * - Multi-step booking process
 * - Clinic and dentist selection
 * - Available slots fetching
 * - Patient profile creation for first-time bookings
 * - Form validation and error handling
 */
const useAppointmentBooking = (onBookingComplete) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [dentists, setDentists] = useState([]);
  const { currentUser } = useAuth();
  const confirmationDialog = useConfirmationDialog();

  // Booking form data
  const [bookingData, setBookingData] = useState({
    clinicId: '',
    dentistId: '',
    date: '',
    startTime: '',
    endTime: '',
    serviceType: '',
    serviceDuration: 30, // Default 30 minutes
    reason: '',
    symptoms: '',
    urgency: 'medium',
    notes: '',
  });

  // Patient data for new patients
  const [patientData, setPatientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
  });

  const [errors, setErrors] = useState({});

  // Service types with durations
  const serviceTypes = [
    { id: 'checkup', name: 'Regular Checkup', duration: 30 },
    { id: 'cleaning', name: 'Dental Cleaning', duration: 45 },
    { id: 'filling', name: 'Dental Filling', duration: 60 },
    { id: 'extraction', name: 'Tooth Extraction', duration: 90 },
    { id: 'consultation', name: 'Consultation', duration: 30 },
    { id: 'root-canal', name: 'Root Canal', duration: 120 },
    { id: 'crown', name: 'Crown Placement', duration: 90 },
    { id: 'emergency', name: 'Emergency Visit', duration: 45 },
  ];

  /**
   * Load available clinics
   */
  const loadClinics = useCallback(async () => {
    setLoading(true);
    try {
      const clinicsData = await api.clinic.getClinics();
      setClinics(clinicsData || []);
    } catch (error) {
      console.error('Failed to load clinics:', error);
      setErrors(prev => ({ ...prev, clinics: 'Failed to load clinics' }));
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load available slots for selected clinic, dentist, and date
   */
  const loadAvailableSlots = useCallback(async () => {
    if (!bookingData.clinicId || !bookingData.dentistId || !bookingData.date || !bookingData.serviceDuration) {
      return;
    }

    setLoading(true);
    try {
      const slots = await api.appointment.getAvailableSlots(
        bookingData.dentistId,
        bookingData.clinicId,
        bookingData.date,
        bookingData.serviceDuration
      );
      setAvailableSlots(slots || []);
    } catch (error) {
      console.error('Failed to load available slots:', error);
      setErrors(prev => ({ ...prev, slots: 'Failed to load available time slots' }));
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  }, [bookingData.clinicId, bookingData.dentistId, bookingData.date, bookingData.serviceDuration]);

  /**
   * Update booking data
   */
  const updateBookingData = useCallback((field, value) => {
    setBookingData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Update service duration when service type changes
      if (field === 'serviceType') {
        const service = serviceTypes.find(s => s.id === value);
        if (service) {
          updated.serviceDuration = service.duration;
        }
      }
      
      // Clear dependent fields when parent fields change
      if (field === 'clinicId') {
        updated.dentistId = '';
        updated.date = '';
        updated.startTime = '';
        updated.endTime = '';
      } else if (field === 'dentistId' || field === 'date' || field === 'serviceDuration') {
        updated.startTime = '';
        updated.endTime = '';
      }
      
      return updated;
    });
    
    // Clear related errors
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, [serviceTypes]);

  /**
   * Update patient data
   */
  const updatePatientData = useCallback((field, value) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  /**
   * Validate current step
   */
  const validateStep = useCallback((step) => {
    const newErrors = {};

    switch (step) {
      case 0: // Clinic selection
        if (!bookingData.clinicId) {
          newErrors.clinicId = 'Please select a clinic';
        }
        break;

      case 1: // Date and time selection
        if (!bookingData.date) {
          newErrors.date = 'Please select a date';
        }
        if (!bookingData.startTime) {
          newErrors.startTime = 'Please select a time slot';
        }
        if (!bookingData.dentistId) {
          newErrors.dentistId = 'Please select a dentist';
        }
        break;

      case 2: // Service details
        if (!bookingData.serviceType) {
          newErrors.serviceType = 'Please select a service type';
        }
        if (!bookingData.reason.trim()) {
          newErrors.reason = 'Please provide a reason for the appointment';
        }
        break;

      case 3: // Patient information (for new patients only)
        if (!currentUser) {
          if (!patientData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
          }
          if (!patientData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
          }
          if (!patientData.email.trim()) {
            newErrors.email = 'Email is required';
          }
          if (!patientData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
          }
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [bookingData, patientData, currentUser]);

  /**
   * Go to next step
   */
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, validateStep]);

  /**
   * Go to previous step
   */
  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  /**
   * Submit booking
   */
  const submitBooking = useCallback(async () => {
    if (!validateStep(currentStep)) {
      return false;
    }

    setLoading(true);
    try {
      let patientId = currentUser?.id;

      // Create patient profile if user is not logged in
      if (!currentUser) {
        const newPatient = await api.appointment.createPatient(patientData);
        patientId = newPatient.id;
      }

      // Create appointment
      const appointmentData = {
        ...bookingData,
        patientId,
      };

      const newAppointment = await api.appointment.createAppointment(appointmentData);

      confirmationDialog.showSuccess({
        title: 'Appointment Booked',
        message: 'Your appointment has been successfully booked. You will receive a confirmation email shortly.'
      });

      if (onBookingComplete) {
        onBookingComplete(newAppointment);
      }

      // Reset form
      resetBooking();
      return true;
    } catch (error) {
      console.error('Failed to book appointment:', error);
      confirmationDialog.showError({
        title: 'Booking Failed',
        message: 'Failed to book the appointment. Please try again.'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentStep, validateStep, currentUser, bookingData, patientData, onBookingComplete, confirmationDialog]);

  /**
   * Reset booking form
   */
  const resetBooking = useCallback(() => {
    setCurrentStep(0);
    setBookingData({
      clinicId: '',
      dentistId: '',
      date: '',
      startTime: '',
      endTime: '',
      serviceType: '',
      serviceDuration: 30,
      reason: '',
      symptoms: '',
      urgency: 'medium',
      notes: '',
    });
    setPatientData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      emergencyContact: '',
    });
    setErrors({});
    setAvailableSlots([]);
    setDentists([]);
  }, []);

  // Load clinics on mount
  useEffect(() => {
    loadClinics();
  }, [loadClinics]);

  // Load available slots when dependencies change
  useEffect(() => {
    loadAvailableSlots();
  }, [loadAvailableSlots]);

  return {
    // State
    currentStep,
    loading,
    clinics,
    availableSlots,
    dentists,
    bookingData,
    patientData,
    errors,
    serviceTypes,
    
    // Actions
    updateBookingData,
    updatePatientData,
    nextStep,
    previousStep,
    submitBooking,
    resetBooking,
    validateStep,
    
    // Utilities
    loadClinics,
    loadAvailableSlots,
    
    // Dialog
    confirmationDialog: confirmationDialog.dialogProps,
  };
};

export default useAppointmentBooking;
