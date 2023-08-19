import { NEXT_STEP, PREVIOUS_STEP } from "./actionTypes";

export const nextStep = (step) => ({
  type: NEXT_STEP,
});

export const previousStep = (step) => ({
  type: PREVIOUS_STEP,
});
