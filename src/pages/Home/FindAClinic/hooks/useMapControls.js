import { useState, useEffect, useCallback } from 'react';
import { useGeolocation } from './useGeolocation';

/**
 * Custom hook for Google Maps controls and state management
 * 
 * Features:
 * - Map instance management
 * - Clinic selection and marker interaction
 * - Info window state management
 * - Map center and zoom controls
 * - User location integration
 * - Responsive map behavior
 */
export const useMapControls = () => {
  // State management
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -33.8688, lng: 151.2093 }); // Default to Sydney
  const [mapZoom, setMapZoom] = useState(11);
  const [map, setMap] = useState(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  // Get user's current location
  const { userLocation, locationError } = useGeolocation();

  // Update map center when user location is available
  useEffect(() => {
    if (userLocation && !selectedClinic) {
      setMapCenter({
        lat: userLocation.latitude,
        lng: userLocation.longitude
      });
      setMapZoom(12);
    }
  }, [userLocation, selectedClinic]);

  /**
   * Handle clinic selection from list
   * @param {Object} clinic - Selected clinic object
   */
  const handleClinicSelect = useCallback((clinic) => {
    setSelectedClinic(clinic);
    setInfoWindowOpen(false);
    
    // Pan to clinic location if coordinates are available
    if (clinic.latitude && clinic.longitude && map) {
      const newCenter = { lat: clinic.latitude, lng: clinic.longitude };
      map.panTo(newCenter);
      setMapCenter(newCenter);
      setMapZoom(15);
    }
  }, [map]);

  /**
   * Handle marker click on map
   * @param {Object} clinic - Clicked clinic object
   */
  const handleMarkerClick = useCallback((clinic) => {
    setSelectedClinic(clinic);
    setInfoWindowOpen(true);
    
    // Center map on clicked marker
    if (clinic.latitude && clinic.longitude && map) {
      const newCenter = { lat: clinic.latitude, lng: clinic.longitude };
      map.panTo(newCenter);
      setMapCenter(newCenter);
    }
  }, [map]);

  /**
   * Handle info window close
   */
  const handleInfoWindowClose = useCallback(() => {
    setInfoWindowOpen(false);
    // Keep clinic selected but close info window
  }, []);

  /**
   * Clear selected clinic
   */
  const clearSelection = useCallback(() => {
    setSelectedClinic(null);
    setInfoWindowOpen(false);
  }, []);

  /**
   * Handle map load event
   * @param {google.maps.Map} mapInstance - Google Maps instance
   */
  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);

    // Add click listener to clear selection when clicking on map
    mapInstance.addListener('click', () => {
      setSelectedClinic(null);
      setInfoWindowOpen(false);
    });
  }, []); // Remove dependencies to prevent infinite re-renders

  /**
   * Handle map unmount event
   */
  const onMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  /**
   * Fit map bounds to show all clinics
   * @param {Array} clinics - Array of clinic objects with coordinates
   */
  const fitBoundsToClinic = useCallback((clinics) => {
    if (!map || !clinics.length) return;

    const bounds = new window.google.maps.LatLngBounds();
    let hasValidCoords = false;

    clinics.forEach(clinic => {
      if (clinic.latitude && clinic.longitude) {
        bounds.extend({
          lat: clinic.latitude,
          lng: clinic.longitude
        });
        hasValidCoords = true;
      }
    });

    if (hasValidCoords) {
      map.fitBounds(bounds);
      
      // Ensure minimum zoom level
      const listener = window.google.maps.event.addListener(map, 'bounds_changed', () => {
        if (map.getZoom() > 15) {
          map.setZoom(15);
        }
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [map]);

  /**
   * Center map on user location
   */
  const centerOnUserLocation = useCallback(() => {
    if (userLocation && map) {
      const userCenter = {
        lat: userLocation.latitude,
        lng: userLocation.longitude
      };
      map.panTo(userCenter);
      setMapCenter(userCenter);
      setMapZoom(12);
    }
  }, [userLocation, map]);

  /**
   * Reset map to default view
   */
  const resetMapView = useCallback(() => {
    const defaultCenter = { lat: -33.8688, lng: 151.2093 };
    setMapCenter(defaultCenter);
    setMapZoom(11);
    setSelectedClinic(null);
    setInfoWindowOpen(false);

    if (map) {
      map.panTo(defaultCenter);
      map.setZoom(11);
    }
  }, [map]); // Remove clearSelection dependency

  return {
    // State
    selectedClinic,
    mapCenter,
    mapZoom,
    map,
    infoWindowOpen,
    userLocation,
    locationError,
    
    // Actions
    handleClinicSelect,
    handleMarkerClick,
    handleInfoWindowClose,
    clearSelection,
    onMapLoad,
    onMapUnmount,
    fitBoundsToClinic,
    centerOnUserLocation,
    resetMapView,
    
    // Setters for external control
    setMapCenter,
    setMapZoom,
  };
};
