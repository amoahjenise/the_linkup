import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Cards from "../components/Cards";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import AvatarUpdate from "../components/AvatarUpdate";
import Geocode from "react-geocode";
import { getUserById, updateUserBio } from "../api/usersAPI";
import LoadingSpinner from "../components/LoadingSpinner";
import TopNavBar from "../components/TopNavBar";

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
  },
  profileHeader: {
    display: "flex",
    marginBottom: theme.spacing(8),
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(2),
    },
    backgroundColor: "rgba(207, 217, 222, 0.1)",
    padding: theme.spacing(2),
    borderBottom: "1px solid #e1e8ed",
  },
  commentInput: {
    width: "55vh",
    resize: "none",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  buttonsContainer: {
    gap: theme.spacing(1),
    marginLeft: "auto",
  },
  centeredContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "55%",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  },
  editButton: {
    marginLeft: "auto",
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
  mobileTextArea: {
    padding: theme.spacing(2),
  },
  mobileProfileHeader: {
    padding: theme.spacing(2),
    borderBottom: "1px solid #e1e8ed",
    backgroundColor: "rgba(207, 217, 222, 0.1)",
  },
}));

const UserProfilePage = ({ isMobile }) => {
  let { id: userID } = useParams();
  const classes = useStyles();
  const [isBioEditMode, setIsEditMode] = useState(false);
  const [updatedBio, setUpdatedBio] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoggedUserProfile, setIsLoggedUserProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Access user data from Redux store
  const loggedUser = useSelector((state) => state.loggedUser);

  if (userID === "me") {
    userID = loggedUser.user.id;
  }

  useEffect(() => {
    setIsLoggedUserProfile(userID === "me" || userID === loggedUser.user.id);
    const fetchData = async () => {
      try {
        const response = await getUserById(userID);

        if (response.success) {
          setUserData(response.user);
          setUpdatedBio(response.user.bio);
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
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };
    fetchData();
  }, [loggedUser.user.id, userID, userData?.bio]);

  const mockUserData = {
    profileImages: [
      "https://www.gstatic.com/webp/gallery/3.jpg",
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
            bio: response.data.bio,
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
      <TopNavBar title="Profile" />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className={classes.profileSection}>
          {/* Mobile mode */}
          {isMobile && (
            <>
              {/* Profile header */}
              <div className={classes.mobileProfileHeader}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <AvatarUpdate
                    userId={userData?.id}
                    currentAvatarUrl={userData?.avatar}
                    isLoggedUserProfile={isLoggedUserProfile}
                  />
                  <div className={classes.leftMargin}>
                    {isMobile ? (
                      <div>
                        <h5>
                          {userData?.name},{" "}
                          {calculateAge(userData?.date_of_birth)}{" "}
                        </h5>
                        <span style={{ fontWeight: "normal" }}>
                          <h6>{userLocation}</h6>
                        </span>
                      </div>
                    ) : (
                      <div>
                        <h2>
                          {userData?.name},{" "}
                          {calculateAge(userData?.date_of_birth)}{" "}
                        </h2>
                        <span style={{ fontWeight: "normal" }}>
                          <p>{userLocation}</p>
                        </span>
                      </div>
                    )}
                  </div>{" "}
                  {renderEditButton()}
                </div>
                {/* Bio text area */}
                <div className={classes.mobileTextArea}>
                  {isBioEditMode ? (
                    <textarea
                      autoCapitalize="sentences"
                      autoComplete="on"
                      autoCorrect="on"
                      maxLength="160"
                      name="description"
                      spellCheck="true"
                      dir="auto"
                      style={{ height: "60px", width: "100%" }}
                      value={updatedBio}
                      onChange={(e) =>
                        setUpdatedBio(e.target.value.slice(0, 160))
                      }
                    />
                  ) : (
                    <div>
                      <span style={{ fontWeight: "normal" }}>
                        Bio: {userData?.bio}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Desktop mode */}
          {!isMobile && (
            <>
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
                        {userData?.name},{" "}
                        {calculateAge(userData?.date_of_birth)}
                      </h2>
                      <span style={{ fontWeight: "normal" }}>
                        <p>{userLocation}</p>
                      </span>
                      {isBioEditMode ? (
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <textarea
                            autoCapitalize="sentences"
                            autoComplete="on"
                            autoCorrect="on"
                            maxLength="160"
                            name="description"
                            spellCheck="true"
                            dir="auto"
                            style={{ height: "60px" }}
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
            </>
          )}
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
  );
};

export default UserProfilePage;
