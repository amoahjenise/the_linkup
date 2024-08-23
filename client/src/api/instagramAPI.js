import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const CLIENT_ID = process.env.REACT_APP_INSTAGRAM_APP_ID;
const REDIRECT_URI = process.env.REACT_APP_INSTAGRAM_REDIRECT_URI;

const handleError = (error) => {
  console.error("Error:", error.response ? error.response.data : error.message);
  throw error;
};

// Step 1: Redirect user to Instagram OAuth
export const redirectToInstagramLogin = () => {
  const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  window.location.href = instagramAuthUrl;
};

// Step 2: Exchange code for access token
export const getAccessToken = async (code) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/image/auth/instagram/callback`,
      {
        params: { code },
      }
    );
    return response.data.accessToken;
  } catch (error) {
    handleError(error);
  }
};

// Step 3: Fetch user media
export const getUserMedia = async (accessToken) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/image/user/media`, {
      params: { accessToken },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Step 4: Display the photos (e.g., in a React component)
export const DisplayInstagramPhotos = ({ media }) => {
  return (
    <div>
      {media.map((item) => (
        <img key={item.id} src={item.media_url} alt={item.caption} />
      ))}
    </div>
  );
};

// Fetch Instagram Access Token from the Database
export const getInstagramAccessToken = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/image/user/${userId}/instagram-token`
    );
    return response.data.avatar; // Assuming the token is stored in the 'avatar' field, adjust if needed.
  } catch (error) {
    handleError(error);
  }
};

// Post Instagram Access Token to the Database
export const postInstagramAccessToken = async (userId, accessToken) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/image/user/${userId}/instagram-token`,
      {
        access_token: accessToken,
      }
    );
    return response.data.token; // Assuming the response contains the user's name, adjust if needed.
  } catch (error) {
    handleError(error);
  }
};
