import React from "react";
import { Modal } from "@mui/material";
import { styled } from "@mui/material/styles";
import EditLinkupForm from "./EditLinkupForm";
import { useColorMode } from "@chakra-ui/react";

const StyledModalContent = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  outline: "none",
  width: "400px",
  height: "auto",
  maxHeight: "80vh",
  overflowY: "auto",
  textAlign: "center",
  fontFamily: "Arial, sans-serif",
  fontSize: "12px",
  lineHeight: "1.35",

  // 👇 This targets all buttons inside this modal
  "& button": {
    padding: "6px 12px", // smaller padding
    fontSize: "12px", // smaller text
    minWidth: "auto", // prevents MUI buttons from being too wide
    borderRadius: "8px", // optional: smaller border radius for a cleaner look
  },
}));

const EditLinkupModal = ({ isOpen, onClose, refreshFeed }) => {
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
      <StyledModalContent
        style={{
          backgroundColor:
            colorMode === "dark"
              ? darkModeBackgroundColor
              : lightModeBackgroundColor,
        }}
      >
        <EditLinkupForm onClose={handleModalClose} refreshFeed={refreshFeed} />
      </StyledModalContent>
    </Modal>
  );
};

export default EditLinkupModal;
