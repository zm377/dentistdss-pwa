import axios from 'axios';

/**
 * Geocode an address using OpenStreetMap Nominatim API.
 * @param {Object} param0 - Address fields
 * @param {string} param0.address
 * @param {string} param0.city
 * @param {string} param0.state
 * @param {string} param0.zipCode
 * @param {string} param0.country
 * @returns {Promise<{latitude: number, longitude: number} | null>}
 */
export async function geocodeAddress({ address, city, state, zipCode, country }) {
  const query = [address, city, state, zipCode, country].filter(Boolean).join(', ');
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  try {
    const response = await axios.get(url, { headers: { 'Accept-Language': 'en' } });
    if (response.data && response.data.length > 0) {
      return {
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon),
      };
    }
  } catch (err) {
    console.error('Geocoding error:', err);
  }
  return null;
} 