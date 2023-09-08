import React from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import EditLinkupForm from "./EditLinkupForm";

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
    width: "350px",
    textAlign: "center",
  },
}));

const EditLinkupModal = ({ isOpen, onClose, setShouldFetchLinkups }) => {
  const classes = useStyles();

  const handleModalClose = () => {
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleModalClose}
      aria-labelledby="edit-modal-title"
      aria-describedby="edit-modal-description"
    >
      <div className={classes.editModal}>
        <EditLinkupForm
          setShouldFetchLinkups={setShouldFetchLinkups}
          onClose={handleModalClose}
        />
      </div>
    </Modal>
  );
};

export default EditLinkupModal;
