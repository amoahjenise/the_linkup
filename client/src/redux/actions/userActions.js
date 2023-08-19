import { getUserById, deleteUser } from "../../api/usersAPI";

import {
  DEACTIVATE_USER_REQUEST,
  DEACTIVATE_USER_SUCCESS,
  DEACTIVATE_USER_FAILURE,
  SET_CURRENT_USER,
  UPDATE_CURRENT_USER,
  FETCH_USER_DATA_SUCCESS,
  FETCH_USER_DATA_FAILURE,
  LOGOUT,
} from "./actionTypes";

export const deactivateUserRequest = () => ({
  type: DEACTIVATE_USER_REQUEST,
});

export const deactivateUserSuccess = (data) => ({
  type: DEACTIVATE_USER_SUCCESS,
  payload: data,
});

export const deactivateUserFailure = (error) => ({
  type: DEACTIVATE_USER_FAILURE,
  payload: error,
});

export const fetchUserDataSuccess = (user) => ({
  type: FETCH_USER_DATA_SUCCESS,
  payload: user,
});

export const fetchUserDataFailure = (error) => ({
  type: FETCH_USER_DATA_FAILURE,
  payload: error,
});

export const setCurrentUser = (user) => ({
  type: SET_CURRENT_USER,
  payload: user,
});

export const updateCurrentUser = (user) => ({
  type: UPDATE_CURRENT_USER,
  payload: user,
});

export const deactivateUser = (userId) => async (dispatch) => {
  try {
    dispatch(deactivateUserRequest());
    // Use the deleteUser function from usersAPI.js
    const response = await deleteUser(userId);
    dispatch(deactivateUserSuccess(response.data));
  } catch (error) {
    dispatch(deactivateUserFailure(error));
  }
};

export const fetchUserData = () => async (dispatch, getState) => {
  const id = getState().loggedUser.id;
  try {
    // Use the getUserById function from usersAPI.js
    const user = await getUserById(id);

    // Dispatch the FETCH_USER_DATA_SUCCESS action with the retrieved user data
    dispatch(fetchUserDataSuccess(user));
  } catch (error) {
    // Dispatch the FETCH_USER_DATA_FAILURE action with the error message
    dispatch(fetchUserDataFailure(error.message));
  }
};

export const logout = () => (dispatch) => {
  // Add any other logout-related actions here, such as clearing local storage, etc.
  dispatch({ type: LOGOUT });
};
