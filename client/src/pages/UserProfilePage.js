import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import ImageGrid from "../components/ImageGrid";
import {
  getUserById,
  updateUserBio,
  updateUserAvatar,
  updateSendbirdUser,
  updateUserName,
} from "../api/usersAPI";
import LoadingSpinner from "../components/LoadingSpinner";
import TopNavBar from "../components/TopNavBar";
import UserProfileEditModal from "../components/UserProfileEditModal";
import { useSnackbar } from "../contexts/SnackbarContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useClerk } from "@clerk/clerk-react";
import { Box, Button } from "@mui/material";
import { useColorMode } from "@chakra-ui/react";
import {
  getUserMedia,
  postInstagramAccessToken,
  getAccessToken,
} from "../api/instagramAPI";
import ProfileBanner from "../components/ProfileBanner";
import ProfileInfoBar from "../components/ProfileInfoBar";

// Extend Day.js with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Styled components
const Container = styled(Box)(({ theme }) => ({
  overflowX: "auto",
  width: "100%",
}));

const Content = styled("div")({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
});

const ImageSection = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "1px",
});

const EditButton = styled(Button)(({ theme, colorMode }) => ({
  color: colorMode === "light" ? "black" : "white",
  borderRadius: "20px",
  padding: theme.spacing(1, 3),
  textTransform: "none",
  border: `1px solid ${
    colorMode === "light" ? "white" : theme.palette.divider
  }`,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
}));

const UserProfilePage = ({ isMobile }) => {
  const { id: userIdParam } = useParams();
  const [state, setState] = useState({
    userData: null,
    profileImages: [],
    isLoading: true,
    isEditModalOpen: false,
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
    const fetchInstagramMedia = async (code) => {
      try {
        const accessToken = await getAccessToken(code);
        await postInstagramAccessToken(userId, accessToken);
        const instagramMediaResponse = await getUserMedia(accessToken);

        if (instagramMediaResponse.success) {
          const instagramImageUrls = instagramMediaResponse.data.data.map(
            (imageObj) => imageObj.media_url
          );
          setState((prevState) => ({
            ...prevState,
            profileImages: instagramImageUrls,
          }));
        }
      } catch (error) {
        console.error("Error fetching Instagram media:", error);
      }
    };

    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      fetchInstagramMedia(code);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [userId]);

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
          isInstagramTokenUpdated: !!instagram_access_token,
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
            setState((prevState) => ({ ...prevState, profileImages }));
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
    console.log("Before toggle:", state.isEditModalOpen); // Debugging line
    setState((prevState) => ({
      ...prevState,
      isEditModalOpen: !prevState.isEditModalOpen,
    }));
    console.log("After toggle:", !state.isEditModalOpen); // Debugging line
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const birthDate = dayjs(dateOfBirth);
    let age = dayjs().diff(birthDate, "year");
    if (
      dayjs().month() < birthDate.month() ||
      (dayjs().month() === birthDate.month() &&
        dayjs().date() < birthDate.date())
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
        <>
          <ProfileBanner
            userData={state.userData}
            userLocation={
              locationState.city && locationState.country
                ? `${locationState.city}, ${locationState.country}`
                : "Unknown Location"
            }
            calculateAge={calculateAge}
            colorMode={colorMode}
          />
          <ProfileInfoBar
            userData={state.userData}
            calculateAge={calculateAge}
            renderEditButton={() =>
              isLoggedUserProfile && (
                <EditButton onClick={toggleEditModal} colorMode={colorMode}>
                  Edit Profile
                </EditButton>
              )
            }
            colorMode={colorMode}
          />
          <Content>
            <ImageSection>
              <ImageGrid
                images={state.profileImages}
                isMobile={isMobile}
                isLoggedUserProfile={isLoggedUserProfile}
              />
            </ImageSection>
          </Content>
        </>
      )}
      {state.isEditModalOpen && (
        <UserProfileEditModal
          isOpen={state.isEditModalOpen}
          userData={state.userData}
          onClose={toggleEditModal}
          onSave={handleSaveChanges}
        />
      )}
    </Container>
  );
};

export default UserProfilePage;
