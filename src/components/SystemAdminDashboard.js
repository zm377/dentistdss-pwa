import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, CircularProgress, Alert, List, ListItem, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import MessagePanel from './MessagePanel'; // Import MessagePanel
import { useAuth } from '../context/AuthContext'; // Import useAuth

// Mock data - replace with API calls
const mockPendingApprovals = [
  { id: 'approval1', type: 'Clinic Administrator Signup', userName: 'Dr. Emily Carter', clinicName: 'New Health Clinic', date: new Date().toLocaleDateString() },
  { id: 'approval2', type: 'System Feature Request', userName: 'Tech Team', details: 'Request for new reporting module', date: new Date().toLocaleDateString() },
];

const mockSystemUsers = [
  { id: 'user1', name: 'John Doe', role: 'Patient', email: 'john.doe@example.com', status: 'Active' },
  { id: 'user2', name: 'Jane Smith', role: 'Dentist', email: 'jane.smith@example.com', clinic: 'Sunshine Dental', status: 'Active' },
  { id: 'user3', name: 'Alice Brown', role: 'Clinic Administrator', email: 'alice.brown@example.com', clinic: 'Bright Smiles', status: 'Pending Approval' },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
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

const SystemAdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const { currentUser } = useAuth() || {}; // Get currentUser

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setError('');
    setTimeout(() => {
      setPendingApprovals(mockPendingApprovals);
      setSystemUsers(mockSystemUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (approval) => {
    setSelectedApproval(approval);
    setOpenDialog(true);
    setRejectionReason(''); // Reset reason
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedApproval(null);
  };

  const handleApprove = () => {
    console.log('Approving:', selectedApproval);
    // TODO: Implement API call for approval
    setPendingApprovals(prev => prev.filter(item => item.id !== selectedApproval.id));
    // Potentially update user status in systemUsers list
    handleCloseDialog();
    alert(`${selectedApproval.type} for ${selectedApproval.userName} approved.`);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
        alert('Please provide a reason for rejection.');
        return;
    }
    console.log('Rejecting:', selectedApproval, 'Reason:', rejectionReason);
    // TODO: Implement API call for rejection
    setPendingApprovals(prev => prev.filter(item => item.id !== selectedApproval.id));
    handleCloseDialog();
    alert(`${selectedApproval.type} for ${selectedApproval.userName} rejected.`);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mt: 2 }}>
      <Typography variant="h4" gutterBottom component="h1">
        System Administrator Dashboard
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="System admin tabs">
          <Tab label="Pending Approvals" id="admin-tab-0" aria-controls="admin-tabpanel-0" />
          <Tab label="User Management" id="admin-tab-1" aria-controls="admin-tabpanel-1" />
          <Tab label="System Settings" id="admin-tab-2" aria-controls="admin-tabpanel-2" />
          <Tab label="Messages" id="admin-tab-3" aria-controls="admin-tabpanel-3" /> {/* New Messages Tab */}
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>Pending Approvals</Typography>
        {pendingApprovals.length === 0 ? (
          <Typography>No pending approvals.</Typography>
        ) : (
          <List>
            {pendingApprovals.map((approval) => (
              <ListItem key={approval.id} divider sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <ListItemText 
                  primary={`${approval.type}: ${approval.userName} ${approval.clinicName ? '('+approval.clinicName+')' : ''}`}
                  secondary={`Details: ${approval.details || 'N/A'} - Submitted: ${approval.date}`}
                />
                <Box sx={{ mt: { xs: 1, sm: 0 } }}>
                  <Button variant="contained" color="success" size="small" onClick={() => handleOpenDialog(approval)} sx={{ mr: 1 }}>
                    Review
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>User Management</Typography>
        <List>
          {systemUsers.map((user) => (
            <ListItem key={user.id} divider>
              <ListItemText 
                primary={`${user.name} (${user.role})`}
                secondary={`Email: ${user.email} - Clinic: ${user.clinic || 'N/A'} - Status: ${user.status}`}
              />
              {/* Add buttons for edit/delete/manage user roles */} 
            </ListItem>
          ))}
        </List>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>System Settings</Typography>
        <Typography>
          System configuration options will be available here. (e.g., API keys, feature flags, maintenance mode).
        </Typography>
        {/* Placeholder for system settings form or components */}
      </TabPanel>

      <TabPanel value={tabValue} index={3}> {/* New TabPanel for Messages */}
        <MessagePanel userId={currentUser?.uid || 'systemAdminUser'} />
      </TabPanel>

      {/* Approval Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Review Approval Request</DialogTitle>
        <DialogContent>
          {selectedApproval && (
            <>
              <DialogContentText>
                <strong>Type:</strong> {selectedApproval.type}<br />
                <strong>User:</strong> {selectedApproval.userName}<br />
                {selectedApproval.clinicName && <><strong>Clinic:</strong> {selectedApproval.clinicName}<br /></>}
                {selectedApproval.details && <><strong>Details:</strong> {selectedApproval.details}<br /></>}
                <strong>Submitted:</strong> {selectedApproval.date}
              </DialogContentText>
              <TextField 
                autoFocus
                margin="dense"
                id="rejectionReason"
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
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleReject} color="error" disabled={!selectedApproval}>Reject</Button>
          <Button onClick={handleApprove} color="primary" variant="contained" disabled={!selectedApproval}>Approve</Button>
        </DialogActions>
      </Dialog>

    </Paper>
  );
};

export default SystemAdminDashboard;