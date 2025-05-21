import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Card, CardContent, Grid } from '@mui/material';
import MessagePanel from './MessagePanel';
import { useAuth } from '../context/AuthContext';

// Icons
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import MessageIcon from '@mui/icons-material/Message';

// Define navigation sections for the sidebar
const navigationSections = [
  { key: 'approvals', label: 'Pending Approvals', icon: <PendingActionsIcon /> },
  { key: 'users', label: 'User Management', icon: <PeopleIcon /> },
  { key: 'settings', label: 'System Settings', icon: <SettingsIcon /> },
  { key: 'messages', label: 'Messages', icon: <MessageIcon /> },
];

// Mock data - replace with API calls
const mockPendingApprovals = [
  { id: 'approval1', type: 'Clinic Administrator Signup', userName: 'Dr. Emily Carter', clinicName: 'New Health Clinic', date: new Date().toLocaleDateString() },
  { id: 'approval2', type: 'System Feature Request', userName: 'Tech Team', details: 'Request for new reporting module', date: new Date().toLocaleDateString() },
];

const mockSystemUsers = [
  { id: 'user1', name: 'John Doe', role: 'PATIENT', email: 'john.doe@example.com', status: 'Active' },
  { id: 'user2', name: 'Jane Smith', role: 'DENTIST', email: 'jane.smith@example.com', clinic: 'Sunshine Dental', status: 'Active' },
  { id: 'user3', name: 'Alice Brown', role: 'CLINIC_ADMIN', email: 'alice.brown@example.com', clinic: 'Bright Smiles', status: 'Pending Approval' },
];

const SystemAdminDashboard = ({ activeSection = 'approvals' }) => {
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

  const renderContent = () => {
    switch (activeSection) {
      case 'approvals':
        return (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="medium">Pending Approvals</Typography>
            <Card>
              <CardContent>
                {pendingApprovals.length === 0 ? (
                  <Typography>No pending approvals.</Typography>
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
                              {`${approval.type}: ${approval.userName} ${approval.clinicName ? '('+approval.clinicName+')' : ''}`}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="body2">
                                <strong>Details:</strong> {approval.details || 'N/A'}
                              </Typography>
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
                            onClick={() => handleOpenDialog(approval)}
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
        
      case 'users':
        return (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="medium">User Management</Typography>
            <Card>
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Button variant="contained" color="primary">Add New User</Button>
                </Box>
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
                  {systemUsers.map((user) => (
                    <ListItem key={user.id}>
                      <ListItemText 
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            {user.name} 
                            <Typography component="span" color="primary.main" sx={{ ml: 1, fontWeight: 'medium' }}>
                              ({user.role})
                            </Typography>
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2">
                              <strong>Email:</strong> {user.email}
                            </Typography>
                            {user.clinic && (
                              <Typography variant="body2">
                                <strong>Clinic:</strong> {user.clinic}
                              </Typography>
                            )}
                            <Typography variant="body2">
                              <strong>Status:</strong> {user.status}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box>
                        <Button size="small" variant="outlined" sx={{ mr: 1 }}>Edit</Button>
                        <Button size="small" variant="outlined" color="error">Disable</Button>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        );
        
      case 'settings':
        return (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="medium">System Settings</Typography>
            <Card>
              <CardContent>
                <Typography sx={{ mb: 2 }}>
                  System configuration options. Configure API keys, feature flags, and general settings.
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>General Settings</Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText primary="Maintenance Mode" secondary="Enable/disable system maintenance mode" />
                            <Button size="small" variant="outlined">Configure</Button>
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="System Notifications" secondary="Configure global notification settings" />
                            <Button size="small" variant="outlined">Configure</Button>
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>API Settings</Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText primary="API Keys" secondary="Manage third-party API integrations" />
                            <Button size="small" variant="outlined">Manage</Button>
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Webhooks" secondary="Configure webhooks for external services" />
                            <Button size="small" variant="outlined">Configure</Button>
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
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
                <MessagePanel userId={currentUser?.uid || 'systemAdminUser'} />
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
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
          <AdminPanelSettingsIcon sx={{ mr: 1, fontSize: 32 }} />
          System Administrator
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage system-wide settings and user accounts
        </Typography>
      </Box>
      
      {renderContent()}

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
    </Box>
  );
};

// Expose navigationSections for the MultiRoleDashboardLayout
SystemAdminDashboard.navigationSections = navigationSections;

export default SystemAdminDashboard;