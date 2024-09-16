import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Close as CloseIcon } from "@mui/icons-material";

const ModalContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "80vw", // Fixed width relative to viewport width
  height: "80vh", // Fixed height relative to viewport height
  maxWidth: "80vw", // Ensure max width does not exceed 80vw
  maxHeight: "80vh", // Ensure max height does not exceed 80vh
  backgroundColor: "transparent",
  boxShadow: "none",
  padding: "0",
  outline: "none",
  borderRadius: "0.5rem",
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
}));

const StyledImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "contain", // Ensure the image fits within the container while maintaining its aspect ratio
});

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  color: theme.palette.common.white,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  borderRadius: "50%",
  padding: theme.spacing(1),
  zIndex: 1000,
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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
