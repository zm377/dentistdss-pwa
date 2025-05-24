import React, { useState, useEffect } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider
} from '@mui/material';
import { Search as SearchIcon, LocationOn as LocationIcon, Directions as DirectionsIcon } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../services';
import { geocodeAddress } from '../utils/geocode';

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to handle map view updates and popup management
function ChangeMapView({ center, zoom, selectedClinic }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  useEffect(() => {
    // Close all popups when a new clinic is selected
    if (selectedClinic) {
      map.closePopup();
    }
  }, [selectedClinic, map]);

  return null;
}

// Utility to detect PWA and platform, and open maps
function openDirections({ latitude, longitude, name }) {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  let url = '';
  if (isStandalone) {
    // PWA installed
    if (isIOS) {
      url = `http://maps.apple.com/?ll=${latitude},${longitude}&q=${encodeURIComponent(name)}`;
    } else if (isAndroid) {
      url = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(name)})`;
    } else {
      // fallback to Google Maps
      url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    }
  } else {
    // Browser
    url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  }
  window.open(url, '_blank');
}

function FindAClinic() {
  const [searchKeywords, setSearchKeywords] = useState('');
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [mapCenter, setMapCenter] = useState([43.6532, -79.3832]); // Default to Toronto
  const [mapZoom, setMapZoom] = useState(11);
  const [debouncedSearchKeywords, setDebouncedSearchKeywords] = useState('');
  const [clinicsWithCoords, setClinicsWithCoords] = useState([]);
  const [geocoding, setGeocoding] = useState(false);
  const geocodeCache = React.useRef({});

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Debounce search keywords
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeywords(searchKeywords);
    }, 800); // 800ms delay

    return () => clearTimeout(timer);
  }, [searchKeywords]);

  // Auto-search when debounced keywords change
  useEffect(() => {
    if (debouncedSearchKeywords.trim()) {
      performSearch(debouncedSearchKeywords);
    } else if (debouncedSearchKeywords === '') {
      // Clear results when search is empty
      setClinics([]);
      setError('');
    }
  }, [debouncedSearchKeywords]);

  // When clinics change, geocode those without lat/lng
  useEffect(() => {
    let isMounted = true;
    async function geocodeClinics() {
      setGeocoding(true);
      const results = await Promise.all(clinics.map(async (clinic) => {
        if (clinic.latitude && clinic.longitude) {
          return clinic;
        }
        // Use cache if available
        const cacheKey = `${clinic.address},${clinic.city},${clinic.state},${clinic.zipCode},${clinic.country}`;
        if (geocodeCache.current[cacheKey]) {
          return { ...clinic, ...geocodeCache.current[cacheKey] };
        }
        // Geocode
        const coords = await geocodeAddress({
          address: clinic.address,
          city: clinic.city,
          state: clinic.state,
          zipCode: clinic.zipCode,
          country: clinic.country,
        });
        if (coords) {
          geocodeCache.current[cacheKey] = coords;
          return { ...clinic, ...coords };
        }
        return clinic; // If geocoding fails, return as is
      }));
      if (isMounted) setClinicsWithCoords(results);
      setGeocoding(false);
    }
    if (clinics.length > 0) {
      geocodeClinics();
    } else {
      setClinicsWithCoords([]);
    }
    return () => { isMounted = false; };
  }, [clinics]);

  useEffect(() => {
    if (clinicsWithCoords.length > 0) {
      const first = clinicsWithCoords.find(c => c.latitude && c.longitude);
      if (first) {
        setMapCenter([first.latitude, first.longitude]);
        setMapZoom(13);
      }
    }
  }, [clinicsWithCoords]);

  const performSearch = async (keywords) => {
    if (!keywords.trim()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.clinic.searchClinics(keywords);

      if (response && Array.isArray(response)) {
        setClinics(response);
      } else {
        setClinics([]);
        setError('No clinics found');
      }
    } catch (err) {
      setError('Error searching for clinics. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchKeywords.trim()) {
      setError('Please enter search keywords');
      return;
    }
    performSearch(searchKeywords);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClinicSelect = (clinic) => {
    setSelectedClinic(clinic);
    if (clinic.latitude && clinic.longitude) {
      setMapCenter([clinic.latitude, clinic.longitude]);
      setMapZoom(15);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Find a Dental Clinic
      </Typography>

      {/* Search Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Start typing to search clinics (auto-search enabled)..."
              value={searchKeywords}
              onChange={(e) => setSearchKeywords(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                endAdornment: loading && (
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              sx={{ minWidth: 120, height: 56 }}
            >
              Search
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Search happens automatically after you stop typing. Click "Search" to search immediately.
          </Typography>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Map Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ height: '600px', position: 'relative' }}>
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
            >
              <ChangeMapView center={mapCenter} zoom={mapZoom} selectedClinic={selectedClinic} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {(geocoding || loading) && (
                <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
                  <CircularProgress size={32} />
                </Box>
              )}
              {clinicsWithCoords.map((clinic, index) => (
                clinic.latitude && clinic.longitude ? (
                  <Marker
                    key={clinic.id || index}
                    position={[clinic.latitude, clinic.longitude]}
                    eventHandlers={{
                      click: () => handleClinicSelect(clinic),
                    }}
                  >
                    <Popup>
                      <Box sx={{ minWidth: 200 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {clinic.name}
                        </Typography>
                        {clinic.address && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <LocationIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                            {clinic.address}
                          </Typography>
                        )}
                        {clinic.phoneNumber && (
                          <Typography variant="body2">
                            Phone: {clinic.phoneNumber}
                          </Typography>
                        )}
                        {clinic.email && (
                          <Typography variant="body2">
                            Email: {clinic.email}
                          </Typography>
                        )}
                        {clinic.website && (
                          <Typography variant="body2">
                            Website: <a href={clinic.website} target="_blank" rel="noopener noreferrer">{clinic.website}</a>
                          </Typography>
                        )}
                        {clinic.latitude && clinic.longitude && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DirectionsIcon />}
                            sx={{ mt: 2 }}
                            onClick={() => openDirections({ latitude: clinic.latitude, longitude: clinic.longitude, name: clinic.name })}
                            fullWidth
                          >
                            Directions
                          </Button>
                        )}
                      </Box>
                    </Popup>
                  </Marker>
                ) : null
              ))}
            </MapContainer>
          </Paper>
        </Grid>

        {/* Results List Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ height: '600px', overflow: 'auto' }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Search Results ({clinics.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : clinics.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                  No clinics found. Try searching with different keywords.
                </Typography>
              ) : (
                <List sx={{ width: '100%' }}>
                  {clinicsWithCoords.map((clinic, index) => (
                    <Card 
                      key={clinic.id || index} 
                      sx={{ 
                        mb: 2, 
                        cursor: 'pointer',
                        bgcolor: selectedClinic?.id === clinic.id ? 'action.selected' : 'background.paper',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        }
                      }}
                      onClick={() => handleClinicSelect(clinic)}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {clinic.name}
                        </Typography>
                        {clinic.address && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            <LocationIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                            {clinic.address}
                          </Typography>
                        )}
                        {clinic.phoneNumber && (
                          <Typography variant="body2" color="text.secondary">
                            Phone: {clinic.phoneNumber}
                          </Typography>
                        )}
                        {clinic.email && (
                          <Typography variant="body2" color="text.secondary">
                            Email: {clinic.email}
                          </Typography>
                        )}
                        {clinic.website && (
                          <Typography variant="body2" color="text.secondary">
                            Website: <a href={clinic.website} target="_blank" rel="noopener noreferrer">{clinic.website}</a>
                          </Typography>
                        )}
                        {clinic.latitude && clinic.longitude && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DirectionsIcon />}
                            sx={{ mt: 2 }}
                            onClick={(event) => {
                              event.stopPropagation();
                              openDirections({ latitude: clinic.latitude, longitude: clinic.longitude, name: clinic.name });
                            }}
                            fullWidth
                          >
                            Directions
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </List>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default FindAClinic;