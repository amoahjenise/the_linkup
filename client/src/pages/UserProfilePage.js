import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import ImageGrid from "../components/ImageGrid";
import { getUserById, updateUserBio, updateUserAvatar } from "../api/usersAPI";
import { getUserImages } from "../api/imagesAPI";
import LoadingSpinner from "../components/LoadingSpinner";
import TopNavBar from "../components/TopNavBar";
import UserProfileEditModal from "../components/UserProfileEditModal";
import { useSnackbar } from "../contexts/SnackbarContext";
import ImageUploadModal from "../components/ImageUploadModal";
import { useColorMode } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileHeaderCard from "../components/ProfileHeaderCard";
import ImageGridHeader from "../components/ImageGridHeader";

const useStyles = makeStyles((theme) => ({
  userProfilePage: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    overflowY: "hidden", // Make only the image section vertically scrollable
  },
  profileSection: {
    display: "flex",
    flexDirection: "column",
  },
  imageSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflowY: "auto", // Make only the image section vertically scrollable
    maxHeight: "60vh", // Limit the height of the image section to 60vh
  },
  editButton: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
  },
}));

const UserProfilePage = ({ isMobile }) => {
  let { id: userId } = useParams();
  const classes = useStyles();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImages, setProfileImages] = useState([]);
  const [isImageUploadModalOpen, setImageUploadModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addSnackbar } = useSnackbar();
  const { colorMode } = useColorMode();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openImageUploadModal = () => {
    setImageUploadModalOpen(true);
  };

  const closeImageUploadModal = () => {
    setImageUploadModalOpen(false);
  };

  // Check if userData is available before accessing its properties
  const isUserDataAvailable = userData !== null;

  // Access user data from Redux store
  const loggedUser = useSelector((state) => state.loggedUser);
  const locationState = useSelector((state) => state.location);

  const isLoggedUserProfile = userId === "me" || userId === loggedUser.user.id;

  if (userId === "me") {
    userId = loggedUser.user.id;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResponse = await getUserById(userId);

        if (userDataResponse.unauthorizedError) {
          dispatch({ type: "LOGOUT" });
          navigate("/");
          return;
        }

        const newUserData = userDataResponse?.data?.user;

        if (newUserData) {
          setUserData(newUserData);
        }

        if (!profileImages.length) {
          const userImagesResponse = await getUserImages(userId);

          if (userImagesResponse.data.success) {
            const imageUrls = userImagesResponse.data.images.map(
              (imageObj) => imageObj.image_url
            );
            setProfileImages(imageUrls);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, navigate, userId, profileImages.length]);

  const renderEditButton = () => {
    if (isLoggedUserProfile) {
      return (
        <IconButton
          className={classes.editButton}
          onClick={() => setIsEditModalOpen(true)}
        >
          <EditIcon />
        </IconButton>
      );
    }
    return null;
  };

  const calculateAge = (dateOfBirth) => {
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      return age;
    }
  };

  const toggleEditModal = () => {
    setIsEditModalOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleSaveChanges = async (editedBio, editedAvatar) => {
    try {
      let bioResponse = null;
      let avatarResponse = null;
      let changesMade = false; // Track whether any changes were made

      if (userData?.bio !== editedBio) {
        // Update the bio if it has changed
        bioResponse = await updateUserBio(userData?.id, editedBio);
        if (bioResponse?.data?.success !== false) {
          changesMade = true;
        }
      }

      if (userData?.avatar !== editedAvatar) {
        // Update the avatar if it has changed
        avatarResponse = await updateUserAvatar(userData?.id, editedAvatar);
        if (avatarResponse?.data?.success !== false) {
          changesMade = true;
        }
      }

      if (changesMade) {
        // Check if any changes were made
        // After a successful update, update userData with the new bio and avatar
        setUserData((prevUserData) => ({
          ...prevUserData,
          bio: bioResponse?.data?.bio,
          avatar: avatarResponse?.data?.avatar || prevUserData.avatar,
        }));
        addSnackbar("Profile updated!");
        setIsEditModalOpen(false);
      } else {
        // No changes were made, display a message and close the modal
        addSnackbar("No changes were made.");
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      addSnackbar(error.message);
    }
  };

  return (
    <div className={classes.userProfilePage}>
      <TopNavBar title="Profile" />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className={classes.profileSection}>
          <ProfileHeaderCard
            isMobile={isMobile}
            userData={userData}
            userLocation={
              locationState.city && locationState.country
                ? `${locationState.city}, ${locationState.country}`
                : "Unknown Location"
            }
            renderEditButton={renderEditButton}
            calculateAge={calculateAge}
          />
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div>
              <ImageGridHeader
                isLoggedUserProfile={isLoggedUserProfile}
                isImageUploadModalOpen={isImageUploadModalOpen}
                openImageUploadModal={openImageUploadModal}
              />
              <div className={classes.imageSection}>
                <ImageGrid
                  images={profileImages || []}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                />
              </div>{" "}
            </div>
          )}
        </div>
      )}
      {/* Render the UserProfileEditModal only if userData is available */}
      {isUserDataAvailable && (
        <UserProfileEditModal
          isOpen={isEditModalOpen}
          onClose={toggleEditModal}
          userData={userData}
          onSave={handleSaveChanges}
          colorMode={colorMode}
        />
      )}
      {/* Render the ImageUploadModal */}
      <ImageUploadModal
        userId={userId}
        isOpen={isImageUploadModalOpen}
        onClose={closeImageUploadModal}
        profileImages={profileImages}
        setProfileImages={setProfileImages}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        colorMode={colorMode}
      />
    </div>
  );
};

export default UserProfilePage;
