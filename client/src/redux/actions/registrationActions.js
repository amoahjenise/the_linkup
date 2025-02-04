// actions/registrationActions.js
import {
  NEXT_STEP,
  PREVIOUS_STEP,
  RESET_REGISTRATION_STATE,
  SET_IS_REGISTERING,
} from "./actionTypes";

export const nextStep = () => ({
  type: NEXT_STEP,
});

export const previousStep = () => ({
  type: PREVIOUS_STEP,
});

export const resetRegistrationState = () => ({
  type: RESET_REGISTRATION_STATE,
});

export const setIsRegistering = (isRegistering) => ({
  type: SET_IS_REGISTERING,
  payload: isRegistering,
});
