import React, { useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import SearchSection from '../../../components/FindAClinic/SearchSection';
import MapSection from '../../../components/FindAClinic/MapSection';
import ClinicList from '../../../components/FindAClinic/ClinicList';

import { useClinicSearch } from '../../../hooks/useClinicSearch';
import { useMapControls } from '../../../hooks/useMapControls';
import { useResponsiveLayout } from '../../../hooks/useResponsiveLayout';

const FindAClinic = React.memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State for geocoded clinics
  const [clinicsWithCoords, setClinicsWithCoords] = useState([]);

  // Custom hooks for separated concerns
  const {
    searchKeywords,
    setSearchKeywords,
    clinics,
    loading,
    error,
    handleSearch,
    handleKeyPress,
    clearResults
  } = useClinicSearch();

  const {
    selectedClinic,
    mapCenter,
    mapZoom,
    map,
    infoWindowOpen,
    handleClinicSelect,
    handleMarkerClick,
    handleInfoWindowClose,
    onMapLoad,
    onMapUnmount
  } = useMapControls();

  const { containerSpacing } = useResponsiveLayout(isMobile);

  // Handle geocoded clinics from MapSection
  const handleClinicsWithCoordsChange = useCallback((geocodedClinics) => {
    setClinicsWithCoords(geocodedClinics);
  }, []);



  return (
    <Container
      maxWidth="xl"
      sx={{
        py: containerSpacing,
        px: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          mb: 3,
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
          textAlign: { xs: 'center', md: 'left' }
        }}
      >
        Find a Dental Clinic
      </Typography>

      {/* Search Section */}
      <SearchSection
        searchKeywords={searchKeywords}
        setSearchKeywords={setSearchKeywords}
        loading={loading}
        error={error}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
        onClearResults={clearResults}
        isMobile={isMobile}
      />

      {/* Map and Results Layout */}
      <Grid
        container
        spacing={3}
        sx={{
          width: '100%',
          margin: 0,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flexWrap: 'nowrap',
          alignItems: 'stretch',
        }}
      >
        {/* Map Section */}
        <Grid
          size={{ xs: 12, md: 8 }}
          sx={{
            width: { xs: '100%', md: '66%' },
            maxWidth: { xs: '100%', md: '66%' },
            flexBasis: { xs: '100%', md: '66%' },
            flexGrow: 0,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            paddingRight: { xs: 0, md: 1.5 },
          }}
        >
          <MapSection
            clinics={clinics}
            selectedClinic={selectedClinic}
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            map={map}
            infoWindowOpen={infoWindowOpen}
            isMobile={isMobile}
            onClinicSelect={handleClinicSelect}
            onMarkerClick={handleMarkerClick}
            onInfoWindowClose={handleInfoWindowClose}
            onMapLoad={onMapLoad}
            onMapUnmount={onMapUnmount}
            onClinicsWithCoordsChange={handleClinicsWithCoordsChange}
          />
        </Grid>

        {/* Results List Section */}
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            width: { xs: '100%', md: '33%' },
            maxWidth: { xs: '100%', md: '33%' },
            flexBasis: { xs: '100%', md: '33%' },
            flexGrow: 0,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            paddingLeft: { xs: 0, md: 1.5 },
            marginTop: { xs: 3, md: 0 },
          }}
        >
          <ClinicList
            clinics={clinicsWithCoords.length > 0 ? clinicsWithCoords : clinics}
            selectedClinic={selectedClinic}
            loading={loading}
            isMobile={isMobile}
            onClinicSelect={handleClinicSelect}
          />
        </Grid>
      </Grid>


    </Container>
  );
});

// Display name for debugging
FindAClinic.displayName = 'FindAClinic';

export default FindAClinic;