import { updateLinkup as updateLinkupAPI } from "../../api/linkUpAPI";

import {
  SET_IS_LOADING,
  FETCH_LINKUPS_SUCCESS,
  FETCH_LINKUPS_FAILURE,
  UPDATE_LINKUP_SUCCESS,
  UPDATE_LINKUP_FAILURE,
  UPDATE_LINKUP_LIST,
  SHOW_NEW_LINKUP_BUTTON,
  MERGE_LINKUPS_SUCCESS
} from "./actionTypes";

export const showNewLinkupButton = (show) => ({
  type: SHOW_NEW_LINKUP_BUTTON,
  payload: show,
});

export const updateLinkupSuccess = (updatedLinkup) => ({
  type: UPDATE_LINKUP_SUCCESS,
  payload: updatedLinkup,
});

export const updateLinkupFailure = (updatedLinkup) => ({
  type: UPDATE_LINKUP_FAILURE,
  payload: updatedLinkup,
});

export const fetchLinkupsSuccess = (linkups) => ({
  type: FETCH_LINKUPS_SUCCESS,
  payload: linkups,
});

export const fetchLinkupsFailure = (error) => ({
  type: FETCH_LINKUPS_FAILURE,
  payload: error,
});

export const setIsLoading = (isLoading) => ({
  type: SET_IS_LOADING,
  payload: isLoading,
});

export const updateLinkupList = (newLinkup) => ({
  type: UPDATE_LINKUP_LIST,
  payload: newLinkup,
});

export const mergeLinkupsSuccess = (newLinkups, isInitialLoad = false) => ({
  type: MERGE_LINKUPS_SUCCESS,
  payload: { newLinkups, isInitialLoad }
});

export const updateLinkup = (linkupId, updatedLinkupData) => {
  return async (dispatch) => {
    try {
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