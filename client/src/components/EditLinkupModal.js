import React from "react";
import { Modal } from "@mui/material";
import { styled } from "@mui/material/styles";
import EditLinkupForm from "./EditLinkupForm";
import { useColorMode } from "@chakra-ui/react";

// Styled component for the modal content
const StyledModalContent = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  outline: "none",
  width: "400px",
  textAlign: "center",
  fontFamily: "Arial, sans-serif",
  fontSize: "16px",
  lineHeight: "1.5",
}));

const EditLinkupModal = ({ isOpen, onClose, setShouldFetchLinkups }) => {
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
        <EditLinkupForm
          setShouldFetchLinkups={setShouldFetchLinkups}
          onClose={handleModalClose}
        />
      </StyledModalContent>
    </Modal>
  );
};

export default EditLinkupModal;
