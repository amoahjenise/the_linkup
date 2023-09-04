import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { LinkRounded, LinkTwoTone } from "@material-ui/icons";
import { Modal } from "@material-ui/core";
import DeleteModal from "./DeleteModal";

import moment from "moment";
import { Link } from "react-router-dom";
import {
  clearEditingLinkup,
  setEditingLinkup,
} from "../redux/actions/editingLinkupActions";
import { useSnackbar } from "../contexts/SnackbarContext";
import Avatar from "@material-ui/core/Avatar";
import { deleteLinkup } from "../api/linkupAPI";
import PostActions from "./PostActions";
import HorizontalMenu from "./HorizontalMenu";
import EditLinkupForm from "./EditLinkupForm";
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
  postedTimeText: {
    color: theme.palette.text.secondary,
    marginLeft: "auto",
  },
  postHeaderContainer: { display: "flex", alignItems: "center" },
  linkupItemContent: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    wordWrap: "break-word",
  },
  boldText: {
    fontWeight: "bold",
    color: theme.palette.text.primary,
  },
  iconHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: theme.spacing(1),
    border: "1px solid #e1e8ed",
  },
  usernameLink: {
    textDecoration: "none",
    color: theme.palette.text.primary,
    fontWeight: "bold",
  },
  postActions: {
    fontSize: "12px",
    marginTop: "25px",
  },
  buttonsContainer: {
    display: "flex",
    alignItems: "center",
  },
  highlightedLinkupItem: {
    backgroundColor: "#f5f8fa",
    transition: "background-color 0.3s ease",
  },
  editModal: {
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
}));

const LinkupItem = React.memo(
  ({ linkupItem, setShouldFetchLinkups, disableRequest }) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
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
    const [menuAnchor, setMenuAnchor] = useState(null);

    const handleMenuClose = () => {
      setMenuAnchor(null);
    };

    const handleEditClick = () => {
      // Open the edit modal when "Edit this linkup" is clicked
      setIsEditModalOpen(true);
      dispatch(setEditingLinkup(linkupItem, true));
      handleMenuClose();
    };

    // Function to handle the click on the linkup item and redirect to history page
    const handleLinkupItemClick = () => {
      // Use the navigate function to redirect to the history page
      navigate("/history"); // Change the path to the desired destination, in this case, "/"
    };

    const handleCompleteClick = () => {};

    const handleRequestLinkup = () => {
      if (disableRequest) {
        navigate(`/history/requests`);
      } else {
        navigate(`/send-request/${id}`);
      }
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
      handleMenuClose();
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

    const renderPostIcon = () => {
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
            <div className={classes.postHeaderContainer}>
              {renderPostIcon()}
              <Avatar alt="Avatar" src={avatar} className={classes.avatar} />
              {renderLinkupItemText()}
            </div>
            {!editingLinkup.isEditing &&
              loggedUser.user.id === linkupItem.creator_id && (
                <HorizontalMenu
                  onLinkupItemClick={handleLinkupItemClick}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                  onCompleteClick={handleCompleteClick}
                  menuAnchor={menuAnchor}
                  setMenuAnchor={setMenuAnchor}
                />
              )}
          </div>
          <div className={classes.postActions}>
            {loggedUser.user.id !== linkupItem.creator_id ? (
              <div className={classes.buttonsContainer}>
                <PostActions
                  onRequestClick={handleRequestLinkup}
                  disableRequest={disableRequest}
                />
                <p className={classes.postedTimeText}>
                  Posted {getTimeAgo(created_at)}
                </p>
              </div>
            ) : (
              <div className={classes.buttonsContainer}>
                <p className={classes.postedTimeText}>
                  Posted {getTimeAgo(created_at)}
                </p>
              </div>
            )}
          </div>
        </div>
        <DeleteModal
          open={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
        {/* Render EditLinkupForm as a modal */}
        <Modal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          aria-labelledby="edit-modal-title"
          aria-describedby="edit-modal-description"
        >
          <div className={classes.editModal}>
            {/* Render EditLinkupForm component here */}
            <EditLinkupForm
              setShouldFetchLinkups={setShouldFetchLinkups}
              onClose={() => setIsEditModalOpen(false)}
            />
          </div>
        </Modal>
      </div>
    );
  }
);

export default LinkupItem;
