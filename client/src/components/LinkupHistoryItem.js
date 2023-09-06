import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {
  clearEditingLinkup,
  setEditingLinkup,
} from "../redux/actions/editingLinkupActions";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import {
  CheckCircleOutlined,
  CloseOutlined,
  QueryBuilderOutlined,
} from "@material-ui/icons";
import moment from "moment";
import HorizontalMenu from "./HorizontalMenu";
import EditLinkupForm from "./EditLinkupForm";
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
  avatar: {
    marginRight: theme.spacing(1),
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
    width: "300px",
    textAlign: "center",
  },
}));

const LinkupHistoryItem = ({ linkup, userId, setShouldFetchLinkups }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const { addSnackbar } = useSnackbar();

  const {
    creator_name,
    avatar,
    gender_preference,
    activity,
    location,
    date,
    status,
  } = linkup;

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEditClick = () => {
    // Open the edit modal when "Edit this linkup" is clicked
    setIsEditModalOpen(true);
    dispatch(setEditingLinkup(linkup, true));
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
        <Avatar alt={creator_name} src={avatar} className={classes.avatar} />
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
        <span>{location}</span>
      </Typography>
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
};

export default LinkupHistoryItem;
