import React, { useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { LinkRounded, LinkTwoTone } from "@material-ui/icons";
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
    width: theme.spacing(4),
    height: theme.spacing(4),
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

const PostCard = ({ post }) => {
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Implement logic to save the edited post
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    // Implement logic to cancel editing
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    // Implement logic to delete the post
  };

  const renderPostText = () => {
    if (isEditing) {
      return (
        <div className={classes.postContent}>
          {/* Render input fields for editing */}
          {/* ... (input fields) */}
          <div></div>
        </div>
      );
    }

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
          <Avatar alt={creator_id} src={avatarUrl} className={classes.avatar} />

          {renderPostText()}
        </div>
        <div className={classes.postDetails}>
          <div className={classes.buttonsContainer}>
            {isEditing ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveClick}
                >
                  Save
                </Button>
                <Button color="default" onClick={handleCancelClick}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                {loggedUser?.user.id === creator_id && (
                  <>
                    <Button color="primary" onClick={handleEditClick}>
                      Edit
                    </Button>
                    <Button color="secondary" onClick={handleDeleteClick}>
                      Delete
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
          <p className={classes.postedText}>Posted {getTimeAgo(updated_at)}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
