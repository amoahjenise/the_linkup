import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import {
  getUserById,
  updateUserBio,
  updateUserAvatar,
  updateUserSocialMedia,
  updateSendbirdUser,
  updateUserName,
} from "../api/usersAPI";
import { useSnackbar } from "../contexts/SnackbarContext";
import dayjs from "dayjs";
import { useClerk } from "@clerk/clerk-react";
import { useColorMode } from "@chakra-ui/react";
import TopNavBar from "../components/TopNavBar";

// Styled components
const Container = styled(Box)(({ theme }) => ({
  overflow: "hidden", // Allow vertical scrolling only if content overflows
  height: "100%", // Make container occupy full viewport height
  width: "100%", // Ensure it takes up full width
  paddingBottom: "5px", // Add padding for footer
  "@media (max-width: 900px)": {
    paddingBottom: "65px", // Add padding for footer
  },
}));

const UserProfilePage = ({ isMobile }) => {
  const { id: userIdParam } = useParams();
  const [state, setState] = useState({
    userData: null,
    profileImages: [],
    isLoading: true,
    isEditModalOpen: false,
    isSocialMediaModalOpen: false, // Add state for SocialMediaLinks modal
    isInstagramTokenUpdated: false,
  });

  const clerk = useClerk();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { addSnackbar } = useSnackbar();

  const loggedUser = useSelector((state) => state.loggedUser);
  const locationState = useSelector((state) => state.location);
  const userId = userIdParam === "me" ? loggedUser.user.id : userIdParam;
  const isLoggedUserProfile =
    userIdParam === "me" || userIdParam === loggedUser.user.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResponse = await getUserById(userId);
        if (userDataResponse.unauthorizedError) {
          dispatch({ type: "LOGOUT" });
          navigate("/");
          return;
        }

        const userData = userDataResponse?.data?.user || {};
        setState((prevState) => ({
          ...prevState,
          userData,
          isLoading: false,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setState((prevState) => ({ ...prevState, isLoading: false }));
      }
    };

    fetchData();
  }, [dispatch, navigate, userId]);

  const handleSaveSocialMediaLinks = async (links) => {
    try {
      const hasChanges =
        links.instagram_url !== state.userData?.instagram_url ||
        links.facebook_url !== state.userData?.facebook_url ||
        links.twitter_url !== state.userData?.twitter_url;

      if (!hasChanges) {
        return;
      }

      const response = await updateUserSocialMedia(userId, links);
      if (response.success) {
        setState((prevState) => ({
          ...prevState,
          userData: { ...prevState.userData, ...links },
        }));
        addSnackbar("Saved", "success");
      } else {
        addSnackbar("Failed to update social media links.", "error");
      }
    } catch (error) {
      console.error("Error saving social media links:", error);
      addSnackbar("Failed to update social media links.", "error");
    }
  };

  const handleSaveChanges = async (editedBio, editedAvatar, editedName) => {
    try {
      let changesMade = false;
      const updateIfChanged = async (field, newValue, updateFn, key) => {
        if (state.userData?.[field] !== newValue) {
          const response = await updateFn(state.userData?.id, newValue);
          if (response?.data?.success !== false) {
            changesMade = true;
            setState((prevState) => ({
              ...prevState,
              userData: {
                ...prevState.userData,
                [key]: newValue, // Immediately update the state with new value
              },
            }));
          }
        }
      };

      await Promise.all([
        updateIfChanged("bio", editedBio, updateUserBio, "bio"),
        updateIfChanged("avatar", editedAvatar, updateUserAvatar, "avatar"),
        updateIfChanged("name", editedName, updateUserName, "name"),
      ]);

      if (clerk.user && editedAvatar) {
        await clerk.user
          .setProfileImage({ file: editedAvatar })
          .then(() => updateSendbirdUser(userId, clerk.user.imageUrl))
          .catch((error) => {
            console.error("Error uploading profile image:", error.errors);
            throw new Error("Failed to upload image");
          });
      }

      addSnackbar(
        changesMade ? "Profile updated successfully!" : "No changes detected.",
        changesMade ? "success" : "info"
      );
      setState((prevState) => ({ ...prevState, isEditModalOpen: false }));
    } catch (error) {
      console.error("Error saving changes:", error);
      addSnackbar("Failed to update profile.", "error");
    }
  };

  const toggleEditModal = () => {
    setState((prevState) => ({
      ...prevState,
      isEditModalOpen: !prevState.isEditModalOpen,
    }));
  };

  // Toggle Social Media Modal
  const toggleSocialMediaModal = () => {
    setState((prevState) => ({
      ...prevState,
      isSocialMediaModalOpen: !prevState.isSocialMediaModalOpen,
    }));
  };

  // Toggle Linkups Modal
  const toggleLinkupsModal = () => {
    setState((prevState) => ({
      ...prevState,
      isLinkupsModalOpen: !prevState.isLinkupsModalOpen,
    }));
  };

  // Function to calculate user's age
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;

    const birthDate = dayjs(dateOfBirth);
    const today = dayjs();

    let age = today.diff(birthDate, "year");

    if (today.isBefore(birthDate.add(age, "year"))) {
      age -= 1;
    }

    return age;
  };

  return (
    <Container>
      <TopNavBar title="Profile" />
      <UserProfile
        isMobile={isMobile}
        userData={state.userData}
        calculateAge={calculateAge}
        userLocation={
          locationState.city && locationState.country
            ? `${locationState.city}, ${locationState.country}`
            : "Unknown Location"
        }
        toggleEditModal={toggleEditModal}
        handleSaveSocialMediaLinks={handleSaveSocialMediaLinks}
        isLoggedUserProfile={isLoggedUserProfile}
        isEditModalOpen={state.isEditModalOpen}
        handleSaveChanges={handleSaveChanges}
        isSocialMediaModalOpen={state.isSocialMediaModalOpen}
        toggleSocialMediaModal={toggleSocialMediaModal}
        isLinkupsModalOpen={state.isLinkupsModalOpen} // Pass Linkups modal state
        toggleLinkupsModal={toggleLinkupsModal} // Pass Linkups modal toggle function
        addSnackbar={addSnackbar}
      />
    </Container>
  );
};

export default UserProfilePage;
