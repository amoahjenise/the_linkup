import {
  SET_LOADING,
  SET_ERROR,
  DEACTIVATE_USER_REQUEST,
  DEACTIVATE_USER_SUCCESS,
  DEACTIVATE_USER_FAILURE,
  FETCH_USER_DATA_SUCCESS,
  FETCH_USER_DATA_FAILURE,
  SET_CURRENT_USER,
  UPDATE_CURRENT_USER,
} from "../actions/actionTypes";

const initialState = {
  user: {},
  error: null,
  successMessage: "",
  loading: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case FETCH_USER_DATA_SUCCESS:
      return {
        ...state,
        user: action.payload,
        error: null,
      };
    case FETCH_USER_DATA_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case DEACTIVATE_USER_REQUEST:
      return {
        ...state,
        loading: true, // Set loading to true when deactivation request is initiated
        error: null, // Clear any previous errors
        successMessage: "",
      };
    case DEACTIVATE_USER_SUCCESS:
      return {
        ...state,
        loading: false, // Set loading back to false when deactivation is successful
        successMessage: action.payload.message,
      };
    case DEACTIVATE_USER_FAILURE:
      return {
        ...state,
        loading: false, // Set loading back to false when deactivation fails
        error: action.payload,
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        user: action.payload,
      };
    case UPDATE_CURRENT_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default userReducer;
