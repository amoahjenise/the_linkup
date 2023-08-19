import { NEXT_STEP, PREVIOUS_STEP } from "../actions/actionTypes";

const initialState = {
  currentStep: 0,
  steps: ["User Info", "Profile Picture", "Password", "Launch LUUL"],
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
    default:
      return state;
  }
};

export default registrationReducer;
