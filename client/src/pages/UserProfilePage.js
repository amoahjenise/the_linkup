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
  updateUserName,
} from "../api/usersAPI";
import { getUserImages } from "../api/imagesAPI";
import LoadingSpinner from "../components/LoadingSpinner";
import TopNavBar from "../components/TopNavBar";
import UserProfileEditModal from "../components/UserProfileEditModal";
import { useSnackbar } from "../contexts/SnackbarContext";
import ImageUploadModal from "../components/ImageUploadModal";
import { useColorMode } from "@chakra-ui/react";
import ProfileHeaderCard from "../components/ProfileHeaderCard";
import ImageGridHeader from "../components/ImageGridHeader";

// Define styled components
const UserProfilePageContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  overflowY: "hidden",
}));

const ProfileSection = styled("div")({
  display: "flex",
  flexDirection: "column",
});

const ImageSection = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflowY: "auto",
  maxHeight: "60vh",
});

const EditButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
}));

const UserProfilePage = ({ isMobile }) => {
  let { id: userId } = useParams();
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

  const isUserDataAvailable = userData !== null;
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
          setUserData((prevUserData) => ({
            ...prevUserData,
            ...newUserData,
          }));
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
    return () => {
      setUserData(null);
    };
  }, [dispatch, navigate, userId, profileImages.length]);

  const renderEditButton = () => {
    if (isLoggedUserProfile) {
      return (
        <EditButton onClick={() => setIsEditModalOpen(true)} size="large">
          <EditIcon />
        </EditButton>
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

  const handleSaveChanges = async (editedBio, editedAvatar, editedName) => {
    try {
      let bioResponse = null;
      let avatarResponse = null;
      let nameResponse = null;
      let changesMade = false;

      if (userData?.bio !== editedBio) {
        bioResponse = await updateUserBio(userData?.id, editedBio);
        if (bioResponse?.data?.success !== false) {
          changesMade = true;
        }
      }

      if (userData?.avatar !== editedAvatar) {
        avatarResponse = await updateUserAvatar(userData?.id, editedAvatar);
        if (avatarResponse?.data?.success !== false) {
          changesMade = true;
        }
      }

      if (userData?.name !== editedName) {
        nameResponse = await updateUserName(userData?.id, editedName);
        if (nameResponse?.data?.success !== false) {
          changesMade = true;
        }
      }

      if (changesMade) {
        setUserData((prevUserData) => ({
          ...prevUserData,
          bio: bioResponse?.data?.bio || prevUserData.bio,
          avatar: avatarResponse?.data?.avatar || prevUserData.avatar,
          name: nameResponse?.data?.name || prevUserData.name,
        }));
        addSnackbar("Profile updated!");
      } else {
        addSnackbar("No changes were made.");
      }

      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
      addSnackbar(error.message);
    }
  };

  return (
    <UserProfilePageContainer>
      <TopNavBar title="Profile" />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ProfileSection>
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
              {isLoggedUserProfile && (
                <ImageGridHeader
                  isImageUploadModalOpen={isImageUploadModalOpen}
                  openImageUploadModal={openImageUploadModal}
                />
              )}
              <ImageSection>
                <ImageGrid
                  images={profileImages || []}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                />
              </ImageSection>
            </div>
          )}
        </ProfileSection>
      )}
      {isUserDataAvailable && (
        <UserProfileEditModal
          isOpen={isEditModalOpen}
          onClose={toggleEditModal}
          userData={userData}
          onSave={handleSaveChanges}
          colorMode={colorMode}
        />
      )}
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
    </UserProfilePageContainer>
  );
};

export default UserProfilePage;
