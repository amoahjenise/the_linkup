import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import MultiStepProgressBar from "../components/MultiStepProgressBar/MultiStepProgressBar";
import { useColorMode } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import {
  nextStep,
  previousStep,
  setIsRegistering,
} from "../redux/actions/registrationActions";
import { login } from "../redux/actions/authActions";
import { setCurrentUser } from "../redux/actions/userActions";
import FirstStep from "../components/ProgressBarSteps/FirstStep";
import SecondStep from "../components/ProgressBarSteps/SecondStep";
import LastStep from "../components/ProgressBarSteps/LastStep";
import { updateUser, getUserByClerkId } from "../api/usersAPI";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    padding: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(8),
    fontSize: "24px",
  },
  subTitle: {
    fontSize: "18px",
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    marginTop: theme.spacing(2),
  },
  backButton: {
    width: "50%",
    border: "1px solid #ccc",
    color: (props) => (props.colorMode === "dark" ? "#fff" : "#000"),
    marginRight: theme.spacing(2),
    "&:hover": {
      backgroundColor: (props) =>
        props.colorMode === "dark" ? "#1976d2" : "#434EA5",
    },
  },
  continueButton: {
    width: "50%",
    border: "1px solid #ccc",
    color: (props) => (props.colorMode === "dark" ? "#fff" : "#000"),
    "&:hover": {
      backgroundColor: (props) =>
        props.colorMode === "dark" ? "#1976d2" : "#434EA5",
    },
    "&.Mui-disabled": {
      color: (props) => (props.colorMode === "dark" ? "#fff" : "#000"),
    },
  },
}));

const RegistrationProcess = () => {
  console.log("RegistrationProcess component mounted");
  const { colorMode } = useColorMode();
  const classes = useStyles({ colorMode });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useUser();

  const registrationData = useSelector((state) => state.registration);
  const [userData, setUserData] = useState({
    dateOfBirth: "",
    gender: "",
    avatarURL: "",
    clerkUserId: "",
  });

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!registrationData.isRegistering) {
        try {
          if (userData?.user?.gender && userData?.user?.date_of_birth) {
            navigate("/home");
            return;
          }
          const response = await getUserByClerkId(user.id);
          if (
            response.success &&
            response.user.gender &&
            response.user.date_of_birth
          ) {
            navigate("/home");
          } else {
            dispatch(setIsRegistering(true));
          }
        } catch (error) {
          alert(`An unknown error occured. Please try again later.`);
          console.log(`Error fetching user data: ${error.message}`);
        }
      }
    };

    checkRegistrationStatus();
  }, []);

  const handleLaunchLuul = async () => {
    try {
      const response = await updateUser({
        user: { ...userData, clerkUserId: user.id },
      });

      dispatch(setCurrentUser(response.data.user));
      dispatch(setIsRegistering(false));
      dispatch(login());
      navigate(`/home`);
    } catch (error) {
      console.error("Error creating user:", error);
      alert("An unknown error has occurred. Please try again later.");
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

  const PageDisplay = () => {
    switch (registrationData.currentStep) {
      case 0:
        return <FirstStep userData={userData} setUserData={setUserData} />;
      case 1:
        return <SecondStep userData={userData} setUserData={setUserData} />;
      default:
        return <LastStep clerkUser={user} />;
    }
  };

  return (
    <div className={classes.root}>
      <MultiStepProgressBar colorMode={colorMode} />
      <div>
        <div className={classes.title}>
          <h1>
            {registrationData.currentStep === pageTitles.length
              ? "Congratulations!"
              : pageTitles[registrationData.currentStep]}
          </h1>
          <p className={classes.subTitle}>
            {pageSubTitles[registrationData.currentStep]}
          </p>
        </div>
        <div>{PageDisplay()}</div>
        <div className={classes.buttonContainer}>
          {registrationData.currentStep > 0 &&
            registrationData.currentStep !== 2 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handlePreviousStep}
                className={classes.backButton}
              >
                Back
              </Button>
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
                (!userData.gender || !userData.dateOfBirth))
            }
            className={classes.continueButton}
          >
            {registrationData.currentStep === 2 ? "Launch LUUL" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationProcess;
