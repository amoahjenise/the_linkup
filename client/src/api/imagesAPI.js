import axios from "axios";

// Add this configuration globally for Axios to include credentials
// axios.defaults.withCredentials = true;

// Define the base URL of your server API
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const handleError = (error) => {
  console.error("Error:", error);
  throw error;
};

// Function to fetch images from the server
export async function getUserImages(userId) {
  try {
    // Make a GET request to the server endpoint for fetching images
    const response = await axios.get(`${BASE_URL}/api/image/get-images`, {
      params: {
        userId: userId,
      },
    });

    // Return the response data, which should contain the images
    return response;
  } catch (error) {
    handleError(error);
  }
}

// Function to upload images to the server
export async function uploadImages(userId, imageUrls) {
  try {
    const aImagesUrls = [];

    // Check if imageUrls is an array before using forEach
    if (Array.isArray(imageUrls)) {
      imageUrls.forEach((imageUrl, index) => {
        aImagesUrls.push(imageUrl);
      });
    } else {
      // Handle the case where imageUrls is not an array
      console.error("Invalid imageUrls:", imageUrls);
      // You can throw an error or handle it as needed
      // throw new Error("Invalid imageUrls");
    }

    // Make a POST request to the server endpoint for uploading images
    const response = await axios.post(`${BASE_URL}/api/image/upload-images`, {
      params: {
        userId: userId,
        imageUrls: aImagesUrls,
      },
    });

    // Return the response data (which may include the image URLs after storage)
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Function to delete images from the server
export async function deleteImages(userId) {
  try {
    // Make a POST request to the server endpoint for deleting images
    const response = await axios.post(`${BASE_URL}/api/image/delete-images`, {
      params: {
        userId: userId,
      },
    });

    // Return the response data, which should indicate success or failure
    return response.data;
  } catch (error) {
    handleError(error);
  }
}
