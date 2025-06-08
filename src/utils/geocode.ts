import axios from 'axios';
import config from '../config';

interface AddressComponents {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Geocode an address using Google Maps Geocoding API.
 */
export async function geocodeAddress({address, city, state, zipCode, country}: AddressComponents): Promise<Coordinates | null> {
  const addressComponents = [address, city, state, zipCode, country].filter(Boolean).join(', ');
  const apiKey = config.api.google.mapsApiKey;

  if (!apiKey) {
    console.error('Google Maps API key is not configured');
    return null;
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json`;

  try {
    const response = await axios.get(url, {
      params: {
        address: addressComponents,
        key: apiKey
      }
    });

    if (response.data.status === 'OK' && response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } else if (response.data.status === 'ZERO_RESULTS') {
      console.warn('No results found for address:', addressComponents);
    } else if (response.data.status === 'REQUEST_DENIED') {
      console.error('Request denied - check API key and billing:', response.data.error_message);
    } else if (response.data.status === 'OVER_QUERY_LIMIT') {
      console.error('Over query limit - check API quotas');
    } else {
      console.error('API error:', response.data.status, response.data.error_message);
    }
  } catch (err) {
    console.error('Network/request error:', err);
    if ((err as any).response) {
      console.error('Error response:', (err as any).response.data);
    }
  }

  return null;
}