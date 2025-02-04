// reducers/registrationReducer.js
import {
  NEXT_STEP,
  PREVIOUS_STEP,
  RESET_REGISTRATION_STATE,
  SET_IS_REGISTERING,
} from "../actions/actionTypes";

const initialState = {
  isRegistering: false,
  currentStep: 0,
  steps: ["User Info", "Avatar", "Launch"],
};

const registrationReducer = (state = initialState, action) => {
  switch (action.type) {
    case NEXT_STEP:
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.steps.length - 1),
      };
    case PREVIOUS_STEP:
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };
    case RESET_REGISTRATION_STATE:
      return initialState;
    case SET_IS_REGISTERING:
      return {
        ...state,
        isRegistering: action.payload,
      };
    default:
      return state;
  }
};

export default registrationReducer;
