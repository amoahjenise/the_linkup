import React from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import EditLinkupForm from "./EditLinkupForm";
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  editModal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
    width: "400px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif", // Use a common sans-serif font
    fontSize: "16px", // Adjust the font size as needed
    lineHeight: "1.5", // Adjust the line height for readability
  },
}));

const EditLinkupModal = ({ isOpen, onClose, setShouldFetchLinkups }) => {
  const classes = useStyles();
  const { colorMode } = useColorMode();

  const handleModalClose = () => {
    onClose();
  };

  // Define background colors based on the Dribbble design
  const darkModeBackgroundColor = "#1e1e1e"; // Dark mode background color
  const lightModeBackgroundColor = "white"; // Light mode background color

  return (
    <Modal
      open={isOpen}
      onClose={handleModalClose}
      aria-labelledby="edit-modal-title"
      aria-describedby="edit-modal-description"
    >
      <div
        className={classes.editModal}
        style={{
          backgroundColor:
            colorMode === "dark"
              ? darkModeBackgroundColor
              : lightModeBackgroundColor,
        }}
      >
        <EditLinkupForm
          setShouldFetchLinkups={setShouldFetchLinkups}
          onClose={handleModalClose}
        />
      </div>
    </Modal>
  );
};

export default EditLinkupModal;
