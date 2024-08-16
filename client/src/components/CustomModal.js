import React from "react";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import { useColorMode, Heading, Text, Box } from "@chakra-ui/react";

const ModalWrapper = styled("div")(({ theme, showModal }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
  overflowY: "auto",
  transition: "opacity 0.3s ease",
  opacity: showModal ? 1 : 0,
  visibility: showModal ? "visible" : "hidden",
}));

const ModalContent = styled("div")(({ theme, modalBackgroundColor }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  position: "relative",
  width: "90%",
  maxWidth: "500px",
  margin: "1.5rem auto",
  backgroundColor: modalBackgroundColor,
}));

const ModalHeader = styled("header")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #e5e7eb",
  padding: theme.spacing(2),
}));

const CloseButton = styled("button")(({ theme, modalCloseButtonColor }) => ({
  background: "none",
  border: "none",
  cursor: "pointer",
  svg: {
    fill: modalCloseButtonColor,
  },
}));

const ModalMain = styled("main")(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
}));

const ModalFooter = styled("footer")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(2),
  borderTop: "1px solid #e5e7eb",
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1, 2),
  width: "120px",
  borderRadius: "9999px",
  textTransform: "none",
  backgroundColor: variant === "primary" ? "#3b82f6" : "#ef4444",
  color: "#fff",
  "&:hover": {
    backgroundColor: variant === "primary" ? "#2563eb" : "#dc2626",
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

  const modalBackgroundColor = colorMode === "dark" ? "#1F1F1F" : "white";
  const modalCloseButtonColor = colorMode === "dark" ? "white" : "black";

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
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
            </svg>
          </CloseButton>
        </ModalHeader>
        <ModalMain>
          <Box padding="2" textAlign="center">
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
