import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { useClerk } from "@clerk/clerk-react";
import UserProfile from "../components/UserProfile";
import TopNavBar from "../components/TopNavBar";
import {
  getUserById,
  updateUserBio,
  updateUserAvatar,
  updateUserSocialMedia,
  updateSendbirdUser,
  updateUserName,
} from "../api/usersAPI";
import { useSnackbar } from "../contexts/SnackbarContext";

// Styled components (moved outside component for better performance)
const Container = styled(Box)(({ theme }) => ({
  overflow: "hidden",
  height: "100%",
  width: "100%",
  paddingBottom: "5px",
  "@media (max-width: 900px)": {
    paddingBottom: "65px",
  },
}));

// Memoize calculateAge since it's a pure function
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 0;
  const birthDate = dayjs(dateOfBirth);
  const today = dayjs();
  let age = today.diff(birthDate, "year");
  return today.isBefore(birthDate.add(age, "year")) ? age - 1 : age;
};

const UserProfilePage = ({ isMobile }) => {
  // State management
  const [state, setState] = useState({
    userData: null,
    isLoading: true,
    isEditModalOpen: false,
    isSocialMediaModalOpen: false,
    isLinkupsModalOpen: false,
  });

  // Hooks and context
  const { id: userIdParam } = useParams();
  const clerk = useClerk();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addSnackbar } = useSnackbar();
  const loggedUser = useSelector((state) => state.loggedUser);
  const locationState = useSelector((state) => state.location);

  // Derived values
  const userId = userIdParam === "me" ? loggedUser.user.id : userIdParam;
  const isLoggedUserProfile =
    userIdParam === "me" || userIdParam === loggedUser.user.id;
  const userLocation =
    locationState.city && locationState.country
      ? `${locationState.city}, ${locationState.country}`
      : "Unknown Location";

  // Data fetching - O(n) where n is the number of API calls (currently 1)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResponse = await getUserById(userId);
        if (userDataResponse.unauthorizedError) {
          dispatch({ type: "LOGOUT" });
          navigate("/");
          return;
        }

        setState((prev) => ({
          ...prev,
          userData: userDataResponse?.data?.user || {},
          isLoading: false,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchData();
  }, [dispatch, navigate, userId]);

  // Memoized handlers to prevent unnecessary re-renders
  const toggleEditModal = useCallback(() => {
    setState((prev) => ({ ...prev, isEditModalOpen: !prev.isEditModalOpen }));
  }, []);

  const toggleSocialMediaModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSocialMediaModalOpen: !prev.isSocialMediaModalOpen,
    }));
  }, []);

  const toggleLinkupsModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isLinkupsModalOpen: !prev.isLinkupsModalOpen,
    }));
  }, []);

  // O(1) for each comparison, O(n) for API calls where n is number of changed fields
  const handleSaveSocialMediaLinks = useCallback(
    async (links) => {
      const { instagram_url, facebook_url, twitter_url } = links;
      const { userData } = state;

      const hasChanges =
        instagram_url !== userData?.instagram_url ||
        facebook_url !== userData?.facebook_url ||
        twitter_url !== userData?.twitter_url;

      if (!hasChanges) return;

      try {
        const response = await updateUserSocialMedia(userId, links);
        if (response.success) {
          setState((prev) => ({
            ...prev,
            userData: { ...prev.userData, ...links },
          }));
          addSnackbar("Saved", "success");
        } else {
          addSnackbar("Failed to update social media links.", "error");
        }
      } catch (error) {
        console.error("Error saving social media links:", error);
        addSnackbar("Failed to update social media links.", "error");
      }
    },
    [state.userData, userId, addSnackbar]
  );

  // O(n) where n is number of fields being updated (worst case 4 API calls)
  const handleSaveChanges = useCallback(
    async (editedBio, editedAvatar, editedName) => {
      try {
        let changesMade = false;
        const { userData } = state;
        const updates = {};
        let avatarUploadError = null;

        // Helper function to update fields
        const updateField = async (field, newValue, updateFn) => {
          if (userData?.[field] !== newValue && newValue !== undefined) {
            const response = await updateFn(userData?.id, newValue);
            if (response?.data?.success !== false) {
              changesMade = true;
              updates[field] = newValue;
              return true;
            }
          }
          return false;
        };

        // Convert base64 to File if needed
        let avatarFile = null;
        if (editedAvatar && editedAvatar.startsWith("data:image")) {
          avatarFile = await base64ToFile(editedAvatar, "avatar.jpg");
        }

        // Check for changes
        const hasBioChanges =
          editedBio !== undefined && editedBio !== userData?.bio;
        const hasNameChanges =
          editedName !== undefined && editedName !== userData?.name;
        const hasAvatarChanges = avatarFile !== null;

        // Early return if no changes
        if (!hasBioChanges && !hasNameChanges && !hasAvatarChanges) {
          addSnackbar("No changes detected.", "info");
          setState((prev) => ({ ...prev, isEditModalOpen: false }));
          return;
        }

        // Process text updates first
        const updateResults = await Promise.allSettled([
          hasBioChanges && updateField("bio", editedBio, updateUserBio),
          hasNameChanges && updateField("name", editedName, updateUserName),
        ]);

        // Check for text update errors
        const textUpdateErrors = updateResults
          .filter((result) => result.status === "rejected")
          .map((result) => result.reason);

        if (textUpdateErrors.length > 0) {
          throw new Error(
            textUpdateErrors[0].message ||
              "Failed to update profile text fields"
          );
        }

        // Handle avatar upload if needed
        if (hasAvatarChanges && clerk.user) {
          try {
            const response = await clerk.user.setProfileImage({
              file: avatarFile,
            });

            // Verify the image was actually updated
            if (response && response.errors && response.errors.length > 0) {
              avatarUploadError = new Error(
                response.errors[0].message || "Failed to update profile image"
              );
              throw avatarUploadError;
            }

            // Check if the image URL actually changed
            const newAvatarUrl = response.publicUrl;
            if (newAvatarUrl && newAvatarUrl !== userData?.avatar) {
              changesMade = true;
              updates.avatar = newAvatarUrl;
            }
          } catch (error) {
            console.error("Clerk profile image upload error:", {
              error: error.errors || error.message,
              traceId: error.meta?.clerk_trace_id,
            });

            // Only throw if there were no other changes made
            if (!changesMade) {
              throw new Error(
                error.errors?.[0]?.message ||
                  error.message ||
                  "Failed to update profile image"
              );
            }

            // If other changes succeeded, show specific error for avatar
            avatarUploadError = error;
          }
        }

        // Update state if changes were made
        if (changesMade) {
          setState((prev) => ({
            ...prev,
            userData: { ...prev.userData, ...updates },
          }));

          let successMessage = "Profile updated successfully!";
          if (avatarUploadError) {
            successMessage += " (but image update failed)";
          }

          addSnackbar(successMessage, "success");
        }

        setState((prev) => ({ ...prev, isEditModalOpen: false }));

        // Show avatar-specific error if applicable
        if (avatarUploadError && changesMade) {
          addSnackbar(
            `Profile updated but image failed: ${avatarUploadError.message}`,
            "warning"
          );
        }
      } catch (error) {
        console.error("Profile update error:", {
          error: error.message,
          stack: error.stack,
          ...(error.errors && { clerkErrors: error.errors }),
          ...(error.meta && { clerkTraceId: error.meta.clerk_trace_id }),
        });

        addSnackbar(error.message || "Failed to update profile", "error");
      }
    },
    [state.userData, userId, clerk.user, addSnackbar]
  );

  // Helper function to convert base64 to File
  const base64ToFile = (base64, filename) => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  return (
    <Container>
      <TopNavBar title="Profile" />
      <UserProfile
        isMobile={isMobile}
        userData={state.userData}
        calculateAge={calculateAge}
        userLocation={userLocation}
        toggleEditModal={toggleEditModal}
        handleSaveSocialMediaLinks={handleSaveSocialMediaLinks}
        isLoggedUserProfile={isLoggedUserProfile}
        isEditModalOpen={state.isEditModalOpen}
        handleSaveChanges={handleSaveChanges}
        isSocialMediaModalOpen={state.isSocialMediaModalOpen}
        toggleSocialMediaModal={toggleSocialMediaModal}
        isLinkupsModalOpen={state.isLinkupsModalOpen}
        toggleLinkupsModal={toggleLinkupsModal}
        addSnackbar={addSnackbar}
      />
    </Container>
  );
};

export default React.memo(UserProfilePage);
