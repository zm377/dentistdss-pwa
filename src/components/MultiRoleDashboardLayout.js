import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  CssBaseline,
  useMediaQuery,
  AppBar,
  Typography,
  Divider,
  Collapse,
  Avatar,
  Menu,
  MenuItem,
  Container,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  CardActions,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MessageIcon from '@mui/icons-material/Message';
import EventIcon from '@mui/icons-material/Event';
import NotesIcon from '@mui/icons-material/Notes';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../context/AuthContext';
import MessagePanel from './MessagePanel';
import api from '../services'; // central API aggregator

const drawerWidth = 240;

const roleMeta = {
  DASHBOARD: { label: 'Dashboard', icon: <DashboardIcon /> },
  USERS: { label: 'Users', icon: <PeopleIcon /> },
  ANALYTICS: { label: 'Analytics', icon: <BarChartIcon /> },
  ORDERS: { label: 'Orders', icon: <ShoppingCartIcon /> },
  MESSAGES: { label: 'Messages', icon: <MessageIcon /> },
  SETTINGS: { label: 'Settings', icon: <SettingsIcon /> },
  PATIENT: { label: 'Patient', icon: <PersonIcon /> },
  DENTIST: { label: 'Dentist', icon: <MedicalServicesIcon /> },
  CLINIC_ADMIN: { label: 'Clinic Admin', icon: <AdminPanelSettingsIcon /> },
  RECEPTIONIST: { label: 'Receptionist', icon: <SupportAgentIcon /> },
  SYSTEM_ADMIN: { label: 'System Admin', icon: <AdminPanelSettingsIcon /> },
};

const RenderMessageSection = ({ userId }) => (
  <Box>
    <Card sx={{ width: '100%' }}><CardContent><MessagePanel userId={userId} /></CardContent></Card>
  </Box>
);

const commonListStyles = {
  '& .MuiListItem-root': {
    borderBottom: '1px solid',
    borderColor: 'divider',
    py: 1.5
  },
  '& .MuiListItem-root:last-child': {
    borderBottom: 'none'
  }
};

const GenericListCard = ({ items, renderItem, emptyMessage = "No items found.", listSx }) => (
  <Card sx={{ width: '100%' }}>
    <CardContent>
      {items.length === 0 ? (
        <Typography sx={{ textAlign: 'center', py: 2 }}>{emptyMessage}</Typography>
      ) : (
        <List sx={{ ...commonListStyles, ...listSx }}>
          {items.map((item, index) => renderItem(item, index))}
        </List>
      )}
    </CardContent>
  </Card>
);

const GenericApprovalDialogComponent = ({
  open,
  onClose,
  selectedItem,
  rejectionReason,
  onRejectionReasonChange,
  onApprove,
  onReject,
  title,
  renderItemDetails,
}) => {
  if (!selectedItem) return null;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {renderItemDetails(selectedItem)}
        <TextField
          autoFocus
          margin="dense"
          id={`rejectionReason-${selectedItem.id}`}
          label="Reason for Rejection (if any)"
          type="text"
          fullWidth
          variant="standard"
          value={rejectionReason}
          onChange={onRejectionReasonChange}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={onReject} color="error" disabled={!selectedItem}>Reject</Button>
        <Button onClick={onApprove} color="primary" variant="contained" disabled={!selectedItem}>Approve</Button>
      </DialogActions>
    </Dialog>
  );
};

const patientNavigationSections = [
  { key: 'appointments', label: 'My Appointments', icon: <EventNoteIcon /> },
  { key: 'profile', label: 'My Profile', icon: <AccountCircleIcon /> },
  { key: 'messages', label: 'Messages', icon: <MessageIcon /> },
  { key: 'dental-records', label: 'Dental Records', icon: <HealthAndSafetyIcon /> },
];

