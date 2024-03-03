import { updateLinkup as updateLinkupAPI } from "../../api/linkupAPI";

import {
  FETCH_LINKUPS_SUCCESS,
  SET_IS_LOADING,
  UPDATE_LINKUP_SUCCESS,
  FETCH_LINKUPS_FAILURE,
  UPDATE_LINKUP_LIST,
} from "./actionTypes";

export const updateLinkupSuccess = (updatedLinkup) => ({
  type: UPDATE_LINKUP_SUCCESS,
  payload: updatedLinkup,
});

export const fetchLinkupsSuccess = (linkups) => ({
  type: FETCH_LINKUPS_SUCCESS,
  payload: linkups,
});

export const fetchLinkupsFailure = (error) => {
  return {
    type: FETCH_LINKUPS_FAILURE,
    payload: error,
  };
};

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
