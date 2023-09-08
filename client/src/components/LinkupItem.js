import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { LinkRounded, LinkTwoTone } from "@material-ui/icons";
import DeleteModal from "./DeleteModal";
import moment from "moment";
import { Link } from "react-router-dom";
import { setEditingLinkup } from "../redux/actions/editingLinkupActions";
import { useSnackbar } from "../contexts/SnackbarContext";
import { markLinkupAsCompleted, deleteLinkup } from "../api/linkupAPI";
import PostActions from "./PostActions";
import HorizontalMenu from "./HorizontalMenu";
import EditLinkupModal from "./EditLinkupModal";
import UserAvatar from "./UserAvatar";
import PayIconWithTooltip from "./PaymentIcon";
import SplitBillIcon from "./SplitBillIcon";
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
    width: "350px", // Adjust the width as needed
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

    const handleCompleteClick = async () => {
      try {
        const response = await markLinkupAsCompleted(id);
        if (response.success) {
          addSnackbar("Link-up completed successfully!");
          setShouldFetchLinkups(true);
        } else {
          console.error("Error completing link-up:", response.message);
          addSnackbar("Error completing link-up: " + response.message);
        }
      } catch (error) {
        console.error("An error occurred:", error);
        addSnackbar("An error occurred while completing the link-up");
      } finally {
        handleMenuClose();
      }
    };

    const handleEditClick = () => {
      // Open the edit modal when "Edit this linkup" is clicked
      setIsEditModalOpen(true);
      dispatch(setEditingLinkup(linkupItem));
      handleMenuClose();
    };

    // Function to handle the click on the linkup item and redirect to history page
    const handleGoToLinkupClick = () => {
      // Use the navigate function to redirect to the history page
      navigate("/history"); // Change the path to the desired destination, in this case, "/"
    };

    const handleRequestLinkup = () => {
      if (disableRequest) {
        navigate(`/history/requests-sent`);
      } else {
        navigate(`/send-request/${id}`);
      }
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

      const linkupItemText = (
        <p>
          <Link to={`/profile/${creator_id}`} className={classes.usernameLink}>
            <span className={classes.boldText}>@{creator_name}</span>
          </Link>{" "}
          is trying to link up{" "}
          <span className={classes.boldText}>{activityText.toLowerCase()}</span>{" "}
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
          isHovered || linkupItem.id === editingLinkup?.linkup?.id
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
              <UserAvatar
                userData={{
                  id: creator_id,
                  name: creator_name,
                  avatar: avatar,
                }}
                width="50px"
                height="50px"
              />

              {renderLinkupItemText()}
            </div>
            {loggedUser.user.id === linkupItem.creator_id && (
              <HorizontalMenu
                onLinkupItemClick={handleGoToLinkupClick}
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
                {/* <PayIconWithTooltip
                  width="30px"
                  height="30px"
                  fontSize="24px"
                  color="#007bff"
                /> */}

                {/* Use the SplitBillIcon component */}
                {/* <SplitBillIcon
                  person1Color="#007bff"
                  person2Color="#ff4500"
                  width={60}
                  height={60}
                /> */}

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
        <EditLinkupModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
          }}
          setShouldFetchLinkups={setShouldFetchLinkups}
        />
      </div>
    );
  }
);

export default LinkupItem;
