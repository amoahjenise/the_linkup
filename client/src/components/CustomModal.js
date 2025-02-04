import React from "react";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import { useColorMode, Heading, Text, Box } from "@chakra-ui/react";

// Styled wrapper for the modal
const ModalWrapper = styled("div")(({ theme, showModal }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.3)", // Slightly lighter overlay
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999, // Higher z-index for prominence
  opacity: showModal ? 1 : 0,
  visibility: showModal ? "visible" : "hidden",
  transition: "opacity 0.3s ease, visibility 0.3s ease",
}));

// Styled content area of the modal
const ModalContent = styled("div")(({ theme, modalBackgroundColor }) => ({
  padding: theme.spacing(4),
  borderRadius: 8, // Slightly rounded corners
  boxShadow: theme.shadows[10], // Higher shadow for more depth
  position: "relative",
  width: "90%",
  maxWidth: 600,
  backgroundColor: modalBackgroundColor,
  [theme.breakpoints.down("sm")]: {
    width: "95%",
  },
}));

// Header of the modal
const ModalHeader = styled("header")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: `1px solid ${theme.palette.divider}`, // Use theme divider color
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

// Close button for the modal
const CloseButton = styled("button")(({ theme, modalCloseButtonColor }) => ({
  background: "none",
  border: "none",
  cursor: "pointer",
  svg: {
    fill: modalCloseButtonColor,
    transition: "fill 0.2s ease",
    "&:hover": {
      fill: theme.palette.text.primary,
    },
  },
}));

// Main content of the modal
const ModalMain = styled("main")(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
}));

// Footer of the modal
const ModalFooter = styled("footer")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(1),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

// Styled button for actions
const StyledButton = styled(Button)(({ theme, variant }) => ({
  padding: theme.spacing(1, 3),
  borderRadius: 24, // Rounded corners for buttons
  textTransform: "none",
  fontWeight: 500,
  backgroundColor:
    variant === "primary"
      ? theme.palette.primary.main
      : theme.palette.error.main,
  color: "#fff",
  "&:hover": {
    backgroundColor:
      variant === "primary"
        ? theme.palette.primary.dark
        : theme.palette.error.dark,
  },
}));

const CustomModal = ({
  showModal,
  setShowModal,
  title,
  content,
  primaryAction,
  primaryActionLabel,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const { colorMode } = useColorMode();

  const modalBackgroundColor = colorMode === "dark" ? "#333" : "#fff";
  const modalCloseButtonColor = colorMode === "dark" ? "#fff" : "#000";

  const handleClose = () => setShowModal(false);

  return (
    <ModalWrapper showModal={showModal} onClick={handleClose}>
      <ModalContent
        modalBackgroundColor={modalBackgroundColor}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <Heading as="h2" size="md">
            {title}
          </Heading>
          <CloseButton
            onClick={handleClose}
            modalCloseButtonColor={modalCloseButtonColor}
          >
            <svg
              className="fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M18.36 5.64a1.25 1.25 0 0 0-1.77 0L12 8.77 7.41 4.18a1.25 1.25 0 0 0-1.77 1.77L10.23 12l-4.59 4.59a1.25 1.25 0 0 0 1.77 1.77L12 13.23l4.59 4.59a1.25 1.25 0 0 0 1.77-1.77L13.77 12l4.59-4.59a1.25 1.25 0 0 0 0-1.77z"></path>
            </svg>
          </CloseButton>
        </ModalHeader>
        <ModalMain>
          <Box padding="2">
            <Text>{content}</Text>
          </Box>
        </ModalMain>
        <ModalFooter>
          <StyledButton variant="secondary" onClick={secondaryAction}>
            {secondaryActionLabel}
          </StyledButton>
          <StyledButton variant="primary" onClick={primaryAction}>
            {primaryActionLabel}
          </StyledButton>
        </ModalFooter>
      </ModalContent>
    </ModalWrapper>
  );
};

export default CustomModal;
