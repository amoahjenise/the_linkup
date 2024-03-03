import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Cards from "../components/Cards";
import UserAvatar from "../components/UserAvatar";
import Geocode from "react-geocode";
import { getUserById, updateUserBio, updateUserAvatar } from "../api/usersAPI";
import { getUserImages } from "../api/imagesAPI";
import LoadingSpinner from "../components/LoadingSpinner";
import TopNavBar from "../components/TopNavBar";
import UserProfileEditModal from "../components/UserProfileEditModal";
import { useSnackbar } from "../contexts/SnackbarContext";
import ImageUploadModal from "../components/ImageUploadModal";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { useColorMode } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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
    marginTop: theme.spacing(1),
    fontWeight: "bold",
    fontSize: "16px",
    margin: "8px 0",
    lineHeight: "1.4",
    marginLeft: "4px",
  },
  centeredContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // marginTop: "5%",
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
  const { colorMode } = useColorMode();

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

        if (userDataResponse.unauthorizedError) {
          dispatch({ type: "LOGOUT" }); // Dispatch the action to trigger state reset
          navigate("/"); // Redirect to landing page
        }

        if (userDataResponse?.data?.success) {
          setUserData(userDataResponse?.data?.user);
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

        if (userImagesResponse.data.success) {
          // Extract and set the user's image URLs in state
          const imageUrls = userImagesResponse.data.images.map(
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
  }, [dispatch, loggedUser.user.id, navigate, userId]);

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
          bio: bioResponse?.data?.bio || prevUserData.bio,
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
          {/* Profile header */}
          <div
            className={
              isMobile ? classes.mobileProfileHeader : classes.profileHeader
            }
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <UserAvatar userData={userData} width="125px" height="125px" />

              <div className={classes.leftMargin}>
                {isMobile ? (
                  <h5 style={{ fontSize: "26px", marginLeft: "4px" }}>
                    {userData?.name}, {calculateAge(userData?.date_of_birth)}
                  </h5>
                ) : (
                  <h2 style={{ fontSize: "26px", marginLeft: "4px" }}>
                    {userData?.name}, {calculateAge(userData?.date_of_birth)}
                  </h2>
                )}
                <span style={{ fontWeight: "normal" }}>
                  <>
                    <h6>
                      <LocationOnIcon
                        style={{ fontSize: "16px", marginTop: "10px" }}
                      />{" "}
                      {userLocation}
                    </h6>
                  </>
                </span>
                {/* Bio text */}
                <div className={classes.bioText}>
                  <span>{userData?.bio}</span>
                </div>
              </div>
            </div>
            {renderEditButton()}
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className={classes.centeredContent}>
              <Cards
                images={profileImages || []}
                currentImageIndex={currentImageIndex}
                setCurrentImageIndex={setCurrentImageIndex}
                isLoggedUserProfile={isLoggedUserProfile}
                isImageUploadModalOpen={isImageUploadModalOpen}
                openImageUploadModal={openImageUploadModal}
              />
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
