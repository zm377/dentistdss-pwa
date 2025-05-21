import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Grid, Card, CardContent } from '@mui/material';
import MessagePanel from './MessagePanel';
import { useAuth } from '../context/AuthContext';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import SettingsIcon from '@mui/icons-material/Settings';
import MessageIcon from '@mui/icons-material/Message';

// Define navigation sections for the sidebar
const navigationSections = [
  { key: 'overview', label: 'Overview', icon: <DashboardIcon /> },
  { key: 'staff', label: 'Staff Management', icon: <PeopleIcon /> },
  { key: 'approvals', label: 'Pending Staff Approvals', icon: <PendingActionsIcon /> },
  { key: 'settings', label: 'Clinic Settings', icon: <SettingsIcon /> },
  { key: 'messages', label: 'Messages', icon: <MessageIcon /> },
];

// Mock data - replace with API calls
const mockClinicDetails = {
  name: 'Sunshine Dental Clinic',
  address: '123 Smile Street, Dental City, DC 12345',
  phone: '555-0101',
  email: 'contact@sunshinedental.com',
  operatingHours: 'Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 4 PM',
};

const mockStaff = [
  { id: 'staff1', name: 'Dr. Jane Smith', role: 'Dentist', email: 'jane.smith@sunshinedental.com', status: 'Active' },
  { id: 'staff2', name: 'Mark Brown', role: 'Receptionist', email: 'mark.brown@sunshinedental.com', status: 'Active' },
  { id: 'staff3', name: 'Dr. Alan Grant', role: 'Dentist', email: 'alan.grant@sunshinedental.com', status: 'Pending Approval' },
];

const mockPendingStaffApprovals = [
  { id: 'approval3', type: 'Dentist Signup', userName: 'Dr. Alan Grant', date: new Date().toLocaleDateString() },
  { id: 'approval4', type: 'Receptionist Signup', userName: 'Sarah Connor', date: new Date().toLocaleDateString() },
];

