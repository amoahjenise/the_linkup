const initialState = {
  registrationData: {
    firstName: "",
    dateOfBirth: "",
    gender: "",
    profilePicture: null,
  },
  currentStep: 0,
  steps: ["User Info", "Profile Picture", "Password", "Launch LUUL"],
};

const CLEAR_REGISTRATION_STATE = "CLEAR_REGISTRATION_STATE";

export const updateRegistrationData = (data) => ({
  type: "UPDATE_REGISTRATION_DATA",
  payload: data,
});

export const nextStep = (step) => ({
  type: "NEXT_STEP",
});

export const previousStep = (step) => ({
  type: "PREVIOUS_STEP",
});

export const createUser = (userData) => ({
  type: "CREATE_USER",
  payload: userData,
});

export const clearRegistrationState = () => ({
  type: "CLEAR_REGISTRATION_STATE",
});

const registrationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_REGISTRATION_DATA":
      return {
        ...state,
        registrationData: {
          ...state.registrationData,
          ...action.payload,
        },
      };
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.steps.length - 1),
      };
    case "PREVIOUS_STEP":
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };
    case "CREATE_USER":
      return {
        ...state,
        registrationData: action.payload,
      };
    case CLEAR_REGISTRATION_STATE:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default registrationReducer;
