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
    padding: theme.spacing(4),
    outline: "none",
    width: "300px",
    textAlign: "center",
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
        <h2 id="delete-modal-title">Confirm Deletion</h2>
        <p id="delete-modal-description">
          Are you sure you want to delete this link-up?
        </p>
        <Button color="secondary" onClick={onConfirm}>
          Delete
        </Button>
        <Button color="default" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
