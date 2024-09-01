//Manages the linkups state, handling actions related to fetching, deleting, and updating linkups.

import {
  FETCH_LINKUPS_SUCCESS,
  SET_IS_LOADING,
  UPDATE_LINKUP_LIST,
  MARK_LINKUPS_AS_EXPIRED_SUCCESS,
  SHOW_NEW_LINKUP_BUTTON,
} from "../actions/actionTypes";

const initialState = {
  linkupList: [],
  isLoading: false,
  showNewLinkupButton: false,
  successMessage: "",
  error: "",
};

const linkupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LINKUPS_SUCCESS:
      return {
        ...state,
        linkupList: action.payload, // Change 'linkups' to 'linkupList'
        successMessage: "Link Up list fetched!",
      };
    case SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case UPDATE_LINKUP_LIST:
      return {
        ...state,
        linkupList: [action.payload, ...state.linkupList],
      };
    case MARK_LINKUPS_AS_EXPIRED_SUCCESS:
      return {
        ...state,
        linkupList: action.payload, // Update the link-up list with the new data
        successMessage: "Linkups marked as expired!",
      };
    case SHOW_NEW_LINKUP_BUTTON:
      return {
        ...state,
        showNewLinkupButton: action.payload,
      };
    default:
      return state;
  }
};

export default linkupsReducer;