const PatientDashboardContent = ({ activeSection = 'appointments' }) => {
  const [patientProfile, setPatientProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const patientIdForMessages = currentUser?.uid || 'mockPatientUserId';

  const fetchFromServer = async () => {
    try {
      const [profileResp, apptResp] = await Promise.all([
        api.patient?.getProfile?.() || Promise.resolve(null),
        api.appointment?.getPatientAppointments?.() || Promise.resolve([]),
      ]);
      setPatientProfile(profileResp || null);
      setAppointments(apptResp || []);
    } catch (err) {
      console.error('Failed to fetch patient data', err);
      setError('Failed to load your data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFromServer();
  }, [currentUser]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  if (!patientProfile) return <Alert severity="warning" sx={{ mt: 2 }}>Patient profile not found.</Alert>;

  const renderAppointmentItem = (appt) => (
    <ListItem key={appt.id}>
      <ListItemText
        primary={<Typography variant="h6" fontWeight="medium">{`${appt.type} with ${appt.dentist}`}</Typography>}
        secondary={
          <Box sx={{ mt: 1 }}>
            <Typography variant="body1"><strong>Clinic:</strong> {appt.clinic}</Typography>
            <Typography variant="body1"><strong>Date:</strong> {appt.date} | <strong>Time:</strong> {appt.time}</Typography>
            <Typography variant="body1"><strong>Status:</strong> {appt.status}</Typography>
          </Box>
        }
        sx={{ mr: 2 }}
      />
      <Button size="medium" variant="outlined" sx={{ minWidth: 120 }}>View Details</Button>
    </ListItem>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'appointments':
        return (
          <Box>
            <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
                  <Button component={RouterLink} to="/book-appointment" variant="contained" color="primary" size="large" sx={{ px: 3, py: 1 }}>
                    Book New Appointment
                  </Button>
                </Box>
                <GenericListCard items={appointments} renderItem={renderAppointmentItem} emptyMessage="You have no upcoming appointments." />
              </CardContent>
            </Card>
          </Box>
        );
      case 'profile':
        return (
          <Box>
            <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <CardContent sx={{ p: 3, pb: 1 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar src={patientProfile.avatarUrl} sx={{ width: 160, height: 160, mb: 2, border: '4px solid', borderColor: 'primary.light' }}>
                      {!patientProfile.avatarUrl && <AccountCircleIcon sx={{ fontSize: 100 }} />}
                    </Avatar>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Typography variant="h4" sx={{ mb: 2 }}>{patientProfile.name}</Typography>
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body1" component="div" sx={{ mb: 2, fontSize: '1.1rem' }}><strong>Email:</strong> {patientProfile.email}</Typography>
                          <Typography variant="body1" component="div" sx={{ mb: 2, fontSize: '1.1rem' }}><strong>Phone:</strong> {patientProfile.phone}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body1" component="div" sx={{ mb: 2, fontSize: '1.1rem' }}><strong>Date of Birth:</strong> {patientProfile.dateOfBirth}</Typography>
                          <Typography variant="body1" component="div" sx={{ mb: 2, fontSize: '1.1rem' }}><strong>Address:</strong> {patientProfile.address}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ px: 3, pb: 3 }}>
                <Button size="large" variant="contained" color="primary">Edit Profile</Button>
              </CardActions>
            </Card>
          </Box>
        );
      case 'messages':
        return <RenderMessageSection userId={patientIdForMessages} />;
      case 'dental-records':
        return (
          <Box>
            <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', mb: 3 }}>
                  Your dental records, including treatment history, X-rays, and notes from your dentist, will be accessible here.
                </Typography>
                <Alert severity="info" sx={{ mt: 2, p: 2 }}>
                  <Typography variant="body1">This feature is currently under development and will be available soon.</Typography>
                </Alert>
              </CardContent>
            </Card>
          </Box>
        );
      default:
        return <Alert severity="info">Please select a section from the sidebar.</Alert>;
    }
  };
  return <Box sx={{ pt: 2, height: '100%' }}>{renderContent()}</Box>;
};
PatientDashboardContent.navigationSections = patientNavigationSections;

const dentistNavigationSections = [
  { key: 'appointments', label: 'Appointments', icon: <EventIcon /> },
  { key: 'patient-records', label: 'Patient Records', icon: <NotesIcon /> },
  { key: 'profile', label: 'My Profile', icon: <PersonIcon /> },
  { key: 'messages', label: 'Messages', icon: <MessageIcon /> },
];

const mockDentistProfileData = {
  name: 'Dr. Jane Smith', specialty: 'General Dentistry, Cosmetic Dentistry', clinicName: 'Sunshine Dental Clinic',
  email: 'jane.smith@sunshinedental.com', phone: '555-0102', avatarUrl: '/static/images/avatar/2.jpg',
};
const mockDentistAppointmentsData = [
  { id: 'appt1', patientName: 'John Doe', time: '10:00 AM', date: '2024-07-30', type: 'Check-up', status: 'Confirmed' },
  { id: 'appt2', patientName: 'Alice Brown', time: '11:30 AM', date: '2024-07-30', type: 'Filling', status: 'Confirmed' },
  { id: 'appt3', patientName: 'Bob Green', time: '02:00 PM', date: '2024-07-30', type: 'Consultation', status: 'Pending' },
  { id: 'appt4', patientName: 'Carol White', time: '09:00 AM', date: '2024-07-31', type: 'Cleaning', status: 'Confirmed' },
];
const mockDentistPatientRecordsData = [
  { id: 'patient1', name: 'John Doe', lastVisit: '2024-01-15', notes: 'Regular check-up, no issues.' },
  { id: 'patient2', name: 'Alice Brown', lastVisit: '2024-03-22', notes: 'Filling on tooth #14.' },
];

const DentistDashboardContent = ({ activeSection = 'appointments' }) => {
  const [dentistProfile, setDentistProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth() || {};
  const dentistId = currentUser?.uid || 'dentistJane';

  useEffect(() => {
    setLoading(true); setError('');
    let profileFromAuth = null;
    if (currentUser) {
      profileFromAuth = {
        name: `${currentUser.title || ''} ${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name || currentUser.username || currentUser.email || 'User',
        specialty: currentUser.specialty || 'General Dentistry', clinicName: currentUser.clinicName || '',
        email: currentUser.email, phone: currentUser.phone || '', avatarUrl: currentUser.avatarUrl || currentUser.photoURL || currentUser.profilePicture || '',
      };
    }
    setTimeout(() => {
      setDentistProfile(profileFromAuth || mockDentistProfileData);
      setAppointments(mockDentistAppointmentsData);
      setPatientRecords(mockDentistPatientRecordsData);
      setLoading(false);
    }, 500);
  }, [dentistId, currentUser]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  if (!dentistProfile) return <Alert severity="warning" sx={{ mt: 2 }}>Dentist profile not found.</Alert>;

  const renderAppointmentItem = (appt) => (
    <ListItem key={appt.id}>
      <ListItemText
        primary={<Typography variant="subtitle1" fontWeight="medium">{`${appt.patientName} - ${appt.type}`}</Typography>}
        secondary={<Box sx={{ mt: 0.5 }}><Typography variant="body2"><strong>Date:</strong> {appt.date} | <strong>Time:</strong> {appt.time}</Typography></Box>}
      />
      <Chip label={appt.status} color={appt.status === 'Confirmed' ? 'success' : 'warning'} size="small" sx={{ ml: 1 }}/>
    </ListItem>
  );

  const renderPatientRecordItem = (patient) => (
    <ListItem key={patient.id} button onClick={() => alert(`Viewing record for ${patient.name}`)}>
      <ListItemText
        primary={<Typography variant="subtitle1" fontWeight="medium">{patient.name}</Typography>}
        secondary={
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="body2"><strong>Last Visit:</strong> {patient.lastVisit}</Typography>
            <Typography variant="body2"><strong>Notes:</strong> {patient.notes}</Typography>
          </Box>
        }
      />
    </ListItem>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'appointments':
        return <GenericListCard items={appointments} renderItem={renderAppointmentItem} emptyMessage="No upcoming appointments." />;
      case 'patient-records':
        return <GenericListCard items={patientRecords} renderItem={renderPatientRecordItem} emptyMessage="No patient records found." listSx={{ '& .MuiListItem-root:hover': { backgroundColor: 'action.hover' } }} />;
      case 'profile':
        return (
          <Box>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, mb: 3 }}>
                  <Avatar src={dentistProfile.avatarUrl} sx={{ width: 100, height: 100, mr: { sm: 3 }, mb: { xs: 2, sm: 0 } }}>
                    {!dentistProfile.avatarUrl && <PersonIcon sx={{ fontSize: 60 }} />}
                  </Avatar>
                  <Box>
                    <Typography variant="h5">{dentistProfile.name}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">{dentistProfile.specialty}</Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" component="div" sx={{ mb: 1.5 }}><strong>Email:</strong> {dentistProfile.email}</Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1.5 }}><strong>Phone:</strong> {dentistProfile.phone}</Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1.5 }}><strong>Clinic:</strong> {dentistProfile.clinicName}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      case 'messages':
        return <RenderMessageSection userId={dentistId} />;
      default:
        return <Alert severity="info">Please select a section from the sidebar.</Alert>;
    }
  };
  return <Box sx={{ pt: 2, height: '100%' }}>{renderContent()}</Box>;
};
DentistDashboardContent.navigationSections = dentistNavigationSections;

const clinicAdminNavigationSections = [
  { key: 'overview', label: 'Overview', icon: <DashboardIcon /> }, { key: 'staff', label: 'Staff Management', icon: <PeopleIcon /> },
  { key: 'approvals', label: 'Pending Staff Approvals', icon: <PendingActionsIcon /> }, { key: 'settings', label: 'Clinic Settings', icon: <SettingsIcon /> },
  { key: 'messages', label: 'Messages', icon: <MessageIcon /> },
];

const ClinicAdminDashboardContent = ({ activeSection = 'overview' }) => {
  const [clinicDetails, setClinicDetails] = useState(null);
  const [staff, setStaff] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const clinicId = 'sunshinedental';
  const { currentUser } = useAuth() || {};
  const clinicAdminIdForMessages = currentUser?.uid || 'clinicAdminUser';

  useEffect(() => {
    const fetchClinicAdminData = async () => {
      setLoading(true); setError('');
      try {
        const [detailsResp, staffResp, approvalsResp] = await Promise.all([
          api.clinic?.getDetails?.(clinicId) || Promise.resolve(null),
          api.clinic?.getStaff?.(clinicId) || Promise.resolve([]),
          api.clinic?.getPendingStaffApprovals?.(clinicId) || Promise.resolve([]),
        ]);
        setClinicDetails(detailsResp);
        setStaff(staffResp);
        setPendingApprovals(approvalsResp);
      } catch (err) {
        console.error('Failed to fetch clinic admin data', err);
        setError('Failed to load clinic data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClinicAdminData();
  }, [clinicId]);

  const handleOpenApprovalDialog = (approval) => { setSelectedApproval(approval); setOpenApprovalDialog(true); setRejectionReason(''); };
  const handleCloseApprovalDialog = () => { setOpenApprovalDialog(false); setSelectedApproval(null); };
  const handleApproveStaff = () => {
    console.log('Approving staff:', selectedApproval);
    setPendingApprovals(prev => prev.filter(item => item.id !== selectedApproval.id));
    alert(`${selectedApproval.type} for ${selectedApproval.userName} approved.`);
    handleCloseApprovalDialog();
  };
  const handleRejectStaff = () => {
    if (!rejectionReason.trim()) { alert('Please provide a reason for rejection.'); return; }
    console.log('Rejecting staff:', selectedApproval, 'Reason:', rejectionReason);
    setPendingApprovals(prev => prev.filter(item => item.id !== selectedApproval.id));
    alert(`${selectedApproval.type} for ${selectedApproval.userName} rejected.`);
    handleCloseApprovalDialog();
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  if (!clinicDetails) return <Alert severity="warning" sx={{ mt: 2 }}>Clinic details not found.</Alert>;

  const renderStaffItem = (member) => (
    <ListItem key={member.id}>
      <ListItemText
        primary={<Typography variant="subtitle1" fontWeight="medium">{member.name} <Typography component="span" color="primary.main" sx={{ ml: 1, fontWeight: 'medium' }}>({member.role})</Typography></Typography>}
        secondary={<Box sx={{ mt: 0.5 }}><Typography variant="body2"><strong>Email:</strong> {member.email}</Typography><Typography variant="body2"><strong>Status:</strong> {member.status}</Typography></Box>} />
      <Box><Button size="small" variant="outlined" sx={{ mr: 1 }}>Edit</Button><Button size="small" variant="outlined" color="error">Remove</Button></Box>
    </ListItem>
  );

  const renderApprovalItem = (approval) => (
    <ListItem key={approval.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <ListItemText
        primary={<Typography variant="subtitle1" fontWeight="medium">{approval.type}: {approval.userName}</Typography>}
        secondary={<Box sx={{ mt: 0.5 }}><Typography variant="body2"><strong>Submitted:</strong> {approval.date}</Typography></Box>}
        sx={{ mr: 2 }} />
      <Box sx={{ mt: { xs: 1, sm: 0 } }}><Button variant="contained" color="primary" size="small" onClick={() => handleOpenApprovalDialog(approval)}>Review</Button></Box>
    </ListItem>
  );
  
  const approvalDialogDetailsRenderer = (item) => (
    <DialogContentText>
      <strong>Type:</strong> {item.type}<br />
      <strong>User:</strong> {item.userName}<br />
      <strong>Submitted:</strong> {item.date}
    </DialogContentText>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <Box>
            <Card sx={{ mb: 3 }}><CardContent><Grid container spacing={3}>
              <Grid item xs={12} md={6}><Typography variant="subtitle1" sx={{ mb: 1 }}><strong>Address:</strong> {clinicDetails.address}</Typography><Typography variant="subtitle1" sx={{ mb: 1 }}><strong>Phone:</strong> {clinicDetails.phone}</Typography></Grid>
              <Grid item xs={12} md={6}><Typography variant="subtitle1" sx={{ mb: 1 }}><strong>Email:</strong> {clinicDetails.email}</Typography><Typography variant="subtitle1" sx={{ mb: 1 }}><strong>Hours:</strong> {clinicDetails.operatingHours}</Typography></Grid>
            </Grid></CardContent></Card>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}><Card sx={{ height: '100%' }}><CardContent><Typography variant="h6" gutterBottom color="primary">Staff Members</Typography><Typography variant="h3" sx={{ mb: 1 }}>{staff.length}</Typography><Typography variant="body2" color="text.secondary">Active staff members at your clinic</Typography><Button variant="outlined" size="small" sx={{ mt: 2 }}>Manage Staff</Button></CardContent></Card></Grid>
              <Grid item xs={12} md={4}><Card sx={{ height: '100%' }}><CardContent><Typography variant="h6" gutterBottom color="primary">Pending Approvals</Typography><Typography variant="h3" sx={{ mb: 1 }}>{pendingApprovals.length}</Typography><Typography variant="body2" color="text.secondary">Staff applications awaiting your approval</Typography><Button variant="outlined" size="small" sx={{ mt: 2 }}>Review Approvals</Button></CardContent></Card></Grid>
              <Grid item xs={12} md={4}><Card sx={{ height: '100%' }}><CardContent><Typography variant="h6" gutterBottom color="primary">Today's Appointments</Typography><Typography variant="h3" sx={{ mb: 1 }}>14</Typography><Typography variant="body2" color="text.secondary">Scheduled appointments for today</Typography><Button variant="outlined" size="small" sx={{ mt: 2 }}>View Schedule</Button></CardContent></Card></Grid>
            </Grid>
          </Box>
        );
      case 'staff':
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}><Button variant="contained">Add New Staff</Button></Box>
            <GenericListCard items={staff} renderItem={renderStaffItem} emptyMessage="No staff members found." />
          </Box>
        );
      case 'approvals':
        return <GenericListCard items={pendingApprovals} renderItem={renderApprovalItem} emptyMessage="No pending staff approvals." />;
      case 'settings':
        return (
          <Box>
            <Card><CardContent><Grid container spacing={3}>
              <Grid item xs={12} md={6}><Typography variant="h6" gutterBottom>Clinic Information</Typography><TextField label="Clinic Name" defaultValue={clinicDetails.name} fullWidth margin="normal" variant="outlined"/><TextField label="Address" defaultValue={clinicDetails.address} fullWidth margin="normal" variant="outlined" multiline rows={2}/><TextField label="Phone Number" defaultValue={clinicDetails.phone} fullWidth margin="normal" variant="outlined"/><TextField label="Email" defaultValue={clinicDetails.email} fullWidth margin="normal" variant="outlined"/></Grid>
              <Grid item xs={12} md={6}><Typography variant="h6" gutterBottom>Operating Hours</Typography><TextField label="Operating Hours" defaultValue={clinicDetails.operatingHours} fullWidth margin="normal" variant="outlined" multiline rows={4}/><Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Services Offered</Typography><TextField label="Services" defaultValue="General Dentistry, Cosmetic Dentistry, Orthodontics" fullWidth margin="normal" variant="outlined" multiline rows={2}/></Grid>
              <Grid item xs={12}><Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}><Button variant="contained" color="primary">Save Changes</Button></Box></Grid>
            </Grid></CardContent></Card>
          </Box>
        );
      case 'messages':
        return <RenderMessageSection userId={clinicAdminIdForMessages} />;
      default:
        return <Alert severity="info">Please select a section from the sidebar.</Alert>;
    }
  };

  return (
    <Box sx={{ pt: 2, height: '100%' }}>
      {renderContent()}
      {selectedApproval && (
        <GenericApprovalDialogComponent
          open={openApprovalDialog}
          onClose={handleCloseApprovalDialog}
          selectedItem={selectedApproval}
          rejectionReason={rejectionReason}
          onRejectionReasonChange={(e) => setRejectionReason(e.target.value)}
          onApprove={handleApproveStaff}
          onReject={handleRejectStaff}
          title="Review Staff Signup Request"
          renderItemDetails={approvalDialogDetailsRenderer}
        />
      )}
    </Box>
  );
};
ClinicAdminDashboardContent.navigationSections = clinicAdminNavigationSections;

const receptionistNavigationSections = [
  { key: 'appointments', label: 'Appointments', icon: <EventAvailableIcon /> }, { key: 'patients', label: 'Patient Management', icon: <PeopleAltIcon /> },
  { key: 'communication', label: 'Communication Log', icon: <PhoneIcon /> }, { key: 'messages', label: 'Messages', icon: <MessageIcon /> },
];
const mockReceptionistClinicInfoData = { name: 'Sunshine Dental Clinic', todayDate: new Date().toLocaleDateString() };
const mockReceptionistAppointmentsData = [
  { id: 'appt1', patientName: 'John Doe', time: '10:00 AM', dentist: 'Dr. Smith', type: 'Check-up', status: 'Confirmed' },
  { id: 'appt2', patientName: 'Alice Brown', time: '11:30 AM', dentist: 'Dr. Smith', type: 'Filling', status: 'Confirmed' },
  { id: 'appt3', patientName: 'Bob Green', time: '02:00 PM', dentist: 'Dr. Grant', type: 'Consultation', status: 'Arrived' },
  { id: 'appt4', patientName: 'Carol White', time: '03:00 PM', dentist: 'Dr. Smith', type: 'Cleaning', status: 'Pending Confirmation' },
];
const mockReceptionistPatientsData = [
  { id: 'patient1', name: 'John Doe', phone: '555-1234', lastVisit: '2024-01-15', nextAppointment: '2024-07-30 10:00 AM' },
  { id: 'patient2', name: 'Alice Brown', phone: '555-5678', lastVisit: '2024-03-22', nextAppointment: '2024-07-30 11:30 AM' },
];

const ReceptionistDashboardContent = ({ activeSection = 'appointments' }) => {
  const [clinicInfo, setClinicInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth() || {};
  const clinicId = 'sunshinedental';
  const receptionistId = currentUser?.uid || 'receptionistUser';

  useEffect(() => {
    setLoading(true); setError('');
    setTimeout(() => {
      setClinicInfo(mockReceptionistClinicInfoData);
      setAppointments(mockReceptionistAppointmentsData);
      setPatients(mockReceptionistPatientsData);
      setLoading(false);
    }, 1000);
  }, [clinicId]);

  const handleSearchChange = (event) => setSearchTerm(event.target.value.toLowerCase());
  const filteredAppointments = appointments.filter(appt => appt.patientName.toLowerCase().includes(searchTerm) || appt.dentist.toLowerCase().includes(searchTerm));
  const filteredPatients = patients.filter(patient => patient.name.toLowerCase().includes(searchTerm) || patient.phone.includes(searchTerm));
  const getStatusColor = (status) => ({ 'Confirmed': 'success', 'Pending Confirmation': 'warning', 'Cancelled': 'error', 'Arrived': 'info' })[status] || 'default';

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  if (!clinicInfo) return <Alert severity="warning" sx={{ mt: 2 }}>Clinic information not available.</Alert>;

  const renderAppointmentItem = (appt) => (
    <ListItem key={appt.id}>
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}><Typography variant="body1" fontWeight="bold" sx={{ minWidth: 80 }}>{appt.time}</Typography></Box>
      <ListItemText
        primary={<Typography variant="subtitle1" fontWeight="medium">{appt.patientName}</Typography>}
        secondary={<Box sx={{ mt: 0.5 }}><Typography variant="body2"><strong>With:</strong> {appt.dentist} | <strong>Type:</strong> {appt.type}</Typography></Box>} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}><Chip label={appt.status} color={getStatusColor(appt.status)} size="small" sx={{ mr: 1 }}/><Button size="small" variant="outlined">Manage</Button></Box>
    </ListItem>
  );

  const renderPatientItem = (patient) => (
    <ListItem key={patient.id} button onClick={() => alert(`Viewing details for ${patient.name}`)}>
      <ListItemText
        primary={<Typography variant="subtitle1" fontWeight="medium">{patient.name}</Typography>}
        secondary={<Box sx={{ mt: 0.5 }}><Typography variant="body2"><strong>Phone:</strong> {patient.phone}</Typography><Typography variant="body2"><strong>Last Visit:</strong> {patient.lastVisit} | <strong>Next Appt:</strong> {patient.nextAppointment || 'None'}</Typography></Box>} />
      <Button size="small" variant="outlined">View Profile</Button>
    </ListItem>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'appointments':
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}><Button variant="contained">Schedule New Appointment</Button></Box>
            <TextField fullWidth placeholder="Search appointments..." variant="outlined" size="small" value={searchTerm} onChange={handleSearchChange} sx={{ mb: 3 }} InputProps={{startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),}}/>
            <GenericListCard items={filteredAppointments} renderItem={renderAppointmentItem} emptyMessage="No appointments matching your search or for today." />
          </Box>
        );
      case 'patients':
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}><Button variant="contained">Register New Patient</Button></Box>
            <TextField fullWidth placeholder="Search patients by name or phone..." variant="outlined" size="small" value={searchTerm} onChange={handleSearchChange} sx={{ mb: 3 }} InputProps={{startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),}}/>
            <GenericListCard items={filteredPatients} renderItem={renderPatientItem} emptyMessage="No patients matching your search." listSx={{ '& .MuiListItem-root:hover': { backgroundColor: 'action.hover' } }} />
          </Box>
        );
      case 'communication':
        return (
          <Box>
            <Card><CardContent><Alert severity="info">This feature allows you to log calls, emails, and direct communications with patients. It's currently being developed and will be available soon.</Alert><Box sx={{ mt: 3 }}><Typography variant="h6" gutterBottom>Planned Features</Typography><List><ListItem><ListItemText primary="Call Logging" secondary="Record incoming and outgoing calls with patients, including call details and action items"/></ListItem><ListItem><ListItemText primary="Email Tracking" secondary="Track email communications sent to patients for appointment confirmations and reminders"/></ListItem><ListItem><ListItemText primary="SMS Notifications" secondary="Log and manage text message notifications sent to patients"/></ListItem></List></Box></CardContent></Card>
          </Box>
        );
      case 'messages':
        return <RenderMessageSection userId={receptionistId} />;
      default:
        return <Alert severity="info">Please select a section from the sidebar.</Alert>;
    }
  };
  return <Box sx={{ pt: 2, height: '100%' }}>{renderContent()}</Box>;
};
ReceptionistDashboardContent.navigationSections = receptionistNavigationSections;

const systemAdminNavigationSections = [
  { key: 'approvals', label: 'Pending Approvals', icon: <PendingActionsIcon /> }, { key: 'users', label: 'User Management', icon: <PeopleIcon /> },
  { key: 'settings', label: 'System Settings', icon: <SettingsIcon /> }, { key: 'messages', label: 'Messages', icon: <MessageIcon /> },
];
const mockSystemAdminPendingApprovalsData = [
  { id: 'approval1', type: 'Clinic Administrator Signup', userName: 'Dr. Emily Carter', clinicName: 'New Health Clinic', date: new Date().toLocaleDateString() },
  { id: 'approval2', type: 'System Feature Request', userName: 'Tech Team', details: 'Request for new reporting module', date: new Date().toLocaleDateString() },
];
const mockSystemAdminSystemUsersData = [
  { id: 'user1', name: 'John Doe', role: 'PATIENT', email: 'john.doe@example.com', status: 'Active' },
  { id: 'user2', name: 'Jane Smith', role: 'DENTIST', email: 'jane.smith@example.com', clinic: 'Sunshine Dental', status: 'Active' },
  { id: 'user3', name: 'Alice Brown', role: 'CLINIC_ADMIN', email: 'alice.brown@example.com', clinic: 'Bright Smiles', status: 'Pending Approval' },
];

const SystemAdminDashboardContent = ({ activeSection = 'approvals' }) => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const { currentUser } = useAuth() || {};
  const systemAdminIdForMessages = currentUser?.uid || 'systemAdminUser';

  useEffect(() => {
    setLoading(true); setError('');
    setTimeout(() => {
      setPendingApprovals(mockSystemAdminPendingApprovalsData);
      setSystemUsers(mockSystemAdminSystemUsersData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleOpenDialog = (approval) => { setSelectedApproval(approval); setOpenDialog(true); setRejectionReason(''); };
  const handleCloseDialog = () => { setOpenDialog(false); setSelectedApproval(null); };
  const handleApprove = () => {
    console.log('Approving:', selectedApproval);
    setPendingApprovals(prev => prev.filter(item => item.id !== selectedApproval.id));
    alert(`${selectedApproval.type} for ${selectedApproval.userName} approved.`);
    handleCloseDialog();
  };
  const handleReject = () => {
    if (!rejectionReason.trim()) { alert('Please provide a reason for rejection.'); return; }
    console.log('Rejecting:', selectedApproval, 'Reason:', rejectionReason);
    setPendingApprovals(prev => prev.filter(item => item.id !== selectedApproval.id));
    alert(`${selectedApproval.type} for ${selectedApproval.userName} rejected.`);
    handleCloseDialog();
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  
  const approvalDialogDetailsRenderer = (item) => (
    <DialogContentText>
      <strong>Type:</strong> {item.type}<br />
      <strong>User:</strong> {item.userName}<br />
      {item.clinicName && <><strong>Clinic:</strong> {item.clinicName}<br /></>}
      {item.details && <><strong>Details:</strong> {item.details}<br /></>}
      <strong>Submitted:</strong> {item.date}
    </DialogContentText>
  );

  const renderApprovalItem = (approval) => (
     <ListItem key={approval.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <ListItemText
        primary={<Typography variant="subtitle1" fontWeight="medium">{`${approval.type}: ${approval.userName} ${approval.clinicName ? '('+approval.clinicName+')' : ''}`}</Typography>}
        secondary={<Box sx={{ mt: 0.5 }}><Typography variant="body2"><strong>Details:</strong> {approval.details || 'N/A'}</Typography><Typography variant="body2"><strong>Submitted:</strong> {approval.date}</Typography></Box>}
        sx={{ mr: 2 }} />
      <Box sx={{ mt: { xs: 1, sm: 0 } }}><Button variant="contained" color="primary" size="small" onClick={() => handleOpenDialog(approval)}>Review</Button></Box>
    </ListItem>
  );

  const renderUserItem = (user) => (
    <ListItem key={user.id}>
      <ListItemText
        primary={<Typography variant="subtitle1" fontWeight="medium">{user.name} <Typography component="span" color="primary.main" sx={{ ml: 1, fontWeight: 'medium' }}>({user.role})</Typography></Typography>}
        secondary={<Box sx={{ mt: 0.5 }}><Typography variant="body2"><strong>Email:</strong> {user.email}</Typography>{user.clinic && (<Typography variant="body2"><strong>Clinic:</strong> {user.clinic}</Typography>)}<Typography variant="body2"><strong>Status:</strong> {user.status}</Typography></Box>} />
      <Box><Button size="small" variant="outlined" sx={{ mr: 1 }}>Edit</Button><Button size="small" variant="outlined" color="error">Disable</Button></Box>
    </ListItem>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'approvals':
        return <GenericListCard items={pendingApprovals} renderItem={renderApprovalItem} emptyMessage="No pending approvals." />;
      case 'users':
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 3 }}><Button variant="contained" color="primary">Add New User</Button></Box>
            <GenericListCard items={systemUsers} renderItem={renderUserItem} emptyMessage="No system users found." />
          </Box>
        );
      case 'settings':
        return (
          <Box>
            <Card><CardContent><Typography sx={{ mb: 2 }}>System configuration options. Configure API keys, feature flags, and general settings.</Typography><Grid container spacing={3}>
              <Grid item xs={12} md={6}><Card variant="outlined" sx={{ height: '100%' }}><CardContent><Typography variant="h6" gutterBottom>General Settings</Typography><List dense><ListItem><ListItemText primary="Maintenance Mode" secondary="Enable/disable system maintenance mode"/><Button size="small" variant="outlined">Configure</Button></ListItem><ListItem><ListItemText primary="System Notifications" secondary="Configure global notification settings"/><Button size="small" variant="outlined">Configure</Button></ListItem></List></CardContent></Card></Grid>
              <Grid item xs={12} md={6}><Card variant="outlined" sx={{ height: '100%' }}><CardContent><Typography variant="h6" gutterBottom>API Settings</Typography><List dense><ListItem><ListItemText primary="API Keys" secondary="Manage third-party API integrations"/><Button size="small" variant="outlined">Manage</Button></ListItem><ListItem><ListItemText primary="Webhooks" secondary="Configure webhooks for external services"/><Button size="small" variant="outlined">Configure</Button></ListItem></List></CardContent></Card></Grid>
            </Grid></CardContent></Card>
          </Box>
        );
      case 'messages':
        return <RenderMessageSection userId={systemAdminIdForMessages} />;
      default:
        return <Alert severity="info">Please select a section from the sidebar.</Alert>;
    }
  };

  return (
    <Box sx={{ pt: 2, height: '100%' }}>
      {renderContent()}
      {selectedApproval && (
        <GenericApprovalDialogComponent
          open={openDialog}
          onClose={handleCloseDialog}
          selectedItem={selectedApproval}
          rejectionReason={rejectionReason}
          onRejectionReasonChange={(e) => setRejectionReason(e.target.value)}
          onApprove={handleApprove}
          onReject={handleReject}
          title="Review Approval Request"
          renderItemDetails={approvalDialogDetailsRenderer}
        />
      )}
    </Box>
  );
};
SystemAdminDashboardContent.navigationSections = systemAdminNavigationSections;

const MultiRoleDashboardLayout = ({ rolesWithComponents: rolesWithComponentsProp = null, roles: rolesProp = null }) => {
  const roleComponentsMap = {
    PATIENT: PatientDashboardContent,
    DENTIST: DentistDashboardContent,
    CLINIC_ADMIN: ClinicAdminDashboardContent,
    RECEPTIONIST: ReceptionistDashboardContent,
    SYSTEM_ADMIN: SystemAdminDashboardContent,
  };

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

  const { currentUser } = useAuth();

  let rolesWithComponents = Array.isArray(rolesWithComponentsProp) && rolesWithComponentsProp.length > 0
    ? rolesWithComponentsProp : [];

  if (rolesWithComponents.length === 0 && Array.isArray(rolesProp) && rolesProp.length > 0) {
    rolesWithComponents = rolesProp
      .filter((key) => roleComponentsMap[key])
      .map((key) => ({ key, component: roleComponentsMap[key] }));
  }

  if (rolesWithComponents.length === 0) {
    const userRoles = Array.isArray(currentUser?.roles)
      ? currentUser.roles
      : currentUser?.role ? [currentUser.role] : [];
    rolesWithComponents = userRoles
      .filter((key) => roleComponentsMap[key])
      .map((key) => ({ key, component: roleComponentsMap[key] }));
  }

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  
  const firstValidRoleKey = rolesWithComponents[0]?.key || null;
  const [activeRoleKey, setActiveRoleKey] = useState(
    rolesWithComponents.some(r => r.key === firstValidRoleKey) ? firstValidRoleKey : null
  );
  
  useEffect(() => {
    if (rolesWithComponents.length > 0 && !rolesWithComponents.some(r => r.key === activeRoleKey)) {
      setActiveRoleKey(rolesWithComponents[0]?.key);
    } else if (rolesWithComponents.length === 0) {
      setActiveRoleKey(null);
    }
  }, [rolesWithComponents, activeRoleKey]);

  const [activeSectionKey, setActiveSectionKey] = useState('overview');

  useEffect(() => {
    const currentRoleComponent = rolesWithComponents.find(r => r.key === activeRoleKey)?.component;
    const currentSections = currentRoleComponent?.navigationSections || [{ key: 'overview' }];
    if (!currentSections.some(s => s.key === activeSectionKey)) {
      setActiveSectionKey(currentSections[0]?.key || 'overview');
    }
  }, [activeRoleKey, activeSectionKey, rolesWithComponents]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleUserMenuOpen = (event) => setUserMenuAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchorEl(null);

  const activeRoleWithComponent = rolesWithComponents.find(r => r.key === activeRoleKey) || null;
  const ActiveComponent = activeRoleWithComponent?.component || null;
  
  const activeRoleSections = ActiveComponent?.navigationSections || [
    { key: 'overview', label: 'Overview', icon: <DashboardIcon /> }
  ];

  const getDisplayName = (user) => {
    if (!user) return 'Guest';
    if (user.firstName || user.lastName) return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    if (user.name) return user.name;
    if (user.username) return user.username;
    return user.email || 'User';
  };

  const getInitials = (user) => {
    if (!user) return '?';
    const first = user.firstName || user.name?.split(' ')[0] || '';
    const last = user.lastName || user.name?.split(' ')[1] || '';
    if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
    if (first) return first[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return '?';
  };

  const avatarSrc = currentUser?.avatarUrl || currentUser?.photoURL || currentUser?.profilePicture || '';
  const displayName = getDisplayName(currentUser);
  const displayInitials = getInitials(currentUser);

  const drawerContent = (
    <div>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing(0, 2), ...theme.mixins.toolbar, backgroundColor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Brightness4Icon sx={{ mr: 1.5, fontSize: '1.5rem' }} />
          <Typography variant="h6" noWrap component="div">Dentabot</Typography>
        </Box>
        {!isSmUp && (<IconButton edge="end" color="inherit" onClick={handleDrawerToggle} sx={{ ml: 1 }}><ChevronLeftIcon /></IconButton>)}
      </Toolbar>
      <Divider />
      
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar src={avatarSrc} sx={{ width: 40, height: 40, mr: 2, bgcolor: !avatarSrc ? 'primary.main' : 'transparent', color: !avatarSrc ? 'primary.contrastText' : 'inherit' }}>
          {!avatarSrc && displayInitials}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>{displayName}</Typography>
          <Typography variant="body2" color="text.secondary">{roleMeta[activeRoleKey]?.label || activeRoleKey}</Typography>
        </Box>
      </Box>
      <Divider />

      {rolesWithComponents.length > 1 && (
        <>
          <Typography variant="overline" sx={{ pl: 3, pt: 2, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}>My Roles</Typography>
          <List component="nav" sx={{ px: 1 }}>
            {rolesWithComponents.map(({ key }) => (
              <ListItem key={key} disablePadding>
                <ListItemButton
                  selected={key === activeRoleKey}
                  onClick={() => {
                    setActiveRoleKey(key);
                    if (!isSmUp) setMobileOpen(false);
                  }}
                  sx={{ borderRadius: 1, py: 1, '&.Mui-selected': { backgroundColor: 'primary.main', color: 'primary.contrastText', '&:hover': { backgroundColor: 'primary.dark' } }, '&:hover': { backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)' }, my: 0.5 }}
                >
                  <ListItemIcon sx={{ color: activeRoleKey === key ? 'inherit' : 'text.secondary', minWidth: '36px' }}>{roleMeta[key]?.icon}</ListItemIcon>
                  <ListItemText primary={roleMeta[key]?.label || key} primaryTypographyProps={{ fontWeight: activeRoleKey === key ? 'bold' : 'regular', fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ mt: 1 }} />
        </>
      )}

      <Typography variant="overline" sx={{ pl: 3, pt: 2, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}>{roleMeta[activeRoleKey]?.label || 'Dashboard'}</Typography>
      <List component="nav" sx={{ px: 1 }}>
        {activeRoleSections.map((section) => (
          <ListItem key={section.key} disablePadding>
            <ListItemButton
              selected={section.key === activeSectionKey}
              onClick={() => {
                setActiveSectionKey(section.key);
                if (!isSmUp) setMobileOpen(false);
              }}
              sx={{ borderRadius: 1, py: 1, '&.Mui-selected': { backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.16)', '&:hover': { backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.24)'}}, '&:hover': { backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)'}, my: 0.5 }}
            >
              <ListItemIcon sx={{ color: section.key === activeSectionKey ? 'primary.main' : 'text.secondary', minWidth: '36px' }}>{section.icon}</ListItemIcon>
              <ListItemText primary={section.label} primaryTypographyProps={{ fontWeight: section.key === activeSectionKey ? 'medium' : 'regular', fontSize: '0.9rem' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton sx={{ py: 1.5 }} onClick={() => alert('Logout clicked')}>
              <ListItemIcon sx={{ minWidth: '36px' }}><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );

  const hasMultipleRoles = rolesWithComponents.length > 1;
  // const getContentMaxWidth = () => { // This function will be removed
  //   if (isLgUp) return '1280px'; if (isMdUp) return '960px'; return '100%';
  // };

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed" elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'background.paper', color: 'text.primary', borderBottom: '1px solid',
          borderColor: 'divider', zIndex: (theme) => theme.zIndex.drawer + (hasMultipleRoles && !isSmUp ? 1 : -1),
        }}
      >
        <Toolbar>
          {!isSmUp && (<IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}><MenuIcon /></IconButton>)}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {activeRoleSections.find(section => section.key === activeSectionKey)?.label || 'Dashboard'}
          </Typography>
          <IconButton color="inherit" onClick={handleUserMenuOpen} aria-controls="profile-menu" aria-haspopup="true"><AccountCircleIcon /></IconButton>
          <Menu
            id="profile-menu" anchorEl={userMenuAnchorEl} open={Boolean(userMenuAnchorEl)} onClose={handleUserMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleUserMenuClose}>Settings</MenuItem>
            <Divider />
            <MenuItem onClick={() => { handleUserMenuClose(); alert('Logout from menu clicked'); }}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="dashboard navigation">
        <Drawer
          variant={isSmUp ? 'permanent' : 'temporary'} open={isSmUp ? true : mobileOpen} onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#1A2027', color: theme.palette.mode === 'light' ? '#1A2027' : '#FFFFFF' } }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', overflow: 'auto', backgroundColor: theme.palette.mode === 'light' ? '#F4F6F8' : '#121212', p: { xs: 2, md: 3 } }}>
        <Toolbar />
        <Container maxWidth={false} sx={{ px: { xs: 1, sm: 2, md: 3 }}}>
          { ActiveComponent ? <ActiveComponent activeSection={activeSectionKey} /> : 
            (rolesWithComponents.length > 0 ? <Alert severity="warning">Dashboard content not available for {activeRoleKey}.</Alert> : <Alert severity="info">No roles available or selected.</Alert>)
          }
        </Container>
      </Box>
    </Box>
  );
};

MultiRoleDashboardLayout.propTypes = {
  rolesWithComponents: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string.isRequired, component: PropTypes.elementType.isRequired })),
  roles: PropTypes.arrayOf(PropTypes.string),
};

export default MultiRoleDashboardLayout; 