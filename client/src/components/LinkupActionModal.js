import React from "react";
import { Button, Modal } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useColorMode } from "@chakra-ui/react";
import logo from "../logo.png";

const Screen = styled("div")({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const ModalContainer = styled("div")(({ theme, modalBackgroundColor }) => ({
  backgroundColor: modalBackgroundColor,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

const LogoContainer = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(2),
  },
}));

const Logo = styled("img")(({ theme }) => ({
  height: "50px",
  marginBottom: theme.spacing(2),
  backgroundColor: "#000", // Set the background color to black
}));

const ModalHeader = styled("div")(({ theme, color }) => ({
  width: "24rem",
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  borderTop: `8px solid ${color}`,
}));

const IconContainer = styled("div")(({ theme }) => ({
  width: "33%",
  paddingTop: theme.spacing(6),
  display: "flex",
  justifyContent: "center",
}));

const Icon = styled("div")(({ theme, color }) => ({
  width: theme.spacing(8),
  height: theme.spacing(8),
  backgroundColor: color,
  color: "white",
  padding: theme.spacing(2),
  borderRadius: "50%",
}));

const ContentContainer = styled("div")(({ theme }) => ({
  width: "100%",
  paddingTop: theme.spacing(3),
  paddingRight: theme.spacing(2),
}));

const Title = styled("h3")(({ color }) => ({
  fontWeight: "bold",
  color: color,
}));

const Description = styled("p")(({ theme }) => ({
  paddingTop: theme.spacing(1),
  fontSize: "0.875rem",
  color: "#9e9e9e",
}));

const ButtonContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  gap: theme.spacing(2),
}));

const CancelButton = styled(Button)(({ theme }) => ({
  width: "50%",
  padding: theme.spacing(1.5),
  textAlign: "center",
  backgroundColor: "#f5f5f5",
  color: "#9e9e9e",
  fontWeight: "bold",
  borderRadius: theme.shape.borderRadius,
  "&:hover": {
    backgroundColor: "#e0e0e0",
    color: "#000",
  },
}));

const PrimaryButton = styled(Button)(({ theme, color }) => ({
  width: "50%",
  padding: theme.spacing(1.5),
  textAlign: "center",
  color: "#fff",
  fontWeight: "bold",
  backgroundColor: color, // Use the color prop for the background color
  "&:hover": {
    backgroundColor: "#e0e0e0",
    color: "#000",
  },
}));

const LinkupActionModal = ({
  open,
  onClose,
  onConfirm,
  color,
  modalTitle,
  modalContentText,
  primaryButtonText,
  primaryButtonFn,
  secondaryButtonText,
  secondaryButtonFn,
}) => {
  const { colorMode } = useColorMode();

  const modalBackgroundColor = colorMode === "dark" ? "#1e1e1e" : "white";

  const filterStyle =
    colorMode === "dark" ? "invert(0.879) grayscale(70%)" : "none"; // Set filter style based on colorMode

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <Screen>
        <ModalContainer modalBackgroundColor={modalBackgroundColor}>
          <ModalHeader color={color}>
            <IconContainer>
              <LogoContainer>
                <Logo src={logo} alt="Logo" style={{ filter: filterStyle }} />
              </LogoContainer>
            </IconContainer>
            <ContentContainer>
              <Title color={color}>{modalTitle}</Title>
              <Description>{modalContentText}</Description>
            </ContentContainer>
          </ModalHeader>
          <ButtonContainer>
            <CancelButton onClick={secondaryButtonFn || onClose}>
              {secondaryButtonText}
            </CancelButton>
            <PrimaryButton>
              <Button
                onClick={primaryButtonFn || onConfirm}
                style={{ backgroundColor: color }}
              >
                {primaryButtonText}
              </Button>
            </PrimaryButton>
          </ButtonContainer>
        </ModalContainer>
      </Screen>
    </Modal>
  );
};

export default LinkupActionModal;
