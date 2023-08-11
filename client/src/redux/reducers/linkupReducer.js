//Manages the linkups state, handling actions related to fetching, deleting, and updating linkups.

import {
  CREATE_LINKUP_SUCCESS,
  FETCH_LINKUPS_SUCCESS,
  SET_IS_LOADING,
  UPDATE_LINKUP_LIST,
} from "../actions/linkupActions";

const initialState = {
  linkupList: [],
  isLoading: true,
  successMessage: "",
  error: "",
};

const linkupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_LINKUP_SUCCESS:
      return {
        ...state,
        linkupList: [...state.linkupList, action.payload], // Change 'linkups' to 'linkupList'
        successMessage: "Your Link Up was created!",
      };
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
    default:
      return state;
  }
};

export default linkupsReducer;
