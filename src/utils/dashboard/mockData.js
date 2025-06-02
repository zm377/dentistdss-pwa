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

// Data fetching simulation
export const simulateApiCall = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};
