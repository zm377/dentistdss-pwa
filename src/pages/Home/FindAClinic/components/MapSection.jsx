import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Box,
  CircularProgress,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import config from '../../../../config';
import ClinicInfoWindow from './ClinicInfoWindow';
import { useGeocoding } from '../hooks/useGeocoding';

/**
 * MapSection Component
 * 
 * Responsive Google Maps interface with:
 * - Mobile-first responsive design
 * - Geocoded clinic markers
 * - Interactive info windows
 * - Loading states and error handling
 * - Optimized map controls for mobile
 */
const MapSection = React.memo(({
  clinics,
  selectedClinic,
  mapCenter,
  mapZoom,
  map,
  infoWindowOpen,
  isMobile,
  onClinicSelect,
  onMarkerClick,
  onInfoWindowClose,
  onMapLoad,
  onMapUnmount
}) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // State for Google Maps API readiness
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // Use geocoding hook for clinic coordinates
  const { clinicsWithCoords, geocoding } = useGeocoding(clinics);

  // Find the selected clinic with coordinates from the geocoded list
  const selectedClinicWithCoords = selectedClinic
    ? clinicsWithCoords.find(clinic => clinic.id === selectedClinic.id) || selectedClinic
    : null;

  // Debug logging
  useEffect(() => {
    console.log('🗺️ MapSection Debug:', {
      clinicsCount: clinics?.length || 0,
      clinicsWithCoordsCount: clinicsWithCoords?.length || 0,
      selectedClinic: selectedClinic ? {
        id: selectedClinic.id,
        name: selectedClinic.name,
        hasCoords: !!(selectedClinic.latitude && selectedClinic.longitude)
      } : null,
      selectedClinicWithCoords: selectedClinicWithCoords ? {
        id: selectedClinicWithCoords.id,
        name: selectedClinicWithCoords.name,
        hasCoords: !!(selectedClinicWithCoords.latitude && selectedClinicWithCoords.longitude)
      } : null,
      infoWindowOpen,
      geocoding,
      isGoogleMapsLoaded,
      googleMapsAvailable: !!window.google?.maps
    });
  }, [clinics, clinicsWithCoords, selectedClinic, selectedClinicWithCoords, infoWindowOpen, geocoding, isGoogleMapsLoaded]);

  // Responsive map height
  const getMapHeight = () => {
    if (isMobile) return '400px';
    if (isTablet) return '500px';
    return '600px';
  };

  // Responsive map container style
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    minWidth: '100%',
    minHeight: getMapHeight(),
    borderRadius: theme.shape.borderRadius,
    display: 'block',
    boxSizing: 'border-box',
  };

  // Map options optimized for different screen sizes
  const getMapOptions = () => ({
    disableDefaultUI: isMobile,
    zoomControl: true,
    mapTypeControl: !isMobile,
    scaleControl: !isMobile,
    streetViewControl: !isMobile,
    rotateControl: false,
    fullscreenControl: !isMobile,
    gestureHandling: isMobile ? 'cooperative' : 'auto',
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: isMobile ? 'off' : 'on' }]
      }
    ]
  });



  return (
    <Paper
      elevation={3}
      sx={{
        height: getMapHeight(),
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        width: '100%', // Ensure full width within Grid item
        minWidth: '100%', // Prevent width collapse
        maxWidth: '100%', // Prevent overflow
        minHeight: getMapHeight(), // Ensure minimum height
        display: 'block',
        boxSizing: 'border-box',
        flex: '1 1 auto',
      }}
    >


      {/* Loading Overlay */}
      {geocoding && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
            bgcolor: 'background.paper',
            borderRadius: '50%',
            p: 1,
            boxShadow: 2,
          }}
        >
          <CircularProgress
            size={isMobile ? 24 : 32}
            thickness={4}
          />
        </Box>
      )}

      <LoadScript
        googleMapsApiKey={config.api.google.mapsApiKey}
        onLoad={() => {
          console.log('🗺️ Google Maps API loaded successfully');
          setIsGoogleMapsLoaded(true);
        }}
        onError={(error) => {
          console.error('🗺️ Google Maps API failed to load:', error);
          setIsGoogleMapsLoaded(false);
        }}
        loadingElement={
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'secondary.light',
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={mapZoom}
          onLoad={onMapLoad}
          onUnmount={onMapUnmount}
          options={getMapOptions()}
        >
          {/* Clinic Markers */}
          {isGoogleMapsLoaded && clinicsWithCoords
            .filter(clinic => clinic.latitude && clinic.longitude)
            .map((clinic, index) => {
              console.log('🗺️ Rendering marker for clinic:', {
                id: clinic.id,
                name: clinic.name,
                latitude: clinic.latitude,
                longitude: clinic.longitude,
                hasValidCoords: true
              });

              return (
                <Marker
                  key={clinic.id || `clinic-${index}`}
                  position={{
                    lat: parseFloat(clinic.latitude),
                    lng: parseFloat(clinic.longitude)
                  }}
                  onClick={() => {
                    console.log('🗺️ Marker clicked:', clinic.name);
                    onMarkerClick(clinic);
                  }}
                  title={clinic.name}
                  animation={
                    selectedClinic?.id === clinic.id && window.google?.maps?.Animation
                      ? window.google.maps.Animation.BOUNCE
                      : null
                  }
                />
              );
            })
          }

          {/* Info Window */}
          {isGoogleMapsLoaded &&
            selectedClinicWithCoords &&
            infoWindowOpen &&
            selectedClinicWithCoords.latitude &&
            selectedClinicWithCoords.longitude &&
            window.google?.maps?.Size && (
              <InfoWindow
                position={{
                  lat: parseFloat(selectedClinicWithCoords.latitude),
                  lng: parseFloat(selectedClinicWithCoords.longitude)
                }}
                onCloseClick={() => {
                  console.log('🗺️ InfoWindow closed');
                  onInfoWindowClose();
                }}
                options={{
                  pixelOffset: new window.google.maps.Size(0, -30),
                  maxWidth: isMobile ? 280 : 320,
                  disableAutoPan: false,
                }}
              >
                <div>
                  <ClinicInfoWindow
                    clinic={selectedClinicWithCoords}
                    isMobile={isMobile}
                  />
                </div>
              </InfoWindow>
            )}

          {/* Fallback message when clinic has no coordinates */}
          {selectedClinic &&
           infoWindowOpen &&
           (!selectedClinicWithCoords?.latitude || !selectedClinicWithCoords?.longitude) && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                p: 2,
                borderRadius: 1,
                boxShadow: 3,
                zIndex: 1000,
                maxWidth: 300,
                textAlign: 'center'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Location not available for {selectedClinic.name}
              </Typography>
            </Box>
          )}
        </GoogleMap>
      </LoadScript>
    </Paper>
  );
});

MapSection.displayName = 'MapSection';

MapSection.propTypes = {
  clinics: PropTypes.array.isRequired,
  selectedClinic: PropTypes.object,
  mapCenter: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  mapZoom: PropTypes.number.isRequired,
  map: PropTypes.object,
  infoWindowOpen: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onClinicSelect: PropTypes.func.isRequired,
  onMarkerClick: PropTypes.func.isRequired,
  onInfoWindowClose: PropTypes.func.isRequired,
  onMapLoad: PropTypes.func.isRequired,
  onMapUnmount: PropTypes.func.isRequired,
};

MapSection.defaultProps = {
  selectedClinic: null,
  map: null,
};

export default MapSection;
