import {
  FETCH_USER_DATA_SUCCESS,
  FETCH_USER_DATA_FAILURE,
} from "../actions/loggedUserActions";

// Action types
const SET_CURRENT_USER = "SET_CURRENT_USER";
const UPDATE_CURRENT_USER = "UPDATE_CURRENT_USER";

// Initial state
const initialState = {
  user: {},
  error: null,
};

// Action creators
export const setCurrentUser = (user) => ({
  type: SET_CURRENT_USER,
  payload: user,
});

export const updateCurrentUser = (user) => ({
  type: UPDATE_CURRENT_USER,
  payload: user,
});

// Reducer function
const loggedUserReducer = (state = initialState, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};

export default loggedUserReducer;
