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

  // Service types with durations and numeric IDs for API
  const serviceTypes = [
    { id: 'checkup', name: 'Regular Checkup', duration: 30, serviceId: 1 },
    { id: 'cleaning', name: 'Dental Cleaning', duration: 45, serviceId: 2 },
    { id: 'filling', name: 'Dental Filling', duration: 60, serviceId: 3 },
    { id: 'extraction', name: 'Tooth Extraction', duration: 90, serviceId: 4 },
    { id: 'consultation', name: 'Consultation', duration: 30, serviceId: 5 },
    { id: 'root-canal', name: 'Root Canal', duration: 120, serviceId: 6 },
    { id: 'crown', name: 'Crown Placement', duration: 90, serviceId: 7 },
    { id: 'emergency', name: 'Emergency Visit', duration: 45, serviceId: 8 },
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
   * Load dentists for selected clinic
   */
  const loadDentists = useCallback(async () => {
    if (!bookingData.clinicId) {
      setDentists([]);
      return;
    }

    setLoading(true);
    try {
      const dentistsData = await api.clinic.getClinicDentists(bookingData.clinicId);
      setDentists(dentistsData || []);
    } catch (error) {
      console.error('Failed to load dentists:', error);
      setErrors(prev => ({ ...prev, dentists: 'Failed to load dentists' }));
      setDentists([]);
    } finally {
      setLoading(false);
    }
  }, [bookingData.clinicId]);

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

      case 1: // Time and dentist selection
        if (!bookingData.startTime) {
          newErrors.startTime = 'Please select a time slot';
        }
        if (!bookingData.endTime) {
          newErrors.endTime = 'End time is required';
        }
        if (!bookingData.date) {
          newErrors.date = 'Date is required';
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

      // Get the numeric service ID from the selected service type
      const selectedService = serviceTypes.find(s => s.id === bookingData.serviceType);
      const numericServiceId = selectedService ? selectedService.serviceId : null;

      if (!numericServiceId) {
        throw new Error(`Invalid service type: ${bookingData.serviceType}`);
      }

      // Create appointment with correct API field names
      const appointmentData = {
        patientId: patientId,
        dentistId: bookingData.dentistId,
        clinicId: bookingData.clinicId,
        createdBy: currentUser?.id || patientId, // Use current user ID or patient ID if creating new patient
        serviceId: numericServiceId, // Use numeric service ID
        appointmentDate: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        reasonForVisit: bookingData.reason,
        symptoms: bookingData.symptoms || '',
        urgencyLevel: bookingData.urgency || 'medium',
        notes: bookingData.notes || ''
      };

      // Validate required fields before submission
      const requiredFields = ['patientId', 'dentistId', 'clinicId', 'createdBy', 'serviceId', 'appointmentDate', 'startTime', 'endTime', 'reasonForVisit'];
      const missingFields = requiredFields.filter(field => !appointmentData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      console.log('Submitting appointment data:', appointmentData);
      const newAppointment = await api.appointment.createAppointment(appointmentData);

      confirmationDialog.showSuccess(
        'Appointment Booked',
        'Your appointment has been successfully booked. You will receive a confirmation email shortly.'
      );

      if (onBookingComplete) {
        onBookingComplete(newAppointment);
      }

      // Reset form
      resetBooking();
      return true;
    } catch (error) {
      console.error('Failed to book appointment:', error);

      // Extract error message from API response
      let errorMessage = 'Failed to book the appointment. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.dataObject) {
        // Handle validation errors
        const validationErrors = error.response.data.dataObject;
        const errorFields = Object.keys(validationErrors);
        if (errorFields.length > 0) {
          errorMessage = `Validation failed: ${errorFields.join(', ')}`;
        }
      }

      confirmationDialog.showError(
        'Booking Failed',
        errorMessage
      );
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

  // Load dentists when clinic changes
  useEffect(() => {
    loadDentists();
  }, [loadDentists]);

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
    loadDentists,
    loadAvailableSlots,

    // Dialog
    confirmationDialog: confirmationDialog.dialogProps,
  };
};

export default useAppointmentBooking;
