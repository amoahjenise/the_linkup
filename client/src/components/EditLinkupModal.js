import React from "react";
import { Modal, styled, Paper, useMediaQuery } from "@mui/material";
import EditLinkupForm from "./EditLinkupForm";
import { useColorMode } from "@chakra-ui/react";

// StyledPaper for the modal container with improved responsiveness
const StyledPaper = styled(Paper)(({ theme, colorMode, fullScreen }) => ({
  borderRadius: fullScreen ? 0 : 16,
  position: "absolute",
  width: "100%",
  maxWidth: "400px", // Desktop
  maxHeight: "90vh",
  boxShadow: theme.shadows[5],
  padding: theme.spacing(3),
  top: fullScreen ? 0 : "50%",
  left: fullScreen ? 0 : "50%",
  transform: fullScreen ? "none" : "translate(-50%, -50%)",
  color: colorMode === "dark" ? "#E0E0E0" : "#333333",
  backgroundColor: colorMode === "dark" ? "#1E1E1E" : "#FFFFFF",
  display: "flex",
  flexDirection: "column",
  outline: "none",
  overflowY: "auto",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    maxWidth: "100%",
    maxHeight: "100vh",
    borderRadius: 0,
    padding: theme.spacing(2),
  },
}));

const EditLinkupModal = ({ isOpen, onClose, updateLinkup }) => {
  const { colorMode } = useColorMode();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleModalClose = () => {
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleModalClose}
      sx={{
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
      }}
      disableScrollLock={false}
    >
      <StyledPaper colorMode={colorMode} fullScreen={isMobile}>
        <EditLinkupForm onClose={handleModalClose} updateLinkup={updateLinkup} />
      </StyledPaper>
    </Modal>
  );
};

export default EditLinkupModal;
