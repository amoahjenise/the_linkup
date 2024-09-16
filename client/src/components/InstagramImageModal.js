import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Close as CloseIcon } from "@mui/icons-material";

const ModalContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  maxWidth: "none", // Remove maxWidth to match Instagram's full-width style
  backgroundColor: "transparent", // Background color removed for image-only modal
  boxShadow: "none", // Remove shadow for a cleaner look
  padding: "0", // No padding
  outline: "none",
  borderRadius: "0", // No border-radius
  margin: "auto",
  top: "0", // Position at the top
  left: "0", // Align left
  transform: "none", // No transformation
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", // Full viewport height
  overflow: "hidden", // Hide overflow
}));

const StyledImage = styled("img")({
  width: "100%",
  height: "auto",
  maxHeight: "100%", // Ensure image doesn't exceed the viewport height
  objectFit: "cover",
});

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  color: theme.palette.common.white, // Adjust to fit Instagram's theme
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  borderRadius: "50%", // Rounded button
  padding: theme.spacing(1),
  zIndex: 1000, // Ensure it stays above other elements
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker on hover
  },
}));

const InstagramImageModal = ({ open, onClose, imageSrc }) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="instagram-image-modal"
    aria-describedby="full-size-image"
  >
    <ModalContainer>
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>
      <StyledImage src={imageSrc} alt="Full-size" />
    </ModalContainer>
  </Modal>
);

export default InstagramImageModal;
