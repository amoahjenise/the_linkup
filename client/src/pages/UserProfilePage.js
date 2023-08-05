import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LeftMenu from "../components/LeftMenu";
import Cards from "../components/Cards";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/reducers/loggedUserReducer";
import { useParams } from "react-router-dom";
import AvatarUpdate from "../components/AvatarUpdate";
import axios from "axios";
import Geocode from "react-geocode";

// Set your Google Maps API key (you need to get one from the Google Cloud Console)
Geocode.setApiKey(process.env.GOOGLE_MAPS_API_KEY);

const userServiceUrl = process.env.REACT_APP_USER_SERVICE_URL;

const drawerWidth = "20%";

const useStyles = makeStyles((theme) => ({
  userProfilePage: {
    display: "flex",
    height: "100vh",
    flexGrow: 1,
  },
  menu: {
    flex: "0 0 " + drawerWidth,
    backgroundColor: "#F8F8FA",
    color: "black",
    padding: theme.spacing(2),
    borderRight: "0.1px solid lightgrey",
  },
  mainSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileAvatar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: theme.spacing(20),
    height: theme.spacing(20),
    border: `2px solid white`,
    borderRadius: "50%",
    margin: "0 auto",
    marginTop: theme.spacing(4),
  },
  commentInput: {
    padding: theme.spacing(2),
    width: "100%",
    resize: "none",
  },
  centeredContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  editButton: {
    marginRight: theme.spacing(2),
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
  buttonsContainer: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1), // Separate buttons
    marginRight: theme.spacing(2),
  },
  leftMargin: {
    marginLeft: theme.spacing(4),
  },
}));

const UserProfilePage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const authParams = useSelector((state) => state.auth);
  const loggedUser = useSelector((state) => state.loggedUser);
  const { id, bio, name, date_of_birth, avatar } = loggedUser.user;
  const loggedInUserId = id;
  // Get id from browser URL
  const { id: userID } = useParams();
  const isLoggedUserProfile = loggedInUserId === userID || userID === "me";
  const [isBioEditMode, setIsEditMode] = useState(false);
  const [updatedBio, setUpdatedBio] = useState(bio);
  const [userLocation, setUserLocation] = useState(null);

  const fetchUserDataFromAPI = useCallback(() => {
    axios
      .get(`${userServiceUrl}/api/getUser`, {
        params: {
          phoneNumber: authParams.phoneNumber,
        },
      })
      .then((response) => {
        const updatedUser = response.data.user;
        // Dispatch the action to update the user data in the Redux store
        dispatch(setCurrentUser(updatedUser));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [authParams.phoneNumber, dispatch]);

  // Use useEffect to fetch user data when the component mounts
  useEffect(() => {
    // Fetch user data from API
    fetchUserDataFromAPI();

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
  }, [fetchUserDataFromAPI]);

  const convertToDataURL = (avatar) => {
    if (avatar) {
      if (avatar.type === "Buffer") {
        const avatarData = new Uint8Array(avatar.data);
        const binary = avatarData.reduce(
          (str, byte) => str + String.fromCharCode(byte),
          ""
        );
        return binary;
      }
    } else {
      return "";
    }
  };

  const avatarUrl = convertToDataURL(avatar);

  const mockUserData = {
    profileImages: [
      "https://www.gstatic.com/webp/gallery/1.jpg",
      "https://www.gstatic.com/webp/gallery/2.jpg",
      "https://www.gstatic.com/webp/gallery/3.jpg",
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
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const toggleEditMode = () => {
    setIsEditMode((prevEditMode) => !prevEditMode);
  };

  const handleSaveChanges = () => {
    // Make the API call to update the user profile
    if (bio !== updatedBio) {
      axios
        .post(`${userServiceUrl}/api/updateUserBio/${loggedInUserId}`, {
          bio: updatedBio,
        })
        .then((response) => {
          // After successful update, fetch the updated user data again
          // to ensure the data is up-to-date in the Redux store
          fetchUserDataFromAPI();
          // Exit edit mode after successful update
          setIsEditMode(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setIsEditMode(false); // Exit edit mode
    }
  };

  const handleCancelChanges = () => {
    // setUpdatedAvatar(avatar);
    setIsEditMode(false);
  };

  return (
    <div>
      <div className={classes.userProfilePage}>
        <LeftMenu />
        <div className={classes.mainSection}>
          <div className={classes.profileHeader}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <AvatarUpdate
                userId={id}
                currentAvatar={avatarUrl}
                className={classes.profileAvatar}
              />
              <div className={classes.leftMargin}>
                <h2>
                  {name}, {calculateAge(date_of_birth)}
                </h2>
                {userLocation ? (
                  <p>{userLocation}</p>
                ) : (
                  <p>Location data not available</p>
                )}
                {isBioEditMode ? (
                  <textarea
                    value={updatedBio}
                    onChange={(e) =>
                      setUpdatedBio(e.target.value.slice(0, 160))
                    }
                    className={classes.commentInput}
                    placeholder="Edit your bio (maximum of 160 characters)..."
                  />
                ) : (
                  <p>{isLoggedUserProfile ? updatedBio : bio}</p>
                  // If it's the logged-in user's profile, show updatedBio, otherwise show bio from the Redux store.
                )}
              </div>
            </div>
            {renderEditButton()}
          </div>
          <div className={classes.centeredContent}>
            <Cards images={mockUserData.profileImages} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
