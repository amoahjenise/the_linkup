import React from "react";
import Modal from "@material-ui/core/Modal";
import EditLinkupForm from "./EditLinkupForm";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
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

const EditLinkupModal = ({ open, onClose, setShouldFetchLinkups }) => {
  const classes = useStyles();

  return (
    <Modal open={open} onClose={onClose}>
      <EditLinkupForm
        className={classes.modal}
        onClose={onClose}
        setShouldFetchLinkups={setShouldFetchLinkups}
      />
    </Modal>
  );
};

export default EditLinkupModal;
