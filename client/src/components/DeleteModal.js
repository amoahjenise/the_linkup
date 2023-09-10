import React from "react";
import { Button, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  deleteModal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3),
    outline: "none",
    minWidth: "300px",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: "24px",
    marginBottom: theme.spacing(2),
  },
  modalText: {
    fontSize: "16px",
    marginBottom: theme.spacing(3),
    whiteSpace: "nowrap", // Allow text to wrap within
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(3),
  },
  deleteButton: {
    backgroundColor: "#B71C1C", // Red color for delete
    color: "white",
    padding: theme.spacing(1.5, 3),
    marginRight: theme.spacing(2),
    "&:hover": {
      backgroundColor: "#D32F2F", // Darker red on hover
    },
  },
  cancelButton: {
    backgroundColor: "#333333", // Gray color for cancel
    color: "white",
    padding: theme.spacing(1.5, 3),
    "&:hover": {
      backgroundColor: "#616161", // Darker gray on hover
    },
  },
}));

const DeleteModal = ({ open, onClose, onConfirm }) => {
  const classes = useStyles();
  const { colorMode } = useColorMode();

  const modalBackgroundColor =
    colorMode === "dark"
      ? "#1e1e1e" // Dark mode background color with no transparency
      : "white";

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <div
        className={classes.deleteModal}
        style={{
          backgroundColor: modalBackgroundColor,
        }}
      >
        <h2 className={classes.modalTitle} id="delete-modal-title">
          Confirm Deletion
        </h2>
        <p className={classes.modalText} id="delete-modal-description">
          Are you sure you want to delete this link-up?
        </p>
        <div className={classes.buttonGroup}>
          <Button
            className={classes.deleteButton}
            onClick={onConfirm}
            color="secondary"
          >
            Delete
          </Button>
          <Button
            className={classes.cancelButton}
            onClick={onClose}
            color="default"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
