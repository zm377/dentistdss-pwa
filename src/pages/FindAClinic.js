import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import api from '../services';
import { geocodeAddress } from '../utils/geocode';
import config from '../config';

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
  const [mapCenter, setMapCenter] = useState({ lat: 43.6532, lng: -79.3832 }); // Default to Toronto
  const [mapZoom, setMapZoom] = useState(11);
  const [debouncedSearchKeywords, setDebouncedSearchKeywords] = useState('');
  const [clinicsWithCoords, setClinicsWithCoords] = useState([]);
  const [geocoding, setGeocoding] = useState(false);
  const geocodeCache = React.useRef({});
  const [map, setMap] = useState(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  // Google Maps container style
  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  };

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
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
      if (first && map) {
        setMapCenter({ lat: first.latitude, lng: first.longitude });
        setMapZoom(13);
      }
    }
  }, [clinicsWithCoords, map]);

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
    setInfoWindowOpen(false);
    if (clinic.latitude && clinic.longitude && map) {
      map.panTo({ lat: clinic.latitude, lng: clinic.longitude });
      setMapZoom(15);
    }
  };

  const handleMarkerClick = (clinic) => {
    setSelectedClinic(clinic);
    setInfoWindowOpen(true);
  };

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

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
              Search Now
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Search happens automatically after you stop typing. Click "Search Now" to search immediately.
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
            {(geocoding || loading) && (
              <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
                <CircularProgress size={32} />
              </Box>
            )}
            <LoadScript googleMapsApiKey={config.api.google.mapsApiKey}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={mapZoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                  disableDefaultUI: false,
                  zoomControl: true,
                  mapTypeControl: true,
                  scaleControl: true,
                  streetViewControl: true,
                  rotateControl: true,
                  fullscreenControl: true
                }}
              >
                {clinicsWithCoords.map((clinic, index) => (
                  clinic.latitude && clinic.longitude && (
                    <Marker
                      key={clinic.id || index}
                      position={{ lat: clinic.latitude, lng: clinic.longitude }}
                      onClick={() => handleMarkerClick(clinic)}
                    />
                  )
                ))}
                
                {selectedClinic && infoWindowOpen && selectedClinic.latitude && selectedClinic.longitude && (
                  <InfoWindow
                    position={{ lat: selectedClinic.latitude, lng: selectedClinic.longitude }}
                    onCloseClick={() => {
                      setInfoWindowOpen(false);
                      setSelectedClinic(null);
                    }}
                  >
                    <Box sx={{ minWidth: 200, p: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {selectedClinic.name}
                      </Typography>
                      {selectedClinic.address && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <LocationIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                          {selectedClinic.address}
                        </Typography>
                      )}
                      {selectedClinic.phoneNumber && (
                        <Typography variant="body2">
                          Phone: {selectedClinic.phoneNumber}
                        </Typography>
                      )}
                      {selectedClinic.email && (
                        <Typography variant="body2">
                          Email: {selectedClinic.email}
                        </Typography>
                      )}
                      {selectedClinic.website && (
                        <Typography variant="body2">
                          Website: <a href={selectedClinic.website} target="_blank" rel="noopener noreferrer">{selectedClinic.website}</a>
                        </Typography>
                      )}
                      {selectedClinic.latitude && selectedClinic.longitude && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DirectionsIcon />}
                          sx={{ mt: 2 }}
                          onClick={() => openDirections({ 
                            latitude: selectedClinic.latitude, 
                            longitude: selectedClinic.longitude, 
                            name: selectedClinic.name 
                          })}
                          fullWidth
                        >
                          Directions
                        </Button>
                      )}
                    </Box>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
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
                              openDirections({ 
                                latitude: clinic.latitude, 
                                longitude: clinic.longitude, 
                                name: clinic.name 
                              });
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