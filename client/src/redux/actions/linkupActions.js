import {
  markLinkupsAsExpired as markLinkupsAsExpiredAPI,
  updateLinkup as updateLinkupAPI,
} from "../../api/linkupAPI";

import {
  FETCH_LINKUPS_SUCCESS,
  SET_IS_LOADING,
  UPDATE_LINKUP_SUCCESS,
  UPDATE_LINKUP_LIST,
  MARK_LINKUPS_AS_EXPIRED_SUCCESS,
} from "./actionTypes";

export const markLinkupsAsExpiredSuccess = (updatedLinkupList) => ({
  type: MARK_LINKUPS_AS_EXPIRED_SUCCESS,
  payload: updatedLinkupList,
});

export const updateLinkupSuccess = (updatedLinkup) => ({
  type: UPDATE_LINKUP_SUCCESS,
  payload: updatedLinkup,
});

export const fetchLinkupsSuccess = (linkups) => ({
  type: FETCH_LINKUPS_SUCCESS,
  payload: linkups,
});

export const setIsLoading = (isLoading) => ({
  type: SET_IS_LOADING,
  payload: isLoading,
});

export const updateLinkupList = (newLinkup) => ({
  type: UPDATE_LINKUP_LIST,
  payload: newLinkup,
});

export const updateLinkup = (linkupId, updatedLinkupData) => {
  return async (dispatch) => {
    try {
      // Perform the actual update operation using your API or service
      const result = await updateLinkupAPI(linkupId, updatedLinkupData);
      if (result.success) {
        dispatch(updateLinkupSuccess(result.linkup));
        return result;
      } else {
        console.log("Error updating linkup:", result.message);
      }
    } catch (error) {
      console.log("Error updating linkup:", error);
    }
  };
};

// Create the action for marking link-ups as expired
export const markLinkupsAsExpired = () => {
  return async (dispatch) => {
    try {
      // Perform the API call to mark link-ups as expired
      const result = await markLinkupsAsExpiredAPI();

      if (result.success) {
        return result; // Return the result if needed
      } else {
        console.log("Error marking link-ups as expired:", result.message);
      }
    } catch (error) {
      console.log("Error marking link-ups as expired:", error);
    }
  };
};
