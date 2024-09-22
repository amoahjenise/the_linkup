import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import MultiStepProgressBar from "../components/MultiStepProgressBar/MultiStepProgressBar";
import { useColorMode } from "@chakra-ui/react";
import { useUser, useClerk } from "@clerk/clerk-react";
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

// Styled components
const Root = styled("div")(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(2),
}));

const Title = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(8),
  fontSize: "24px",
}));

const SubTitle = styled("p")(({ theme }) => ({
  fontSize: "18px",
  marginBottom: theme.spacing(2),
}));

const ButtonContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  marginTop: theme.spacing(2),
}));

const BackButton = styled(Button)(({ theme, colorMode }) => ({
  width: "50%",
  border: "1px solid #ccc",
  color: colorMode === "dark" ? "#fff" : "#000",
  marginRight: theme.spacing(2),
  "&:hover": {
    backgroundColor: colorMode === "dark" ? "#1976d2" : "#434EA5",
  },
}));

const ContinueButton = styled(Button)(({ theme, colorMode }) => ({
  width: "50%",
  border: "1px solid #ccc",
  color: colorMode === "dark" ? "#fff" : "#000",
  "&:hover": {
    backgroundColor: colorMode === "dark" ? "#1976d2" : "#434EA5",
  },
  "&.Mui-disabled": {
    color: colorMode === "dark" ? "#fff" : "#000",
  },
}));

const RegistrationProcess = () => {
  console.log("RegistrationProcess component mounted");
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useUser();
  console.log("User from Clerk:", user);
  const clerk = useClerk();
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
          if (!user) {
            console.error("User is not defined");
            return;
          }

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
          alert(`An unknown error occurred. Please try again later.`);
          console.log(`Error fetching user data: ${error.message}`);
        }
      }
    };

    checkRegistrationStatus();
  }, [registrationData.isRegistering, userData, user, dispatch, navigate]);

  const handleLaunchingLinkup = async () => {
    try {
      if (clerk.user) {
        if (userData.avatarURL) {
          // Upload the image to Clerk
          await clerk.user
            .setProfileImage({ file: userData.avatarURL })
            .then((res) =>
              console.log("Profile image uploaded successfully:", res)
            )
            .catch((error) => {
              console.error(
                "An error occurred while uploading the profile image:",
                error.errors
              );
              throw new Error("Failed to upload image");
            });
        }
      }

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
    "You've completed the registration, you can start using The Linkup!",
  ];

  const pageSubTitles = [
    "This is how you’ll appear on The Linkup. You won't be able to change this later.",
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
    <Root>
      <MultiStepProgressBar colorMode={colorMode} />
      <div>
        <Title>
          <h1>
            {registrationData.currentStep === pageTitles.length
              ? "Congratulations!"
              : pageTitles[registrationData.currentStep]}
          </h1>
          <SubTitle>{pageSubTitles[registrationData.currentStep]}</SubTitle>
        </Title>
        <div>{PageDisplay()}</div>
        <ButtonContainer>
          {registrationData.currentStep > 0 &&
            registrationData.currentStep !== 2 && (
              <BackButton
                variant="contained"
                color="primary"
                onClick={handlePreviousStep}
                colorMode={colorMode}
              >
                Back
              </BackButton>
            )}
          <ContinueButton
            variant="contained"
            color="primary"
            onClick={
              registrationData.currentStep === 2
                ? handleLaunchingLinkup
                : handleNextStep
            }
            disabled={
              (registrationData.currentStep === 1 && !userData.avatarURL) ||
              (registrationData.currentStep === 0 &&
                (!userData.gender || !userData.dateOfBirth))
            }
            colorMode={colorMode}
          >
            {registrationData.currentStep === 2
              ? "Launch The Linkup"
              : "Continue"}
          </ContinueButton>
        </ButtonContainer>
      </div>
    </Root>
  );
};

export default RegistrationProcess;
