import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ImageGrid from "../components/ImageGrid";
import {
  getUserById,
  updateUserBio,
  updateUserAvatar,
  updateSendbirdUser,
  updateUserName,
} from "../api/usersAPI";
import { getUserMedia } from "../api/instagramAPI";
import LoadingSpinner from "../components/LoadingSpinner";
import TopNavBar from "../components/TopNavBar";
import UserProfileEditModal from "../components/UserProfileEditModal";
import { useSnackbar } from "../contexts/SnackbarContext";
import ProfileHeaderCard from "../components/ProfileHeaderCard";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useClerk } from "@clerk/clerk-react";

// Extend Day.js with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Define styled components
const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  overflowY: "hidden",
});

const ProfileSection = styled("div")({
  display: "flex",
  flexDirection: "column",
  overflowX: "hidden",
});

const ImageSection = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxHeight: "60vh",
  height: "100%",
  marginTop: "1px",
});

const EditButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
}));

const UserProfilePage = ({ isMobile }) => {
  const { id: userIdParam } = useParams();
  const [state, setState] = useState({
    userData: null,
    profileImages: [],
    isLoading: true,
    isEditModalOpen: false,
    isInstagramTokenUpdated: false, // New state to track Instagram token update
  });

  const clerk = useClerk();

  const handleSetProfileImages = (newImages) => {
    setState((prevState) => ({
      ...prevState,
      profileImages: newImages,
    }));
  };

  const { addSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedUser = useSelector((state) => state.loggedUser);
  const locationState = useSelector((state) => state.location);
  const isLoggedUserProfile =
    userIdParam === "me" || userIdParam === loggedUser.user.id;
  const userId = userIdParam === "me" ? loggedUser.user.id : userIdParam;

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
        const { instagram_access_token } = userData;

        let profileImages = [];
        if (instagram_access_token) {
          const instagramMediaResponse = await getUserMedia(
            instagram_access_token
          );
          if (instagramMediaResponse.success) {
            profileImages = instagramMediaResponse.data.data.map(
              (imageObj) => imageObj.media_url
            );
          }
        }

        setState((prevState) => ({
          ...prevState,
          userData,
          profileImages,
          isLoading: false,
          isInstagramTokenUpdated: !!instagram_access_token, // Set to true if token exists
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setState((prevState) => ({ ...prevState, isLoading: false }));
      }
    };

    fetchData();
    return () =>
      setState({
        userData: null,
        profileImages: [],
        isLoading: true,
        isEditModalOpen: false,
        isInstagramTokenUpdated: false,
      });
  }, [dispatch, navigate, userId]);

  useEffect(() => {
    if (state.isInstagramTokenUpdated) {
      const fetchInstagramMedia = async () => {
        try {
          const { instagram_access_token } = state.userData;
          const instagramMediaResponse = await getUserMedia(
            instagram_access_token
          );
          if (instagramMediaResponse.success) {
            const profileImages = instagramMediaResponse.data.data.map(
              (imageObj) => imageObj.media_url
            );
            setState((prevState) => ({
              ...prevState,
              profileImages,
            }));
          }
        } catch (error) {
          console.error("Error fetching Instagram media:", error);
        }
      };

      fetchInstagramMedia();
      setState((prevState) => ({
        ...prevState,
        isInstagramTokenUpdated: false,
      }));
    }
  }, [state.isInstagramTokenUpdated, state.userData]);

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
                [key]: response?.data?.[key] || prevState.userData[key],
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

      if (clerk.user) {
        if (editedAvatar) {
          // Upload the image to Clerk
          await clerk.user
            .setProfileImage({ file: editedAvatar })
            .then((res) => {
              updateSendbirdUser(userId, clerk.user.imageUrl);
              console.log("Profile image uploaded successfully:", res);
            })
            .catch((error) => {
              console.error(
                "An error occurred while uploading the profile image:",
                error.errors
              );
              throw new Error("Failed to upload image");
            });
        }
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

  const toggleEditModal = () =>
    setState((prevState) => ({
      ...prevState,
      isEditModalOpen: !prevState.isEditModalOpen,
    }));

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const birthDate = dayjs(dateOfBirth);
    const now = dayjs();
    let age = now.diff(birthDate, "year");
    if (
      now.month() < birthDate.month() ||
      (now.month() === birthDate.month() && now.date() < birthDate.date())
    ) {
      age -= 1;
    }
    return age;
  };

  return (
    <Container>
      <TopNavBar title="Profile" />
      {state.isLoading ? (
        <LoadingSpinner />
      ) : (
        <ProfileSection>
          <ProfileHeaderCard
            isMobile={isMobile}
            userData={state.userData}
            userLocation={
              locationState.city && locationState.country
                ? `${locationState.city}, ${locationState.country}`
                : "Unknown Location"
            }
            renderEditButton={() =>
              isLoggedUserProfile && (
                <EditButton onClick={toggleEditModal} size="large">
                  <EditIcon />
                </EditButton>
              )
            }
            calculateAge={calculateAge}
            setProfileImages={handleSetProfileImages}
            isLoggedUserProfile={isLoggedUserProfile}
          />
          <ImageSection>
            <ImageGrid
              images={state.profileImages}
              isMobile={isMobile}
              isLoggedUserProfile={isLoggedUserProfile}
            />
          </ImageSection>
        </ProfileSection>
      )}
      {state.userData && (
        <UserProfileEditModal
          isOpen={state.isEditModalOpen}
          onClose={toggleEditModal}
          userData={state.userData}
          onSave={handleSaveChanges}
        />
      )}
    </Container>
  );
};

export default UserProfilePage;
