import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import MultiStepProgressBar from "../components/MultiStepProgressBar/MultiStepProgressBar";
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
import ThirdStep from "../components/ProgressBarSteps/ThirdStep";
import LastStep from "../components/ProgressBarSteps/LastStep";
// Import API functions
import { createUser } from "../api/usersAPI";

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(2),
  },
}));

const RegistrationProcess = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const registrationData = useSelector((state) => state.registration);
  const authState = useSelector((state) => state.auth);

  const handleLaunchLuul = async () => {
    navigate(`/profile/me`);
  };

  const handleNextStep = async () => {
    // Handle navigation to the next step
    dispatch(nextStep());

    if (registrationData.currentStep === 2) {
      // Create object for user creation
      const newUser = {
        phoneNumber: authState.phoneNumber,
        name: name,
        gender: gender,
        dateOfBirth: dateOfBirth,
        avatarURL: avatarURL,
        password: password,
      };

      try {
        const response = await createUser({ newUser: newUser });
        if (response.data.success) {
          // Set the user data in the Redux store
          dispatch(setCurrentUser(response.data.user));
          // Mark the user as logged in by dispatching the login action
          dispatch(login());
          // Reset local states
          setPassword("");
          setIsPasswordValid(false);
          // setName("");
          // setDateOfBirth("");
          // setGender("");
          // setAvatarURL("");
        }
      } catch (error) {
        console.error("Error creating user:", error);
        alert("Failed to create user. Please try again.");
      }
    }
  };

  const handlePreviousStep = () => {
    dispatch(previousStep());
  };

  const pageTitles = [
    "Welcome! First things first...",
    "Now it’s time to upload a photo!",
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
            name={name}
            dateOfBirth={dateOfBirth}
            gender={gender}
            setName={setName}
            setDateOfBirth={setDateOfBirth}
            setGender={setGender}
          />
        );
      case 1:
        return <SecondStep avatarURL={avatarURL} setAvatarURL={setAvatarURL} />;
      case 2:
        return (
          <ThirdStep
            password={password}
            setPassword={setPassword}
            isPasswordValid={isPasswordValid}
            setIsPasswordValid={setIsPasswordValid}
          />
        );
      default:
        return <LastStep name={name} />;
    }
  };

  useEffect(() => {
    return () => {
      // Clear the registration state when the component unmounts
      dispatch(resetRegistrationState());
    };
  }, [dispatch]);

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
              onClick={handleNextStep}
              disabled={
                (registrationData.currentStep === 1 && !avatarURL) ||
                (registrationData.currentStep === 0 &&
                  (!name || !gender || !dateOfBirth)) ||
                (registrationData.currentStep === 2 && !isPasswordValid)
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
