import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Cards from "../components/Cards";
import EditIcon from "@material-ui/icons/Edit";
import Geocode from "react-geocode";
import { getUserById, updateUserBio, updateUserAvatar } from "../api/usersAPI";
import { getUserImages } from "../api/imagesAPI";
import LoadingSpinner from "../components/LoadingSpinner";
import TopNavBar from "../components/TopNavBar";
import UserProfileEditModal from "../components/UserProfileEditModal";
import { useSnackbar } from "../contexts/SnackbarContext";
import ImageUploadModal from "../components/ImageUploadModal";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import LocationOnIcon from "@material-ui/icons/LocationOn";

Geocode.setApiKey(process.env.GOOGLE_MAPS_API_KEY);

const useStyles = makeStyles((theme) => ({
  userProfilePage: {
    display: "flex",
    flexDirection: "column",
    width: "55%",
    borderRight: "1px solid #e1e8ed",
    overflowX: "hidden",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  profileSection: {
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
  },
  profileHeader: {
    display: "flex",
    backgroundColor: "rgba(207, 217, 222, 0.1)",
    padding: theme.spacing(1),
    borderBottom: "1px solid #e1e8ed",
  },
  bioText: {
    fontWeight: "normal",
    fontSize: "14px",
    color: "#555",
    margin: "8px 0",
    lineHeight: "1.4",
  },
  largeAvatar: {
    width: "125px",
    height: "125px",
  },
  centeredContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  },
  cameraIconContainer: {
    position: "relative", // Make the container relative
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(2),
  },
  cameraIcon: {
    position: "absolute", // Position the camera icon absolutely
    bottom: "89%", // Adjust bottom positioning as needed
    right: "23%", // Adjust right positioning as needed
    border: "1px solid #e1e8ed",
    backgroundColor: theme.palette.primary.contrastText,
    zIndex: 1,
    transition: "background-color 0.4s ease",
    "&:hover": {
      backgroundColor: "lightgray",
    },
  },

  leftMargin: {
    marginLeft: theme.spacing(4),
  },
  mobileProfileHeader: {
    padding: theme.spacing(2),
    borderBottom: "1px solid #e1e8ed",
    backgroundColor: "rgba(207, 217, 222, 0.1)",
  },
  editButton: {
    width: "fit-content",
    height: "fit-content",
    marginLeft: "auto", // Add spacing to separate from name and age
  },
}));

const UserProfilePage = ({ isMobile }) => {
  let { id: userId } = useParams();
  const classes = useStyles();
  const [userLocation, setUserLocation] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImages, setProfileImages] = useState([]);
  const [isImageUploadModalOpen, setImageUploadModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addSnackbar } = useSnackbar();

  const openImageUploadModal = () => {
    setImageUploadModalOpen(true);
  };

  const closeImageUploadModal = () => {
    setImageUploadModalOpen(false);
  };

  // State for controlling the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Check if userData is available before accessing its properties
  const isUserDataAvailable = userData !== null;

  // Access user data from Redux store
  const loggedUser = useSelector((state) => state.loggedUser);

  const isLoggedUserProfile = userId === "me" || userId === loggedUser.user.id;

  if (userId === "me") {
    userId = loggedUser.user.id;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userDataResponse = await getUserById(userId);

        if (userDataResponse.success) {
          setUserData(userDataResponse.user);
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            Geocode.fromLatLng(latitude, longitude).then(
              (response) => {
                const address = response.results[0].formatted_address;
                setUserLocation(address);
              },
              (error) => {
                console.error(error);
                setUserLocation("Unknown Location");
              }
            );
          },
          (error) => {
            console.error(error);
            setUserLocation("Unknown Location");
          }
        );

        // Fetch user images
        const userImagesResponse = await getUserImages(userId);

        if (userImagesResponse.success) {
          // Extract and set the user's image URLs in state
          const imageUrls = userImagesResponse.images.map(
            (imageObj) => imageObj.image_url
          );
          setProfileImages(imageUrls);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };

    fetchData();
  }, [loggedUser.user.id, userId]);

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

  const renderUploadPicturesButton = () => {
    if (isLoggedUserProfile && !isImageUploadModalOpen) {
      return (
        <IconButton
          className={classes.cameraIcon}
          component="span"
          aria-label="Upload Avatar"
          onClick={openImageUploadModal}
        >
          <PhotoCameraIcon />
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

      if (userData?.bio !== editedBio) {
        // Update the bio if it has changed
        bioResponse = await updateUserBio(userData?.id, editedBio);
      }

      if (userData?.avatar !== editedAvatar) {
        // Update the avatar if it has changed
        avatarResponse = await updateUserAvatar(userData?.id, editedAvatar);
      }

      if (
        (bioResponse?.success || avatarResponse?.success) &&
        bioResponse?.success !== false &&
        avatarResponse?.success !== false
      ) {
        // After a successful update, update userData with the new bio and avatar
        setUserData((prevUserData) => ({
          ...prevUserData,
          bio: bioResponse?.data?.bio || prevUserData.bio,
          avatar: avatarResponse?.data?.avatar || prevUserData.avatar,
        }));
        addSnackbar("Profile updated!");
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
          {/* Profile header */}
          <div
            className={
              isMobile ? classes.mobileProfileHeader : classes.profileHeader
            }
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                alt={userData?.name}
                src={userData?.avatar}
                className={classes.largeAvatar}
              />
              <div className={classes.leftMargin}>
                {isMobile ? (
                  <h5>
                    {userData?.name}, {calculateAge(userData?.date_of_birth)}
                  </h5>
                ) : (
                  <h2>
                    {userData?.name}, {calculateAge(userData?.date_of_birth)}
                  </h2>
                )}
                <span style={{ fontWeight: "normal" }}>
                  {isMobile ? (
                    <>
                      <h6>
                        {" "}
                        <LocationOnIcon style={{ fontSize: "16px" }} />{" "}
                        {userLocation}
                      </h6>
                    </>
                  ) : (
                    <>
                      <p>
                        <LocationOnIcon style={{ fontSize: "16px" }} />{" "}
                        {userLocation}
                      </p>
                    </>
                  )}
                </span>
                {/* Bio text */}
                <div>
                  <span className={classes.bioText}>{userData?.bio}</span>
                </div>
              </div>
            </div>
            {renderEditButton()}
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className={classes.cameraIconContainer}>
              {renderUploadPicturesButton()}
              <div className={classes.centeredContent}>
                <Cards
                  images={profileImages || []}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                />
              </div>
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
      />
    </div>
  );
};

export default UserProfilePage;
