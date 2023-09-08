import React from "react";
import { Button, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  deleteModal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3),
    outline: "none",
    minWidth: "300px",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: "24px",
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
  },
  modalText: {
    fontSize: "16px",
    marginBottom: theme.spacing(3),
    color: theme.palette.text.secondary,
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <div className={classes.deleteModal}>
        <h2 className={classes.modalTitle} id="delete-modal-title">
          Confirm Deletion
        </h2>
        <p className={classes.modalText} id="delete-modal-description">
          Are you sure you want to delete this link-up?
        </p>
        <div className={classes.buttonGroup}>
          <Button className={classes.deleteButton} onClick={onConfirm}>
            Delete
          </Button>
          <Button className={classes.cancelButton} onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
