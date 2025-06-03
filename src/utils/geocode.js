import axios from 'axios';
import config from '../config';

/**
 * Geocode an address using Google Maps Geocoding API.
 * @param {Object} param0 - Address fields
 * @param {string} param0.address
 * @param {string} param0.city
 * @param {string} param0.state
 * @param {string} param0.zipCode
 * @param {string} param0.country
 * @returns {Promise<{latitude: number, longitude: number} | null>}
 */
export async function geocodeAddress({address, city, state, zipCode, country}) {
  const addressComponents = [address, city, state, zipCode, country].filter(Boolean).join(', ');
  const apiKey = config.api.google.mapsApiKey;


  if (!apiKey) {
    console.error('🌍 geocodeAddress: Google Maps API key is not configured');
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
      const result = {
        latitude: location.lat,
        longitude: location.lng,
      };
      return result;
    } else if (response.data.status === 'ZERO_RESULTS') {
      console.warn('🌍 geocodeAddress: No results found for address:', addressComponents);
    } else if (response.data.status === 'REQUEST_DENIED') {
      console.error('🌍 geocodeAddress: Request denied - check API key and billing:', response.data.error_message);
    } else if (response.data.status === 'OVER_QUERY_LIMIT') {
      console.error('🌍 geocodeAddress: Over query limit - check API quotas');
    } else {
      console.error('🌍 geocodeAddress: API error:', response.data.status, response.data.error_message);
    }
  } catch (err) {
    console.error('🌍 geocodeAddress: Network/request error:', err);
    if (err.response) {
      console.error('🌍 geocodeAddress: Error response:', err.response.data);
    }
  }

  return null;
}