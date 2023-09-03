import React from "react";
import Modal from "@material-ui/core/Modal";
import EditLinkupForm from "./EditLinkupForm";

const EditLinkupModal = ({ open, onClose, setShouldFetchLinkups }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <EditLinkupForm
          onClose={onClose}
          setShouldFetchLinkups={setShouldFetchLinkups}
        />
      </div>
    </Modal>
  );
};

export default EditLinkupModal;
