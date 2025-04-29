import {
  ADD_LINKUP,
  REMOVE_LINKUP,
  UPDATE_LINKUP,
  SET_IS_LOADING,
  FETCH_LINKUPS_SUCCESS,
  FETCH_LINKUPS_FAILURE,
  SHOW_UPDATE_FEED_BUTTON,
} from "../actions/actionTypes";

const initialState = {
  linkupList: [],
  isLoading: false, // To track loading state
  showUpdateFeedButton: false, // To control the visibility of the new linkup button
  successMessage: "", // For success messages
  error: "", // For error messages
};

const linkupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload, // Update the loading state
      };

    case FETCH_LINKUPS_SUCCESS:
      return {
        ...state,
        linkupList: action.payload, // Set fetched linkups
        successMessage: "Linkups successfully fetched!", // Success message
      };

    case FETCH_LINKUPS_FAILURE:
      return {
        ...state,
        error: action.payload, // Set the error message in case of failure
        successMessage: "", // Clear success message on failure
      };

    case ADD_LINKUP:
      return {
        ...state,
        linkupList: [action.payload, ...state.linkupList], // Add the new linkup to the top
      };

    case REMOVE_LINKUP:
      return {
        ...state,
        linkupList: state.linkupList.filter(
          (linkup) => linkup.id !== action.payload
        ), // Remove the linkup by ID
      };

    case UPDATE_LINKUP:
      return {
        ...state,
        linkupList: state.linkupList.map((linkup) =>
          linkup.id === action.payload.id
            ? { ...linkup, ...action.payload }
            : linkup
        ), // Update the specific linkup
      };

    case SHOW_UPDATE_FEED_BUTTON:
      return {
        ...state,
        showUpdateFeedButton: action.payload, // Toggle the update feed button visibility
      };

    default:
      return state;
  }
};

export default linkupsReducer;
