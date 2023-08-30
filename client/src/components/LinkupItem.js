import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { LinkRounded, LinkTwoTone } from "@material-ui/icons";
import { Button, Modal } from "@material-ui/core";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  clearEditingLinkup,
  setEditingLinkup,
} from "../redux/actions/editingLinkupActions";
import { useSnackbar } from "../contexts/SnackbarContext";
import Avatar from "@material-ui/core/Avatar";
import { deleteLinkup } from "../api/linkupAPI";
import nlp from "compromise";
const compromise = nlp;

const useStyles = makeStyles((theme) => ({
  linkupItem: {
    position: "relative",
    backgroundColor: "#fff",
    padding: theme.spacing(2),
    wordWrap: "break-word",
    borderBottom: "1px solid #ccc",
    alignItems: "flex-start",
  },
  linkupItemContent: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    wordWrap: "break-word",
  },
  linkupItemText: {
    color: theme.palette.text.secondary,
    marginLeft: "auto",
  },
  linkupItemDetails: {
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
    border: "1px solid #e1e8ed",
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
  highlightedLinkupItem: {
    backgroundColor: "#f5f8fa", // Background color when highlighted
    transition: "background-color 0.3s ease", // Smooth transition
  },
  deleteModal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
    width: "300px", // Adjust the width as needed
    textAlign: "center",
  },
  editButton: {
    color: theme.palette.primary.contrastText,
    marginRight: theme.spacing(1),
    boxShadow: theme.shadows[1],
  },
  cancelButton: {
    color: theme.palette.primary.contrastText,
    marginRight: theme.spacing(1),
    boxShadow: theme.shadows[1],
  },
  deleteButton: {
    color: theme.palette.primary.contrastText,
    boxShadow: theme.shadows[1],
    border: "1px solid #f5f8fa",
  },
  requestButton: {
    backgroundColor: theme.palette.background.paper,
  },
  requestButtonDisabled: {
    backgroundColor: theme.palette.grey[300], // Disabled button color
    color: theme.palette.text.primary,
  },
}));

const LinkupItem = React.memo(
  ({ linkupItem, setShouldFetchLinkups, disableRequest }) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
    const loggedUser = useSelector((state) => state.loggedUser);
    const editingLinkup = useSelector((state) => state.editingLinkup);
    const { addSnackbar } = useSnackbar();
    const {
      id,
      creator_id,
      creator_name,
      location,
      activity,
      created_at,
      date,
      avatar,
      type,
    } = linkupItem;

    const handleEditClick = () => {
      dispatch(setEditingLinkup(linkupItem, true));
    };

    const handleCancelClick = () => {
      dispatch(clearEditingLinkup());
    };

    const handleDeleteConfirm = async () => {
      try {
        const response = await deleteLinkup(id);
        if (response.success) {
          addSnackbar("Link-up deleted successfully!");
          setShouldFetchLinkups(true);
        } else {
          console.error("Error deleting link-up:", response.message);
          addSnackbar("Error deleting link-up: " + response.message);
        }
      } catch (error) {
        console.error("An error occurred:", error);
        addSnackbar("An error occurred while deleting the link-up");
      } finally {
        setShowDeleteModal(false); // Close the delete confirmation modal
      }
    };

    const handleDeleteClick = async (linkupId) => {
      setShowDeleteModal(true); // Show the delete confirmation modal
    };

    const handleDeleteCancel = () => {
      setShowDeleteModal(false); // Close the delete confirmation modal
    };

    const renderLinkupItemText = () => {
      const doc = compromise(activity);
      const startsWithVerb = doc.verbs().length > 0;
      const isVerbEndingWithIng = activity.endsWith("ing");

      let activityText = "";
      if (activity) {
        if (isVerbEndingWithIng) {
          activityText = `for ${activity}`;
        } else {
          activityText = `${startsWithVerb ? "to" : "for"} ${activity}`;
        }
      }
      const dateText = date ? `${moment(date).format("MMM DD, YYYY")}` : "";
      const timeText = date ? `(${moment(date).format("h:mm A")})` : "";

      // Capitalize the first letter of each word in the location
      const formattedLocation = location
        .toLowerCase() // Convert to lowercase
        .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase()); // Capitalize first letter of each word

      const linkupItemText = (
        <p>
          <Link to={`/profile/${creator_id}`} className={classes.usernameLink}>
            <span className={classes.boldText}>
              <u>{creator_name}</u>
            </span>
          </Link>{" "}
          is trying to link up{" "}
          <span className={classes.boldText}>{activityText.toLowerCase()}</span>{" "}
          {/* at <span className={classes.boldText}>{formattedLocation}</span>  */}
          on{" "}
          <span className={classes.boldText}>
            {dateText} {timeText}
          </span>
          .
        </p>
      );

      return linkupItemText;
    };

    const handleRequestClick = () => {
      navigate(`/send-request/${id}`);
    };

    const renderNotificationIcon = () => {
      if (type === "linkup") {
        return <LinkRounded />;
      } else if (type === "trylink") {
        return <LinkTwoTone />;
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
        className={`${classes.linkupItem} ${
          isHovered ||
          (editingLinkup.isEditing && linkupItem.id === editingLinkup.linkup.id)
            ? classes.highlightedLinkupItem
            : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={classes.linkupItemContent}>
          <div className={classes.iconHeader}>
            {renderNotificationIcon()}
            <Avatar alt="Avatar" src={avatar} className={classes.avatar} />
          </div>
          {renderLinkupItemText()}

          <div className={classes.linkupItemDetails}>
            {/* Use the Link component to navigate to SendRequestPage */}
            {loggedUser.user.id !== linkupItem.creator_id && (
              <div className={classes.buttonsContainer}>
                <Button
                  variant="contained"
                  size="small"
                  className={
                    disableRequest
                      ? classes.requestButtonDisabled
                      : classes.requestButton
                  }
                  onClick={handleRequestClick}
                  disabled={disableRequest}
                >
                  {disableRequest ? "Request Sent" : "Request"}
                </Button>
              </div>
            )}

            <div className={classes.buttonsContainer}>
              {editingLinkup.isEditing &&
              editingLinkup.linkup.id === linkupItem.id ? (
                <Button
                  color="default"
                  size="small"
                  onClick={handleCancelClick}
                  className={classes.cancelButton}
                >
                  Cancel
                </Button>
              ) : (
                <>
                  {loggedUser?.user.id === creator_id &&
                    !editingLinkup.isEditing && (
                      // Disabling buttons for other link-ups during editing
                      <div className={classes.buttonsContainer}>
                        <Button
                          color="primary"
                          size="small"
                          onClick={handleEditClick}
                          className={classes.editButton}
                        >
                          Edit
                        </Button>
                        <Button
                          color="secondary"
                          size="small"
                          onClick={handleDeleteClick}
                          className={classes.deleteButton}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                </>
              )}
            </div>
            <p className={classes.linkupItemText}>
              Posted {getTimeAgo(created_at)}
            </p>
          </div>
        </div>
        {/* Delete Confirmation Modal */}
        <Modal
          open={showDeleteModal}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-description"
        >
          <div className={classes.deleteModal}>
            <h2 id="delete-modal-title">Confirm Deletion</h2>
            <p id="delete-modal-description">
              Are you sure you want to delete this link-up?
            </p>
            <Button color="secondary" onClick={handleDeleteConfirm}>
              Delete
            </Button>
            <Button color="default" onClick={handleDeleteCancel}>
              Cancel
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
);

export default LinkupItem;
