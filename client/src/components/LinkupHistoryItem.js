import React, { useState } from "react";
import { useDispatch } from "react-redux";
import UserAvatar from "./UserAvatar";
import Typography from "@material-ui/core/Typography";
import { setEditingLinkup } from "../redux/actions/editingLinkupActions";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import {
  CheckCircleOutlined,
  CloseOutlined,
  QueryBuilderOutlined,
} from "@material-ui/icons";
import moment from "moment";
import HorizontalMenu from "./HorizontalMenu";
import EditLinkupModal from "./EditLinkupModal";
import DeleteModal from "./DeleteModal";
import { useSnackbar } from "../contexts/SnackbarContext";
import { markLinkupAsCompleted, deleteLinkup } from "../api/linkupAPI";
import nlp from "compromise";
const compromise = nlp;

const useStyles = makeStyles((theme) => ({
  linkupHistoryItem: {
    backgroundColor: "#fff",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    borderBottom: "1px solid lightgrey",
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkupDetails: {
    display: "flex",
    alignItems: "center",
  },
  pendingChip: {
    marginLeft: "auto",
    backgroundColor: "#f1c40f", // Yellow
    color: theme.palette.text.secondary,
  },
  completedChip: {
    marginLeft: "auto",
    backgroundColor: "#2ecc71", // Green
    color: theme.palette.text.secondary,
  },
  declinedChip: {
    marginLeft: "auto",
    backgroundColor: "pink", // Pink
    color: theme.palette.text.secondary,
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

const LinkupHistoryItem = ({ linkup, setShouldFetchLinkups }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const { addSnackbar } = useSnackbar();

  const {
    creator_id,
    creator_name,
    avatar,
    gender_preference,
    activity,
    location,
    date,
    status,
  } = linkup;

  // Capitalize the first letter of each word in the location
  const formattedLocation = location
    .toLowerCase() // Convert to lowercase
    .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase()); // Capitalize first letter of each word

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEditClick = () => {
    // Open the edit modal when "Edit this linkup" is clicked
    setIsEditModalOpen(true);
    dispatch(setEditingLinkup(linkup));
    handleMenuClose();
  };

  const handleDeleteClick = async () => {
    setShowDeleteModal(true); // Show the delete confirmation modal
    handleMenuClose();
  };

  const handleCompleteClick = async () => {
    try {
      const response = await markLinkupAsCompleted(linkup.id);
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

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteLinkup(linkup.id);
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

  const handleDeleteCancel = () => {
    setShowDeleteModal(false); // Close the delete confirmation modal
  };

  const renderStatusIcon = () => {
    if (status === "active") {
      return <QueryBuilderOutlined />;
    } else if (status === "completed") {
      return <CheckCircleOutlined />;
    } else if (status === "expired") {
      return <CloseOutlined />;
    }
    return null;
  };

  const getStatusLabel = () => {
    if (status === "active") {
      return "active";
    } else if (status === "completed") {
      return "completed";
    } else if (status === "expired") {
      return "expired";
    }
    return null;
  };

  const getStatusChipClass = () => {
    if (status === "active") {
      return classes.pendingChip;
    } else if (status === "completed") {
      return classes.completedChip;
    } else if (status === "expired") {
      return classes.declinedChip;
    }
    return null;
  };

  const renderLinkupItemText = () => {
    let linkupItemText = "";
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

    const formattedLocation = location
      .toLowerCase()
      .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());

    if (
      status === "active" ||
      status === "completed" ||
      status === "declined"
    ) {
      linkupItemText = `You are trying to link up ${activityText.toLowerCase()} on ${dateText} ${timeText}
      with a gender preference for ${gender_preference}.`;
    } else if (status === "expired") {
      linkupItemText = `Link up ${activityText.toLowerCase()} on 
          ${dateText} ${timeText} has expired.`;
    } else {
      linkupItemText = "";
    }

    return linkupItemText;
  };

  return (
    <div className={classes.linkupHistoryItem}>
      <div className={classes.itemHeader}>
        <UserAvatar
          userData={{
            id: creator_id,
            name: creator_name,
            avatar: avatar,
          }}
          width="40px"
          height="40px"
        />
        {status === "active" && (
          <>
            <HorizontalMenu
              onEditClick={() => handleEditClick(linkup)}
              onDeleteClick={() => handleDeleteClick(linkup.id)}
              onCompleteClick={() => handleCompleteClick(linkup.id)}
              menuAnchor={menuAnchor}
              setMenuAnchor={setMenuAnchor}
            />
          </>
        )}
      </div>
      <div className={classes.linkupDetails}>
        <div>
          <p className={classes.requestText}>{renderLinkupItemText()}</p>
        </div>
        <Chip
          label={getStatusLabel()}
          icon={renderStatusIcon()}
          variant="outlined"
          className={getStatusChipClass()}
        />
      </div>
      <Typography variant="subtitle2" component="details">
        <span>{formattedLocation}</span>
      </Typography>
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
};

export default LinkupHistoryItem;
