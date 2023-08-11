import React, { useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { LinkRounded, LinkTwoTone } from "@material-ui/icons";
import { deleteLinkup } from "../api/linkupAPI";
import { Button, Snackbar } from "@material-ui/core";
import moment from "moment";
import { Link } from "react-router-dom";
import nlp from "compromise"; // Import compromise library with its interactive API
const compromise = nlp;

const useStyles = makeStyles((theme) => ({
  postCard: {
    position: "relative",
    backgroundColor: "#fff",
    padding: theme.spacing(2),
    wordWrap: "break-word",
    borderBottom: "1px solid #ccc",
    alignItems: "flex-start",
  },
  postContent: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    wordWrap: "break-word",
  },
  postedText: {
    color: theme.palette.text.secondary,
    marginLeft: "auto",
  },
  postDetails: {
    display: "flex",
    alignItems: "center",
  },
  boldText: {
    fontWeight: "bold",
    color: theme.palette.text.primary,
  },
  iconHeader: {
    display: "flex",
    alignItems: "center",
  },

  avatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%", // Make it circular
    objectFit: "cover", // To maintain the aspect ratio of the image
    marginRight: theme.spacing(1),
  },
  usernameLink: {
    textDecoration: "none",
    color: theme.palette.text.primary,
    fontWeight: "bold",
  },
  checkInButton: {
    marginRight: "auto",
  },
  buttonsContainer: {
    display: "flex",
    marginRight: "auto",
  },
  highlightedPost: {
    backgroundColor: "#f5f8fa", // Background color when highlighted
    transition: "background-color 0.3s ease", // Smooth transition
  },
}));

const PostCard = React.memo(
  ({
    post,
    setShouldFetchLinkups,
    setEditingLinkup,
    setIsEditing,
    isEditing,
  }) => {
    const classes = useStyles();
    const [isHovered, setIsHovered] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [editingLinkupId, setEditingLinkupId] = useState(null); // Initialize with null
    const loggedUser = useSelector((state) => state.loggedUser);

    const {
      id,
      creator_id,
      creator_name,
      location,
      activity,
      gender_preference,
      updated_at,
      date,
      time,
      avatar,
      type,
      notificationText,
    } = post;

    // const convertToDataURL = (avatar) => {
    //   if (avatar) {
    //     if (avatar.type === "Buffer") {
    //       const avatarData = new Uint8Array(avatar.data);
    //       const binary = avatarData.reduce(
    //         (str, byte) => str + String.fromCharCode(byte),
    //         ""
    //       );
    //       return binary;
    //     }
    //   } else {
    //     return "";
    //   }
    // };

    // const avatarUrl = convertToDataURL(avatar);

    const handleEditClick = () => {
      setEditingLinkup(post); // Store the editing linkup's data
      setEditingLinkupId(post.id); // Pass the editing linkup's ID
      setIsEditing(true);
    };

    const handleCancelClick = () => {
      // Implement logic to cancel editing
      setIsEditing(false);
      setEditingLinkupId(null); // Pass the editing linkup's ID
    };

    const handleDeleteClick = async (linkupId) => {
      try {
        const response = await deleteLinkup(linkupId);
        if (response.success) {
          console.log("Link-up deleted successfully");
          // Show success message in Snackbar
          setSnackbarMessage("Link-up deleted successfully");
          setSnackbarOpen(true);
          setShouldFetchLinkups(true);
          // Perform any additional actions you want after successful deletion
        } else {
          console.error("Error deleting link-up:", response.message);
          // Show error message in Snackbar
          setSnackbarMessage("Error deleting link-up: " + response.message);
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("An error occurred:", error);
        // Show error message in Snackbar
        setSnackbarMessage("An error occurred while deleting the link-up");
        setSnackbarOpen(true);
      } finally {
        setIsEditing(false);
        setEditingLinkupId(null);
      }
    };

    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };

    const renderPostText = () => {
      // Use "compromise" to determine if the first word is a verb
      const doc = compromise(activity);
      const startsWithVerb = doc.verbs().length > 0;

      // If activity ends with "ing", consider it as a verb
      const isVerbEndingWithIng = activity.endsWith("ing");

      // Generate post text based on user inputs
      let activityText = "";
      if (activity) {
        if (isVerbEndingWithIng) {
          activityText = `for ${activity}`;
        } else {
          activityText = `${startsWithVerb ? "to" : "for"} ${activity}`;
        }
      }
      const locationText = location ? `at ${location}` : "";
      const dateText = date ? `${moment(date).format("MMM DD, YYYY")}` : "";
      const timeText = time ? `(${time})` : "";
      const genderText = gender_preference
        ? `with a preference for ${gender_preference}`
        : "";

      // Construct the coherent post text
      const postText = (
        <p>
          <Link to={`/profile/${creator_id}`} className={classes.usernameLink}>
            <span className={classes.boldText}>{creator_name}</span>
          </Link>{" "}
          is trying to link up {activityText} {locationText} {dateText}
          {timeText} {genderText}.
        </p>
      );

      return (
        <div className={classes.postContent}>
          {postText}
          {renderCheckInButton()}
        </div>
      );
    };

    const getRedirectPath = () => {
      if (type === "trylink") {
        return `/send-request/${id}`;
      } else {
        return `/linkup-request/${id}`;
      }
    };

    const renderNotificationIcon = () => {
      if (type === "linkup") {
        return <LinkRounded />;
      } else if (type === "trylink") {
        return <LinkTwoTone />;
      }
      return null;
    };

    const renderCheckInButton = () => {
      if (notificationText) {
        return (
          <Button
            variant="contained"
            color="default"
            size="small"
            className={classes.checkInButton}
            component={Link}
            to={getRedirectPath()}
          >
            Check-In
          </Button>
        );
      }
      return null;
    };

    const getTimeAgo = (createdAt) => {
      const now = moment();
      const created = moment(createdAt);
      const duration = moment.duration(now.diff(created));
      const days = duration.days();
      const hours = duration.hours();
      const minutes = duration.minutes();

      if (days > 0) {
        return `${days}d ago`;
      } else if (hours > 0) {
        return `${hours}h ago`;
      } else if (minutes > 0) {
        return `${minutes}m ago`;
      } else {
        return "Just now";
      }
    };

    return (
      <div
        className={`${classes.postCard} ${
          isHovered ? classes.highlightedPost : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={classes.postContent}>
          <div className={classes.iconHeader}>
            {renderNotificationIcon()}
            <img
              className={classes.avatar}
              src={avatar}
              alt="avatar"
              loading="lazy"
            />
            {renderPostText()}
          </div>
          <div className={classes.postDetails}>
            <div className={classes.buttonsContainer}>
              {isEditing && editingLinkupId === post.id ? (
                <Button color="default" onClick={handleCancelClick}>
                  Cancel
                </Button>
              ) : (
                <>
                  {loggedUser?.user.id === creator_id && (
                    <>
                      <Button color="primary" onClick={handleEditClick}>
                        Edit
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => handleDeleteClick(id)}
                      >
                        Delete
                      </Button>
                      <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleSnackbarClose}
                        message={snackbarMessage}
                      />
                    </>
                  )}
                </>
              )}
            </div>
            <p className={classes.postedText}>
              Posted {getTimeAgo(updated_at)}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

export default PostCard;
