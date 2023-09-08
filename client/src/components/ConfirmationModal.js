import React from "react";
import { Modal, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  confirmModal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3),
    minWidth: "300px",
    textAlign: "center",
  },
  modalText: {
    fontSize: "16px",
    marginBottom: theme.spacing(3),
    color: theme.palette.text.secondary,
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={classes.confirmModal}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <div className={classes.modalContent}>
        <Typography variant="h6" id="confirmation-modal-title">
          {title}
        </Typography>
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