const ClinicAdminDashboard = ({ activeSection = 'overview' }) => {
  const [clinicDetails, setClinicDetails] = useState(null);
  const [staff, setStaff] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // TODO: Get clinicId from AuthContext or props
  const clinicId = 'sunshinedental'; // Placeholder
  const { currentUser } = useAuth() || {}; // Get currentUser

  useEffect(() => {
    setLoading(true);
    setError('');
    // Simulate API calls for a specific clinic
    setTimeout(() => {
      setClinicDetails(mockClinicDetails); // Assuming clinicId is used to fetch these
      setStaff(mockStaff.filter(s => s.email.includes(clinicId))); // Mock filter
      setPendingApprovals(mockPendingStaffApprovals); // Filter these by clinic if applicable
      setLoading(false);
    }, 1000);
  }, [clinicId]);

  const handleOpenApprovalDialog = (approval) => {
    setSelectedApproval(approval);
    setOpenApprovalDialog(true);
    setRejectionReason('');
  };

  const handleCloseApprovalDialog = () => {
    setOpenApprovalDialog(false);
    setSelectedApproval(null);
  };

  const handleApproveStaff = () => {
    console.log('Approving staff:', selectedApproval);
    // TODO: Implement API call for staff approval
    setPendingApprovals(prev => prev.filter(item => item.id !== selectedApproval.id));
    // Update staff list or re-fetch
    alert(`${selectedApproval.type} for ${selectedApproval.userName} approved.`);
    handleCloseApprovalDialog();
  };

  const handleRejectStaff = () => {
    if (!rejectionReason.trim()) {
        alert('Please provide a reason for rejection.');
        return;
    }
    console.log('Rejecting staff:', selectedApproval, 'Reason:', rejectionReason);
    // TODO: Implement API call for staff rejection
    setPendingApprovals(prev => prev.filter(item => item.id !== selectedApproval.id));
    alert(`${selectedApproval.type} for ${selectedApproval.userName} rejected.`);
    handleCloseApprovalDialog();
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  if (!clinicDetails) {
    return <Alert severity="warning" sx={{ mt: 2 }}>Clinic details not found.</Alert>;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="medium">Clinic Overview</Typography>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}><strong>Address:</strong> {clinicDetails.address}</Typography>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}><strong>Phone:</strong> {clinicDetails.phone}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}><strong>Email:</strong> {clinicDetails.email}</Typography>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}><strong>Hours:</strong> {clinicDetails.operatingHours}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Staff Members
                    </Typography>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {staff.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active staff members at your clinic
                    </Typography>
                    <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                      Manage Staff
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Pending Approvals
                    </Typography>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {pendingApprovals.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Staff applications awaiting your approval
                    </Typography>
                    <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                      Review Approvals
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Today's Appointments
                    </Typography>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      14
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Scheduled appointments for today
                    </Typography>
                    <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                      View Schedule
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
        
      case 'staff':
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="medium">Staff Management</Typography>
              <Button variant="contained">Add New Staff</Button>
            </Box>
            
            <Card>
              <CardContent>
                <List sx={{ 
                  '& .MuiListItem-root': { 
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    py: 1.5
                  },
                  '& .MuiListItem-root:last-child': {
                    borderBottom: 'none'
                  }
                }}>
                  {staff.map((member) => (
                    <ListItem key={member.id}>
                      <ListItemText 
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            {member.name} 
                            <Typography component="span" color="primary.main" sx={{ ml: 1, fontWeight: 'medium' }}>
                              ({member.role})
                            </Typography>
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2">
                              <strong>Email:</strong> {member.email}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Status:</strong> {member.status}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box>
                        <Button size="small" variant="outlined" sx={{ mr: 1 }}>Edit</Button>
                        <Button size="small" variant="outlined" color="error">Remove</Button>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        );
        
      case 'approvals':
        return (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="medium">Pending Staff Approvals</Typography>
            <Card>
              <CardContent>
                {pendingApprovals.length === 0 ? (
                  <Typography>No pending staff approvals.</Typography>
                ) : (
                  <List sx={{ 
                    '& .MuiListItem-root': { 
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      py: 1.5,
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap'
                    },
                    '& .MuiListItem-root:last-child': {
                      borderBottom: 'none'
                    }
                  }}>
                    {pendingApprovals.map((approval) => (
                      <ListItem key={approval.id}>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              {approval.type}: {approval.userName}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="body2">
                                <strong>Submitted:</strong> {approval.date}
                              </Typography>
                            </Box>
                          }
                          sx={{ mr: 2 }}
                        />
                        <Box sx={{ mt: { xs: 1, sm: 0 } }}>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            size="small" 
                            onClick={() => handleOpenApprovalDialog(approval)}
                          >
                            Review
                          </Button>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Box>
        );
        
      case 'settings':
        return (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="medium">Clinic Settings</Typography>
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Clinic Information</Typography>
                    <TextField
                      label="Clinic Name"
                      defaultValue={clinicDetails.name}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                    />
                    <TextField
                      label="Address"
                      defaultValue={clinicDetails.address}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      multiline
                      rows={2}
                    />
                    <TextField
                      label="Phone Number"
                      defaultValue={clinicDetails.phone}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                    />
                    <TextField
                      label="Email"
                      defaultValue={clinicDetails.email}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Operating Hours</Typography>
                    <TextField
                      label="Operating Hours"
                      defaultValue={clinicDetails.operatingHours}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      multiline
                      rows={4}
                    />
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Services Offered</Typography>
                    <TextField
                      label="Services"
                      defaultValue="General Dentistry, Cosmetic Dentistry, Orthodontics"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      multiline
                      rows={2}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button variant="contained" color="primary">
                        Save Changes
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );
        
      case 'messages':
        return (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="medium">Messages</Typography>
            <Card>
              <CardContent>
                <MessagePanel userId={currentUser?.uid || 'clinicAdminUser'} />
              </CardContent>
            </Card>
          </Box>
        );
        
      default:
        return (
          <Alert severity="info">
            Please select a section from the sidebar.
          </Alert>
        );
    }
  };

  return (
    <Box sx={{ 
      pt: 2,
      height: '100%',
    }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          {clinicDetails.name} - Administration
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your clinic's staff and settings
        </Typography>
      </Box>
      
      {renderContent()}

      {/* Staff Approval Dialog */}
      <Dialog open={openApprovalDialog} onClose={handleCloseApprovalDialog}>
        <DialogTitle>Review Staff Signup Request</DialogTitle>
        <DialogContent>
          {selectedApproval && (
            <>
              <DialogContentText>
                <strong>Type:</strong> {selectedApproval.type}<br />
                <strong>User:</strong> {selectedApproval.userName}<br />
                <strong>Submitted:</strong> {selectedApproval.date}
              </DialogContentText>
              <TextField 
                autoFocus
                margin="dense"
                id="rejectionReasonStaff"
                label="Reason for Rejection (if any)"
                type="text"
                fullWidth
                variant="standard"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApprovalDialog} color="secondary">Cancel</Button>
          <Button onClick={handleRejectStaff} color="error" disabled={!selectedApproval}>Reject</Button>
          <Button onClick={handleApproveStaff} color="primary" variant="contained" disabled={!selectedApproval}>Approve</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Expose navigationSections for the MultiRoleDashboardLayout
ClinicAdminDashboard.navigationSections = navigationSections;

export default ClinicAdminDashboard;