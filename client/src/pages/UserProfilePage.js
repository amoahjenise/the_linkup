import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import LeftMenu from "../components/LeftMenu";
import Cards from "../components/Cards";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import { useParams } from "react-router-dom";
import AvatarUpdate from "../components/AvatarUpdate";
import Geocode from "react-geocode";
import { getUserById, updateUserBio } from "../api/usersAPI"; // Assuming you have an API function to fetch user data
import LoadingSpinner from "../components/LoadingSpinner";
import TopNavBar from "../components/TopNavBar";

// Set your Google Maps API key (you need to get one from the Google Cloud Console)
Geocode.setApiKey(process.env.GOOGLE_MAPS_API_KEY);

const drawerWidth = "20%";

const useStyles = makeStyles((theme) => ({
  userProfilePage: {
    display: "flex",
    height: "100vh",
    flexGrow: 1,
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    maxWidth: `calc(100% - 2.5 * ${drawerWidth})`,
    width: "100%",
    borderRight: "1px solid #e1e8ed",
  },
  profileSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  profileHeader: {
    display: "flex",
    marginBottom: theme.spacing(8),
    backgroundColor: "rgba(207, 217, 222, 0.1)",
    padding: theme.spacing(2),
  },
  commentInput: {
    width: "55vh", // Set width to 100%
    resize: "none",
  },
  buttonsContainer: {
    gap: theme.spacing(1),
    marginLeft: "auto", // Pushes buttons to the right
  },
  centeredContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  editButton: {
    marginLeft: "auto", // Pushes buttons to the right
    cursor: "pointer",
  },
  saveButton: {
    width: "fit-content",
    fontSize: "14px",
  },
  cancelButton: {
    width: "fit-content",
    fontSize: "14px",
  },

  leftMargin: {
    marginLeft: theme.spacing(4),
  },
}));

const UserProfilePage = () => {
  let { id: userID } = useParams();
  const classes = useStyles();
  const [isBioEditMode, setIsEditMode] = useState(false);
  const [updatedBio, setUpdatedBio] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [userData, setUserData] = useState(null); // State to hold fetched user data
  const [isLoggedUserProfile, setIsLoggedUserProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Access user data from Redux store
  const loggedUser = useSelector((state) => state.loggedUser);

  if (userID === "me") {
    userID = loggedUser.user.id;
  }

  useEffect(() => {
    // Check if the id of the user visiting the profile is the same as the logged user id
    setIsLoggedUserProfile(userID === "me" || userID === loggedUser.user.id);
    const fetchData = async () => {
      try {
        // Fetch user data from API
        const response = await getUserById(userID);

        if (response.success) {
          setUserData(response.user); // Store the fetched user data
          setUpdatedBio(response.user.bio);
        }

        // Fetch the user's current location using geolocation API
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            // Use reverse geocoding to get the city and country
            Geocode.fromLatLng(latitude, longitude).then(
              (response) => {
                const address = response.results[0].formatted_address;
                // Update the userLocation state with the city and country
                setUserLocation(address);
              },
              (error) => {
                console.error(error);
                // If reverse geocoding fails, set a default location or show an error message
                setUserLocation("Unknown Location");
              }
            );
          },
          (error) => {
            console.error(error);
            // If geolocation fails, set a default location or show an error message
            setUserLocation("Unknown Location");
          }
        );
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 300); // Delay setting loading state to false by 300 milliseconds
      }
    };
    fetchData();
  }, [loggedUser.user.id, userID, userData?.bio]);

  const mockUserData = {
    profileImages: [
      "https://www.gstatic.com/webp/gallery/5.jpg",
      "https://www.gstatic.com/webp/gallery/1.jpg",
      "https://www.gstatic.com/webp/gallery/4.jpg",
    ],
  };

  const renderEditButton = () => {
    if (isLoggedUserProfile) {
      if (isBioEditMode) {
        return (
          <div className={classes.buttonsContainer}>
            <IconButton
              className={classes.saveButton}
              onClick={handleSaveChanges}
            >
              <SaveIcon />
            </IconButton>
            <IconButton
              className={classes.cancelButton}
              onClick={handleCancelChanges}
            >
              <CloseIcon />
            </IconButton>
          </div>
        );
      } else {
        return (
          <EditIcon className={classes.editButton} onClick={toggleEditMode} />
        );
      }
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

  const toggleEditMode = () => {
    setIsEditMode((prevEditMode) => !prevEditMode);
  };

  const handleSaveChanges = async () => {
    // Make the API call to update the user profile
    if (userData?.bio !== updatedBio) {
      try {
        const response = await updateUserBio(userData?.id, updatedBio);

        if (response.success) {
          // After successful update, update userData with the new bio
          setUserData((prevUserData) => ({
            ...prevUserData,
            bio: response.bio,
          }));
          // After successful update, exit edit mode

          setIsEditMode(false);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsEditMode(false);
    }
  };

  const handleCancelChanges = () => {
    setUpdatedBio(userData?.bio);
    setIsEditMode(false);
  };

  return (
    <div className={classes.userProfilePage}>
      <LeftMenu />

      <div className={classes.mainContainer}>
        <TopNavBar title="Profile" />
        <div className={classes.profileSection}>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className={classes.profileHeader}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <AvatarUpdate
                  userId={userData?.id}
                  currentAvatarUrl={userData?.avatar}
                  isLoggedUserProfile={isLoggedUserProfile}
                />
                <div className={classes.leftMargin}>
                  <h2>
                    {userData?.name}, {calculateAge(userData?.date_of_birth)}
                  </h2>
                  <span style={{ fontWeight: "normal" }}>
                    <p>{userLocation}</p>
                  </span>
                  {isBioEditMode ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <textarea
                        value={updatedBio}
                        onChange={(e) =>
                          setUpdatedBio(e.target.value.slice(0, 160))
                        }
                        className={classes.commentInput}
                        placeholder="Edit your bio (maximum of 160 characters)..."
                      />
                    </div>
                  ) : (
                    <div>
                      {" "}
                      <span style={{ fontWeight: "normal" }}>
                        Bio: {userData?.bio}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {renderEditButton()}
            </div>
          )}
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className={classes.centeredContent}>
              <Cards images={mockUserData.profileImages} />
            </div>
          )}
        </div>
        <div style={{ flex: 2 }} />
      </div>
    </div>
  );
};

export default UserProfilePage;
