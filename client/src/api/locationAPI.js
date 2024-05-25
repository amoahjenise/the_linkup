import axios from "axios";

// Add this configuration globally for Axios to include credentials
// axios.defaults.withCredentials = true;

const BASE_URL = process.env.REACT_APP_LOCATION_SERVICE_URL;

const handleError = (error) => {
  console.error("Error:", error);
  throw error;
};

/**
 * Posts location information to the backend.
 *
 * @param {string} city - The city of the user.
 * @param {string} country - The country of the user.
 * @param {number} latitude - The latitude of the user's location.
 * @param {number} longitude - The longitude of the user's location.
 * @param {boolean} allowLocation - Whether the user allows location tracking.
 * @returns {Promise<object>} The response data from the server.
 */
export const postLocation = async (
  id,
  city,
  country,
  latitude,
  longitude,
  allowLocation
) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/user-location`, {
      id,
      city,
      country,
      latitude,
      longitude,
      allow_location: allowLocation,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
