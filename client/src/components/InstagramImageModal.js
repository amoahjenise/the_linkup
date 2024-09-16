import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Close as CloseIcon } from "@mui/icons-material";

const ModalContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "80%",
  maxWidth: "900px",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2),
  outline: "none",
  borderRadius: theme.shape.borderRadius,
  margin: "auto",
  top: "10%", // Adjust this to position the modal vertically if needed
  transform: "translateY(-10%)", // Adjust this to keep the modal in view
}));

const StyledImage = styled("img")({
  width: "100%",
  height: "auto",
  maxHeight: "80vh",
  objectFit: "cover",
});

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  color: theme.palette.grey[700],
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
