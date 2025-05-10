import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, CircularProgress, Alert, List, ListItem, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Grid } from '@mui/material';
import MessagePanel from './MessagePanel'; // Import MessagePanel
import { useAuth } from '../context/AuthContext'; // Import useAuth

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`clinic-admin-tabpanel-${index}`}
      aria-labelledby={`clinic-admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ClinicAdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mt: 2 }}>
      <Typography variant="h4" gutterBottom component="h1">
        {clinicDetails.name} - Admin Dashboard
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="Clinic admin tabs">
          <Tab label="Overview" id="clinic-admin-tab-0" aria-controls="clinic-admin-tabpanel-0" />
          <Tab label="Staff Management" id="clinic-admin-tab-1" aria-controls="clinic-admin-tabpanel-1" />
          <Tab label="Pending Staff Approvals" id="clinic-admin-tab-2" aria-controls="clinic-admin-tabpanel-2" />
          <Tab label="Clinic Settings" id="clinic-admin-tab-3" aria-controls="clinic-admin-tabpanel-3" />
          <Tab label="Messages" id="clinic-admin-tab-4" aria-controls="clinic-admin-tabpanel-4" /> {/* New Messages Tab */}
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>Clinic Overview</Typography>
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Typography variant="subtitle1"><strong>Address:</strong> {clinicDetails.address}</Typography>
                <Typography variant="subtitle1"><strong>Phone:</strong> {clinicDetails.phone}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="subtitle1"><strong>Email:</strong> {clinicDetails.email}</Typography>
                <Typography variant="subtitle1"><strong>Hours:</strong> {clinicDetails.operatingHours}</Typography>
            </Grid>
        </Grid>
        {/* Add more overview components like appointments summary, patient stats etc. */}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>Staff Management</Typography>
        <List>
          {staff.map((member) => (
            <ListItem key={member.id} divider>
              <ListItemText 
                primary={`${member.name} (${member.role})`}
                secondary={`Email: ${member.email} - Status: ${member.status}`}
              />
              {/* Add buttons for edit/remove staff, view schedule etc. */}
            </ListItem>
          ))}
        </List>
        <Button variant="contained" sx={{mt: 2}}>Add New Staff</Button> {/* This might link to a form or invite system */}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Pending Staff Approvals</Typography>
        {pendingApprovals.length === 0 ? (
          <Typography>No pending staff approvals.</Typography>
        ) : (
          <List>
            {pendingApprovals.map((approval) => (
              <ListItem key={approval.id} divider sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <ListItemText 
                  primary={`${approval.type}: ${approval.userName}`}
                  secondary={`Submitted: ${approval.date}`}
                />
                <Box sx={{ mt: { xs: 1, sm: 0 } }}>
                  <Button variant="contained" color="primary" size="small" onClick={() => handleOpenApprovalDialog(approval)} sx={{ mr: 1 }}>
                    Review
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>Clinic Settings</Typography>
        <Typography>
          Edit clinic information, operating hours, services offered, etc.
        </Typography>
        {/* Placeholder for clinic settings form */}
      </TabPanel>

      <TabPanel value={tabValue} index={4}> {/* New TabPanel for Messages */}
        <MessagePanel userId={currentUser?.uid || 'clinicAdminUser'} />
      </TabPanel>

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

    </Paper>
  );
};

export default ClinicAdminDashboard;