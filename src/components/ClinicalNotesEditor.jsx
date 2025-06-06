import React, {useState, useEffect} from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Alert,
  LinearProgress,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  AutoAwesome as AutoAwesomeIcon,
  History as HistoryIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const ClinicalNotesEditor = ({
                               patientId,
                               appointmentId,
                               onSave,
                               initialNotes = '',
                               patientHistory = []
                             }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [notes, setNotes] = useState(initialNotes);
  const [isRecording, setIsRecording] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [savedNotes, setSavedNotes] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (notes !== initialNotes && notes.trim()) {
        handleAutoSave();
      }
    }, 3000);

    return () => clearTimeout(autoSaveTimer);
  }, [notes, initialNotes]);

  const handleAutoSave = async () => {
    setAutoSaveStatus('saving');
    try {
      // Simulate auto-save API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAutoSaveStatus('saved');
    } catch (error) {
      setAutoSaveStatus('error');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // Simulate voice-to-text conversion
      setTimeout(() => {
        const voiceText = "\n\nPatient reports mild discomfort in upper left molar. No visible swelling observed.";
        setNotes(prev => prev + voiceText);
      }, 1000);
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  const generateAISuggestions = async (type) => {
    setAiLoading(true);
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const suggestions = {
        'follow-up': [
          "Schedule follow-up appointment in 2 weeks to monitor healing progress",
          "Patient should avoid hard foods for 24-48 hours",
          "Recommend warm salt water rinses 2-3 times daily",
          "Contact clinic if pain persists or worsens"
        ],
        'diagnosis': [
          "Mild gingivitis observed in posterior regions",
          "Possible early-stage caries on tooth #14",
          "Recommend fluoride treatment",
          "Patient education on proper brushing technique needed"
        ],
        'treatment': [
          "Performed routine prophylaxis and scaling",
          "Applied fluoride varnish to all surfaces",
          "Discussed oral hygiene improvements with patient",
          "No immediate treatment required"
        ]
      };

      setAiSuggestions(suggestions[type] || []);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const insertAISuggestion = (suggestion) => {
    setNotes(prev => prev + (prev ? '\n\n' : '') + suggestion);
    setAiSuggestions([]);
  };

  const handleSave = async () => {
    try {
      const noteData = {
        patientId,
        appointmentId,
        content: notes,
        timestamp: new Date(),
        type: 'clinical_note'
      };

      if (onSave) {
        await onSave(noteData);
      }

      setSavedNotes(prev => [noteData, ...prev]);
      setAutoSaveStatus('saved');
    } catch (error) {
      console.error('Error saving notes:', error);
      setAutoSaveStatus('error');
    }
  };

  const renderNotesTab = () => (
      <Box sx={{p: 2}}>
        <Box sx={{display: 'flex', alignItems: 'center', mb: 2, gap: 1}}>
          <Typography variant="h6" sx={{flexGrow: 1}}>
            Clinical Notes
          </Typography>

          <Chip
              label={autoSaveStatus === 'saving' ? 'Saving...' : 'Auto-saved'}
              color={autoSaveStatus === 'error' ? 'error' : 'success'}
              size="small"
              variant="outlined"
          />

          <Tooltip title={isRecording ? 'Stop recording' : 'Start voice recording'}>
            <IconButton
                onClick={handleVoiceRecording}
                color={isRecording ? 'error' : 'default'}
            >
              {isRecording ? <MicOffIcon/> : <MicIcon/>}
            </IconButton>
          </Tooltip>

          <Tooltip title="View note history">
            <IconButton onClick={() => setShowHistory(true)}>
              <HistoryIcon/>
            </IconButton>
          </Tooltip>
        </Box>

        {isRecording && (
            <Alert severity="info" sx={{mb: 2}}>
              Recording... Speak clearly for voice-to-text conversion.
            </Alert>
        )}

        <TextField
            fullWidth
            multiline
            rows={12}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter clinical observations, diagnosis, treatment performed, and recommendations..."
            variant="outlined"
            sx={{mb: 2}}
        />

        <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-end'}}>
          <Button
              variant="contained"
              startIcon={<SaveIcon/>}
              onClick={handleSave}
          >
            Save Notes
          </Button>
        </Box>
      </Box>
  );

  const renderAIAssistTab = () => (
      <Box sx={{p: 2}}>
        <Typography variant="h6" gutterBottom>
          AI Writing Assistant
        </Typography>

        <Grid container spacing={2} sx={{mb: 3}}>
          <Grid size={{ xs: 12, sm: 4 }} sm={4}>
            <Button
                fullWidth
                variant="outlined"
                startIcon={<AutoAwesomeIcon/>}
                onClick={() => generateAISuggestions('diagnosis')}
                disabled={aiLoading}
            >
              Generate Diagnosis
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
                fullWidth
                variant="outlined"
                startIcon={<AutoAwesomeIcon/>}
                onClick={() => generateAISuggestions('treatment')}
                disabled={aiLoading}
            >
              Treatment Summary
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
                fullWidth
                variant="outlined"
                startIcon={<AutoAwesomeIcon/>}
                onClick={() => generateAISuggestions('follow-up')}
                disabled={aiLoading}
            >
              Follow-up Instructions
            </Button>
          </Grid>
        </Grid>

        {aiLoading && (
            <Box sx={{mb: 2}}>
              <LinearProgress/>
              <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                AI is generating suggestions...
              </Typography>
            </Box>
        )}

        {aiSuggestions.length > 0 && (
            <Card sx={{mb: 2}}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  AI Suggestions
                </Typography>
                <Alert severity="info" sx={{mb: 2}}>
                  Click on any suggestion to add it to your notes. Review and edit as needed.
                </Alert>
                {aiSuggestions.map((suggestion, index) => (
                    <Box key={index} sx={{mb: 1}}>
                      <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                          onClick={() => insertAISuggestion(suggestion)}
                      >
                        <Typography variant="body2">{suggestion}</Typography>
                      </Paper>
                    </Box>
                ))}
              </CardContent>
            </Card>
        )}

        <Alert severity="warning">
          <Typography variant="body2">
            <strong>Important:</strong> AI suggestions are advisory only. Always review and verify
            all content before saving to patient records. Final clinical decisions remain with the healthcare provider.
          </Typography>
        </Alert>
      </Box>
  );

  const renderPatientHistoryTab = () => (
      <Box sx={{p: 2}}>
        <Typography variant="h6" gutterBottom>
          Patient History Summary
        </Typography>

        {patientHistory.length === 0 ? (
            <Alert severity="info">
              No previous clinical notes found for this patient.
            </Alert>
        ) : (
            <List>
              {patientHistory.map((record, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                          <Typography variant="subtitle2">
                            {record.date}
                          </Typography>
                          <Chip label={record.type} size="small"/>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                          {record.summary}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < patientHistory.length - 1 && <Divider/>}
                  </React.Fragment>
              ))}
            </List>
        )}
      </Box>
  );

  return (
      <>
        <Paper elevation={1} sx={{width: '100%'}}>
          <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{borderBottom: '1px solid', borderColor: 'divider'}}
          >
            <Tab label="Clinical Notes"/>
            <Tab label="AI Assist"/>
            <Tab label="Patient History"/>
          </Tabs>

          {activeTab === 0 && renderNotesTab()}
          {activeTab === 1 && renderAIAssistTab()}
          {activeTab === 2 && renderPatientHistoryTab()}
        </Paper>

        {/* Note History Dialog */}
        <Dialog
            open={showHistory}
            onClose={() => setShowHistory(false)}
            maxWidth="md"
            fullWidth
        >
          <DialogTitle>Note History</DialogTitle>
          <DialogContent>
            {savedNotes.length === 0 ? (
                <Typography>No saved notes found.</Typography>
            ) : (
                <List>
                  {savedNotes.map((note, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                            primary={`Saved on ${note.timestamp.toLocaleString()}`}
                            secondary={note.content.substring(0, 100) + '...'}
                        />
                        <IconButton size="small">
                          <EditIcon/>
                        </IconButton>
                      </ListItem>
                  ))}
                </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowHistory(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </>
  );
};

export default ClinicalNotesEditor;
