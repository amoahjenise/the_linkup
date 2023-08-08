import {
  FETCH_USER_DATA_SUCCESS,
  FETCH_USER_DATA_FAILURE,
  LOGOUT,
} from "./types";
import axios from "axios"; // Import Axios

const userServiceUrl = process.env.REACT_APP_USER_SERVICE_URL;

export const logout = () => (dispatch) => {
  // Add any other logout-related actions here, such as clearing local storage, etc.
  dispatch({ type: LOGOUT });
};

// Action creator function to fetch user data
export const fetchUserData = () => async (dispatch, getState) => {
  const id = getState().loggedUser.id;
  try {
    // Call the server route to fetch user data using Axios
    const response = await axios.get(`${userServiceUrl}/get-user-by-id`, {
      params: {
        id: id,
      },
    });

    const user = response.data.user;

    // Dispatch the FETCH_USER_DATA_SUCCESS action with the retrieved user data
    dispatch({
      type: FETCH_USER_DATA_SUCCESS,
      payload: user,
    });
  } catch (error) {
    // Dispatch the FETCH_USER_DATA_FAILURE action with the error message
    dispatch({
      type: FETCH_USER_DATA_FAILURE,
      payload: error.message,
    });
  }
};
