import { NEXT_STEP, PREVIOUS_STEP } from "./actionTypes";
import { RESET_REGISTRATION_STATE } from "./actionTypes";

export const nextStep = (step) => ({
  type: NEXT_STEP,
});

export const previousStep = (step) => ({
  type: PREVIOUS_STEP,
});

export const resetRegistrationState = () => {
  return {
    type: RESET_REGISTRATION_STATE,
  };
};
