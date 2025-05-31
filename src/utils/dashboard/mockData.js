/**
 * Centralized mock data for dashboard components
 */

// Patient Dashboard Mock Data
export const mockPatientAppointmentsData = [
  { 
    id: 'appt1', 
    dentistName: 'Dr. Smith', 
    time: '10:00 AM', 
    date: '2024-07-30', 
    type: 'Check-up', 
    status: 'Confirmed' 
  },
  { 
    id: 'appt2', 
    dentistName: 'Dr. Johnson', 
    time: '02:00 PM', 
    date: '2024-08-05', 
    type: 'Cleaning', 
    status: 'Pending' 
  },
];

// Dentist Dashboard Mock Data
export const mockDentistAppointmentsData = [
  { 
    id: 'appt1', 
    patientName: 'John Doe', 
    time: '10:00 AM', 
    date: '2024-07-30', 
    type: 'Check-up', 
    status: 'Confirmed' 
  },
  { 
    id: 'appt2', 
    patientName: 'Alice Brown', 
    time: '11:30 AM', 
    date: '2024-07-30', 
    type: 'Filling', 
    status: 'Confirmed' 
  },
  {
    id: 'appt3',
    patientName: 'Bob Green',
    time: '02:00 PM',
    date: '2024-07-30',
    type: 'Consultation',
    status: 'Pending'
  },
  {
    id: 'appt4',
    patientName: 'Carol White',
    time: '09:00 AM',
    date: '2024-07-31',
    type: 'Cleaning',
    status: 'Confirmed'
  },
];

export const mockDentistPatientRecordsData = [
  { 
    id: 'patient1', 
    name: 'John Doe', 
    lastVisit: '2024-01-15', 
    notes: 'Regular check-up, no issues.' 
  },
  { 
    id: 'patient2', 
    name: 'Alice Brown', 
    lastVisit: '2024-03-22', 
    notes: 'Filling on tooth #14.' 
  },
];

export const mockDentistProfileData = {
  name: 'Dr. Jane Smith',
  specialty: 'General Dentistry',
  license: 'DDS-12345',
  experience: '10 years',
  education: 'Harvard School of Dental Medicine',
  avatarUrl: null,
};

// Clinic Admin Dashboard Mock Data
export const mockClinicDetailsData = {
  name: 'Sunshine Dental Clinic',
  address: '123 Main Street, Anytown, ST 12345',
  phone: '(555) 123-4567',
  email: 'info@sunshinedental.com',
  website: 'www.sunshinedental.com',
  hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-3PM',
};

export const mockPendingApprovalsData = [
  {
    id: 'approval1',
    requestedRole: 'Dentist',
    userName: 'Dr. Michael Brown',
    userEmail: 'michael.brown@email.com',
    clinicName: 'Sunshine Dental Clinic',
    requestReason: 'Joining as associate dentist',
    createdAt: '2024-07-25T10:00:00Z',
    type: 'Staff Signup'
  },
  {
    id: 'approval2',
    requestedRole: 'Receptionist',
    userName: 'Sarah Wilson',
    userEmail: 'sarah.wilson@email.com',
    clinicName: 'Sunshine Dental Clinic',
    requestReason: 'New receptionist position',
    createdAt: '2024-07-26T14:30:00Z',
    type: 'Staff Signup'
  },
];

// Receptionist Dashboard Mock Data
export const mockReceptionistClinicInfoData = { 
  name: 'Sunshine Dental Clinic', 
  todayDate: new Date().toLocaleDateString() 
};

export const mockReceptionistAppointmentsData = [
  { 
    id: 'appt1', 
    patientName: 'John Doe', 
    time: '10:00 AM', 
    dentist: 'Dr. Smith', 
    type: 'Check-up', 
    status: 'Confirmed' 
  },
  {
    id: 'appt2',
    patientName: 'Alice Brown',
    time: '11:30 AM',
    dentist: 'Dr. Smith',
    type: 'Filling',
    status: 'Confirmed'
  },
  {
    id: 'appt3',
    patientName: 'Bob Green',
    time: '02:00 PM',
    dentist: 'Dr. Grant',
    type: 'Consultation',
    status: 'Arrived'
  },
  {
    id: 'appt4',
    patientName: 'Carol White',
    time: '03:00 PM',
    dentist: 'Dr. Smith',
    type: 'Cleaning',
    status: 'Pending Confirmation'
  },
];

export const mockReceptionistPatientsData = [
  {
    id: 'patient1',
    name: 'John Doe',
    phone: '555-1234',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-07-30 10:00 AM'
  },
  {
    id: 'patient2',
    name: 'Alice Brown',
    phone: '555-5678',
    lastVisit: '2024-03-22',
    nextAppointment: '2024-07-30 11:30 AM'
  },
];

// System Admin Dashboard Mock Data
export const mockSystemAdminPendingApprovalsData = [
  {
    id: 'approval1',
    type: 'Clinic Administrator Signup',
    userName: 'Dr. Emily Carter',
    userEmail: 'emily.carter@email.com',
    clinicName: 'New Health Clinic',
    requestReason: 'Opening new dental practice',
    createdAt: '2024-07-25T10:00:00Z',
    date: new Date().toLocaleDateString()
  },
  {
    id: 'approval2',
    type: 'System Feature Request',
    userName: 'Tech Team',
    userEmail: 'tech@company.com',
    details: 'Request for new reporting module',
    requestReason: 'Enhanced reporting capabilities needed',
    createdAt: '2024-07-26T14:30:00Z',
    date: new Date().toLocaleDateString()
  },
];

export const mockSystemAdminSystemUsersData = [
  { 
    id: 'user1', 
    name: 'John Doe', 
    role: 'PATIENT', 
    email: 'john.doe@example.com', 
    status: 'Active' 
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    role: 'DENTIST',
    email: 'jane.smith@example.com',
    clinic: 'Sunshine Dental',
    status: 'Active'
  },
  {
    id: 'user3',
    name: 'Alice Brown',
    role: 'CLINIC_ADMIN',
    email: 'alice.brown@example.com',
    clinic: 'Bright Smiles',
    status: 'Pending Approval'
  },
];

// Common data generators
export const generateMockId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const generateMockDate = (daysFromNow = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const generateMockTime = () => {
  const hours = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
  const minutes = Math.random() < 0.5 ? '00' : '30';
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes} ${period}`;
};

// Data fetching simulation
export const simulateApiCall = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const simulateApiError = (message = 'API Error', delay = 1000) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
};
