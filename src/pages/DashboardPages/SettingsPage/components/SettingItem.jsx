import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

/**
 * SettingItem - Individual setting display and edit component
 * 
 * Features:
 * - Inline editing capability
 * - Expandable description view
 * - Form validation
 * - Mobile-responsive design
 * - Accessibility support
 */
const SettingItem = memo(({
  setting,
  onSave,
  onCancel,
  isEditing,
  onEdit,
  errors = {},
  saving = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [editData, setEditData] = useState({
    key: setting.key || '',
    value: setting.value || '',
    description: setting.description || '',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Update edit data when setting changes or editing starts
  React.useEffect(() => {
    if (isEditing) {
      setEditData({
        key: setting.key || '',
        value: setting.value || '',
        description: setting.description || '',
      });
    }
  }, [isEditing, setting]);

  const handleFieldChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editData);
    }
  };

  const handleCancel = () => {
    setEditData({
      key: setting.key || '',
      value: setting.value || '',
      description: setting.description || '',
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(setting);
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Card 
      elevation={1} 
      sx={{ 
        mb: 2,
        '&:hover': {
          elevation: 2,
          boxShadow: theme.shadows[2],
        },
      }}
    >
      <CardContent>
        {isEditing ? (
          // Edit Mode
          <Box>
            <TextField
              label="Setting Key"
              value={editData.key}
              onChange={(e) => handleFieldChange('key', e.target.value)}
              error={Boolean(errors.key)}
              helperText={errors.key}
              fullWidth
              margin="normal"
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
              disabled={Boolean(setting.id)} // Disable key editing for existing settings
              aria-label="Setting key"
            />
            
            <TextField
              label="Setting Value"
              value={editData.value}
              onChange={(e) => handleFieldChange('value', e.target.value)}
              error={Boolean(errors.value)}
              helperText={errors.value}
              fullWidth
              margin="normal"
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
              multiline
              rows={2}
              aria-label="Setting value"
            />
            
            <TextField
              label="Description"
              value={editData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              error={Boolean(errors.description)}
              helperText={errors.description}
              fullWidth
              margin="normal"
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
              multiline
              rows={3}
              aria-label="Setting description"
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={saving}
                size={isMobile ? 'small' : 'medium'}
                aria-label="Cancel editing"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                size={isMobile ? 'small' : 'medium'}
                aria-label="Save setting"
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Box>
        ) : (
          // View Mode
          <Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 1 : 0,
            }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip 
                    label={setting.key} 
                    variant="outlined" 
                    size="small"
                    color="primary"
                    sx={{ fontFamily: 'monospace' }}
                  />
                </Box>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 1,
                    wordBreak: 'break-word',
                    fontWeight: 500,
                  }}
                >
                  {setting.value}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      display: expanded ? 'block' : '-webkit-box',
                      WebkitLineClamp: expanded ? 'none' : 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      flex: 1,
                    }}
                  >
                    {setting.description}
                  </Typography>
                  
                  {setting.description && setting.description.length > 100 && (
                    <IconButton
                      size="small"
                      onClick={toggleExpanded}
                      aria-label={expanded ? 'Show less' : 'Show more'}
                      sx={{ ml: 'auto' }}
                    >
                      {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  )}
                </Box>
              </Box>

              <IconButton
                onClick={handleEdit}
                size="small"
                color="primary"
                aria-label="Edit setting"
                sx={{ 
                  alignSelf: isMobile ? 'flex-end' : 'flex-start',
                  mt: isMobile ? -1 : 0,
                }}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
});

SettingItem.propTypes = {
  /** Setting object with id, key, value, description */
  setting: PropTypes.shape({
    id: PropTypes.number,
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  /** Callback when saving setting */
  onSave: PropTypes.func,
  /** Callback when canceling edit */
  onCancel: PropTypes.func,
  /** Whether this item is in edit mode */
  isEditing: PropTypes.bool,
  /** Callback when edit button is clicked */
  onEdit: PropTypes.func,
  /** Validation errors object */
  errors: PropTypes.object,
  /** Whether save operation is in progress */
  saving: PropTypes.bool,
};

SettingItem.displayName = 'SettingItem';

export default SettingItem;
