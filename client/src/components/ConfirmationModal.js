import React from "react";
import { Modal, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  confirmModal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3),
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
  confirmButton: {
    backgroundColor: "#00CFFF",
    color: "white",
    padding: theme.spacing(1.5, 3),
    marginRight: theme.spacing(2),
    "&:hover": {
      backgroundColor: "#00BFFF",
    },
  },
  cancelButton: {
    backgroundColor: "#E0E0E0", // Gray color for cancel
    color: "white",
    padding: theme.spacing(1.5, 3),
    "&:hover": {
      backgroundColor: "#BDBDBD", // Darker gray on hover
    },
    whiteSpace: "nowrap", // Allow text to wrap within the button
  },
}));

const ConfirmationModal = ({ open, onClose, onConfirm, title, message }) => {
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
      className={classes.confirmModal}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <div
        className={classes.modalContent}
        style={{
          backgroundColor: modalBackgroundColor,
        }}
      >
        <h2 className={classes.modalTitle} id="confirmation-modal-title">
          {title}
        </h2>
        <Typography
          className={classes.modalText}
          id="confirmation-modal-description"
        >
          {message}
        </Typography>
        <div className={classes.buttonGroup}>
          <Button
            onClick={onConfirm}
            className={classes.confirmButton}
            color="primary"
          >
            Confirm
          </Button>
          <Button
            onClick={onClose}
            className={classes.cancelButton}
            color="primary"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
