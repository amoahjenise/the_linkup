import { updateLinkup as updateLinkupAPI } from "../../api/linkUpAPI";
import {
  ADD_LINKUP,
  REMOVE_LINKUP,
  UPDATE_LINKUP,
  SET_IS_LOADING,
  FETCH_LINKUPS_SUCCESS,
  FETCH_LINKUPS_FAILURE,
  SHOW_UPDATE_FEED_BUTTON,
  UPDATE_LINKUP_SUCCESS,
  UPDATE_LINKUP_FAILURE,
} from "./actionTypes";

// Add Linkup Action
export const addLinkup = (linkup) => ({
  type: ADD_LINKUP,
  payload: linkup,
});

// Remove Linkup Action
export const removeLinkup = (linkupId) => ({
  type: REMOVE_LINKUP,
  payload: linkupId,
});

// Update Linkup Action
export const updateLinkup = (updatedLinkup) => ({
  type: UPDATE_LINKUP,
  payload: updatedLinkup,
});

export const updateLinkupSuccess = (updatedLinkup) => ({
  type: UPDATE_LINKUP_SUCCESS,
  payload: updatedLinkup,
});

export const updateLinkupFailure = (updatedLinkup) => ({
  type: UPDATE_LINKUP_FAILURE,
  payload: updatedLinkup,
});

// Show Update Feed Button Action
export const showUpdateFeedButton = (show) => ({
  type: SHOW_UPDATE_FEED_BUTTON,
  payload: show,
});

// Fetch Linkups Success Action
export const fetchLinkupsSuccess = (linkups) => ({
  type: FETCH_LINKUPS_SUCCESS,
  payload: linkups,
});

// Fetch Linkups Failure Action
export const fetchLinkupsFailure = (error) => ({
  type: FETCH_LINKUPS_FAILURE,
  payload: error,
});

// Set Loading State Action
export const setIsLoading = (isLoading) => ({
  type: SET_IS_LOADING,
  payload: isLoading,
});
