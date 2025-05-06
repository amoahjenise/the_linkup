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
  fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif', // Modern sans-serif font
  fontSize: "40px", // Larger title size for emphasis
  fontWeight: "bold", // Bold for prominence, like Netflix
  lineHeight: "1.2", // Tight line height for a clean look
  textTransform: "capitalize", // Capitalize first letter for a polished look
  marginBottom: theme.spacing(4), // Added margin between title and subtitle
}));

const SubTitle = styled("p")(({ theme }) => ({
  fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif', // Consistent font family
  fontSize: "18px", // Smaller subtitle size
  fontWeight: "400", // Lighter weight for subtitles
  lineHeight: "1.6", // A bit more line height for readability
  marginTop: theme.spacing(2), // Space between title and subtitle
  textTransform: "none", // Capitalize first letter for a polished look
}));

const ButtonContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  marginTop: theme.spacing(2),
}));

const BackButton = styled(Button)(({ theme, colorMode }) => ({
  width: "50%",
  color: colorMode === "dark" ? "#fff" : "#000",
  backgroundColor: colorMode === "dark" ? "#424242" : "#f0f0f0", // A neutral background for better aesthetics
  borderRadius: "12px", // Rounded corners for a softer look
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadow for the button
  textTransform: "none", // Disable uppercase transformation for a more natural text
  padding: "12px 24px", // Consistent padding
  transition: "all 0.3s ease", // Smooth transition for hover effect
  "&:hover": {
    backgroundColor: colorMode === "dark" ? "#616161" : "#e0e0e0", // Lighter shade on hover
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)", // Slightly more prominent shadow on hover
  },
  "&:focus": {
    outline: "none", // Remove default focus outline for cleaner appearance
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", // Focus effect with subtle glow
  },
  marginRight: theme.spacing(2),
}));

const ContinueButton = styled(Button)(({ theme, colorMode }) => ({
  width: "50%",
  color: colorMode === "dark" ? "#fff" : "#000",
  backgroundColor: "#009688", // Linkup teal color
  borderRadius: "12px", // Rounded corners for a modern feel
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
  textTransform: "none", // Keep text natural
  padding: "12px 24px", // Maintain consistent padding
  transition: "all 0.3s ease", // Smooth transition for hover effect
  "&:hover": {
    backgroundColor: "#00796b", // Darker teal shade on hover
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)", // Slightly more prominent shadow on hover
  },
  "&.Mui-disabled": {
    backgroundColor: colorMode === "dark" ? "#616161" : "#BDBDBD", // Disabled state color
    color: "#9E9E9E", // Disabled text color
  },
  "&:focus": {
    outline: "none", // Remove focus outline
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", // Focus effect with subtle glow
  },
  marginLeft: theme.spacing(2),
}));

const RegistrationProcess = () => {
  console.log("RegistrationProcess component mounted");
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useUser();
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
          navigate("/home");
          console.log(`Error fetching user data: ${error.message}`);
        }
      }
    };

    checkRegistrationStatus();
  }, [registrationData.isRegistering, userData, user?.id, dispatch, navigate]);

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
    "Your age will be displayed, and your gender will be used for linkup filtering. This can't be changed later.",
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
      <MultiStepProgressBar />
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
