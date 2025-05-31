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
    } else {
      console.error('Geocoding API error:', response.data.status);
    }
  } catch (err) {
    console.error('Geocoding error:', err);
  }
  return null;
} 