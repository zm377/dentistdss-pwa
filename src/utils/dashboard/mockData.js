/**
 * Centralized mock data for dashboard components
 */

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



// Data fetching simulation
export const simulateApiCall = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};
