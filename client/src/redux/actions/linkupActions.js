import {
  createLinkup as createLinkupAPI,
  updateLinkup as updateLinkupAPI,
  deleteLinkup as deleteLinkupAPI,
  getPendingLinkups,
} from "../../api/linkupAPI";

export const FETCH_LINKUPS_SUCCESS = "FETCH_LINKUPS_SUCCESS";
export const SET_IS_LOADING = "SET_IS_LOADING";
export const DELETE_LINKUP_SUCCESS = "DELETE_LINKUP_SUCCESS";
export const CREATE_LINKUP_SUCCESS = "CREATE_LINKUP_SUCCESS";
export const UPDATE_LINKUP_SUCCESS = "UPDATE_LINKUP_SUCCESS";
export const UPDATE_LINKUP_LIST = "UPDATE_LINKUP_LIST";

export const updateLinkupSuccess = (updatedLinkup) => ({
  type: UPDATE_LINKUP_SUCCESS,
  payload: updatedLinkup,
});

export const createLinkupSuccess = (linkup) => ({
  type: CREATE_LINKUP_SUCCESS,
  payload: linkup,
});

export const fetchLinkupsSuccess = (linkups) => ({
  type: FETCH_LINKUPS_SUCCESS,
  payload: linkups,
});

export const setIsLoading = (isLoading) => ({
  type: SET_IS_LOADING,
  payload: isLoading,
});

export const deleteLinkupSuccess = (linkupId) => ({
  type: DELETE_LINKUP_SUCCESS,
  payload: linkupId,
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

export const createLinkup = (linkupData) => {
  return async (dispatch) => {
    try {
      // Perform the actual create operation using your API or service
      const result = await createLinkupAPI(linkupData);
      if (result.success) {
        return result.newLinkup;
        // dispatch(createLinkupSuccess(result.linkup));
      } else {
        return [];
      }
    } catch (error) {
      console.log("Error creating linkup:", error);
      throw error; // Rethrow the error to handle it in the component
    }
  };
};

export const fetchLinkups = () => {
  return async (dispatch) => {
    try {
      const result = await getPendingLinkups();
      if (result.success) {
        dispatch(fetchLinkupsSuccess(result.linkupList));
      } else {
        console.log("Error fetching linkups:", result.message);
      }
    } catch (error) {
      console.log("Error fetching linkups:", error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };
};

export const deleteLinkup = (linkupId) => {
  return async (dispatch) => {
    try {
      // Perform the actual delete operation using your API or service
      const result = await deleteLinkupAPI(linkupId);
      if (result.success) {
        dispatch(deleteLinkupSuccess(linkupId));
      } else {
        console.log("Error deleting linkup:", result.message);
      }
    } catch (error) {
      console.log("Error deleting linkup:", error);
    }
  };
};
