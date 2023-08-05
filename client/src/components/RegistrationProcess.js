import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearRegistrationState,
  updateRegistrationData,
  nextStep,
  previousStep,
} from "../redux/reducers/registrationReducer";
import { login } from "../redux/reducers/authReducer";
import { setCurrentUser } from "../redux/reducers/loggedUserReducer";
import FirstStep from "../components/ProgressBarSteps/FirstStep";
import SecondStep from "../components/ProgressBarSteps/SecondStep";
import ThirdStep from "../components/ProgressBarSteps/ThirdStep";
import LastStep from "../components/ProgressBarSteps/LastStep";
import MultiStepProgressBar from "../components/MultiStepProgressBar/MultiStepProgressBar";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(2),
  },
}));

const authServiceUrl = process.env.REACT_APP_AUTH_SERVICE_URL;
const userServiceUrl = process.env.REACT_APP_USER_SERVICE_URL;

console.log("SERVICE_URL", userServiceUrl);
const RegistrationProcess = ({ password, setPassword }) => {
  const classes = useStyles();
  const registrationData = useSelector((state) => state.registration);
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUpdateRegistrationData = (data) => {
    dispatch(updateRegistrationData(data));
  };

  const handleLaunchLuul = async () => {
    try {
      if (registrationData.currentStep === 3) {
        // Create user using axios

        const response = await axios.post(`${authServiceUrl}/api/create-user`, {
          phoneNumber: authState.phoneNumber,
          password: password,
          registrationData: registrationData.registrationData,
        });

        if (response.status === "200") {
          // perform uploadAvatar
        }
        // Set the user data in the Redux store
        dispatch(setCurrentUser(response.data.user));

        navigate(`/profile/me`);
        // Reset the registration data after successful registration
        // Mark the user as logged in by dispatching the login action
        dispatch(login());
        setPassword();
        dispatch(clearRegistrationState);
      } else {
        alert("Incomplete registration data. Please complete all steps.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    }
  };

  const handlePreviousStep = () => {
    dispatch(previousStep());
  };

  const pageTitles = [
    "Welcome! First things first...",
    "Now it’s time to upload some photos",
    "Create a Password",
    "You've completed the registration, you can start using LUUL!",
  ];
  const pageSubTitles = [
    "This is how you’ll appear on LUUL. You won't be able to change this later.",
    "Let's add your first picture to display on your profile.",
    "",
    "",
  ];

  const PageDisplay = () => {
    switch (registrationData.currentStep) {
      case 0:
        return (
          <FirstStep
            registrationData={registrationData.registrationData}
            updateRegistrationData={handleUpdateRegistrationData}
          />
        );
      case 1:
        return (
          <SecondStep
            registrationData={registrationData.registrationData}
            updateRegistrationData={handleUpdateRegistrationData}
          />
        );
      case 2:
        return (
          <ThirdStep
            registrationData={registrationData.registrationData}
            updateRegistrationData={handleUpdateRegistrationData}
            password={password}
            setPassword={setPassword}
          />
        );
      default:
        return (
          <LastStep
            registrationData={registrationData.registrationData}
            updateRegistrationData={handleUpdateRegistrationData}
          />
        );
    }
  };

  return (
    <div>
      <MultiStepProgressBar />
      <div>
        <div>
          <h1>
            {registrationData.currentStep === pageTitles.length
              ? "Congratulations!"
              : pageTitles[registrationData.currentStep]}
          </h1>
          <p>{pageSubTitles[registrationData.currentStep]}</p>
        </div>
        <div>{PageDisplay()}</div>
        <div className={classes.buttonContainer}>
          {registrationData.currentStep > 0 &&
            registrationData.currentStep !== 3 && (
              <Button onClick={handlePreviousStep}>Back</Button>
            )}
          {registrationData.currentStep === 3 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleLaunchLuul}
            >
              Launch LUUL
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => dispatch(nextStep())}
              disabled={
                (registrationData.currentStep === 1 &&
                  !registrationData.registrationData.profilePicture) ||
                (registrationData.currentStep === 0 &&
                  (!registrationData.registrationData.firstName ||
                    !registrationData.registrationData.gender ||
                    !registrationData.registrationData.dateOfBirth)) ||
                (registrationData.currentStep === 2 &&
                  !registrationData.registrationData.isPasswordValid)
              }
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationProcess;
