import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import MultiStepProgressBar from "../components/MultiStepProgressBar/MultiStepProgressBar";
import { useColorMode } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";

// Import Redux Actions
import {
  nextStep,
  previousStep,
  resetRegistrationState,
} from "../redux/actions/registrationActions";
import { login } from "../redux/actions/authActions";
import { setCurrentUser } from "../redux/actions/userActions";
// Import Registration Steps
import FirstStep from "../components/ProgressBarSteps/FirstStep";
import SecondStep from "../components/ProgressBarSteps/SecondStep";
import LastStep from "../components/ProgressBarSteps/LastStep";
// Import API functions
import { updateUser } from "../api/usersAPI";

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(8),
    fontSize: "24px",
  },
  buttonContainer: {
    display: "flex",
    alignContent: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing(2),
  },
}));

const RegistrationProcess = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const { user } = useUser();

  const registrationData = useSelector((state) => state.registration);

  const [userData, setUserData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    avatarURL: "",
  });

  const handleLaunchLuul = async () => {
    try {
      const response = await updateUser({
        user: { ...userData, clerkUserId: user.id },
      });
      if (response.data.success) {
        dispatch(setCurrentUser(response.data.user));
        dispatch(login());
        navigate(`/home`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    }
  };

  const handleNextStep = async () => {
    dispatch(nextStep());
  };

  const handlePreviousStep = () => {
    dispatch(previousStep());
  };

  const pageTitles = [
    "Welcome! First things first...",
    "Now it’s time to upload a photo!",
    "You've completed the registration, you can start using LUUL!",
  ];

  const pageSubTitles = [
    "This is how you’ll appear on LUUL. You won't be able to change this later.",
    "Let's add your first picture to display on your profile.",
    "",
  ];

  useEffect(() => {
    return () => {
      // Reset the registration state when the component unmounts
      dispatch(resetRegistrationState());
    };
  }, []); // Dispatch resetRegistrationState only once when the component mounts

  const PageDisplay = () => {
    switch (registrationData.currentStep) {
      case 0:
        return <FirstStep userData={userData} setUserData={setUserData} />;
      case 1:
        return <SecondStep userData={userData} setUserData={setUserData} />;
      default:
        return <LastStep userData={userData} />;
    }
  };

  return (
    <div>
      <MultiStepProgressBar colorMode={colorMode} />
      <div>
        <div className={classes.title}>
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
            registrationData.currentStep !== 2 && (
              <Button onClick={handlePreviousStep}>Back</Button>
            )}
          <Button
            variant="contained"
            color="primary"
            onClick={
              registrationData.currentStep === 2
                ? handleLaunchLuul
                : handleNextStep
            }
            disabled={
              (registrationData.currentStep === 1 && !userData.avatarURL) ||
              (registrationData.currentStep === 0 &&
                (!userData.name || !userData.gender || !userData.dateOfBirth))
            }
          >
            {registrationData.currentStep === 2 ? "Launch LUUL" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationProcess;
