import React, { useState } from "react";
import { Button, Modal } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useColorMode } from "@chakra-ui/react";
import logo from "../assets/logo.png";

const Screen = styled("div")({
  minHeight: "100dvh",
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
  flex: "1",
  padding: theme.spacing(1.5),
  textAlign: "center",
  backgroundColor: "#f5f5f5",
  color: "#9e9e9e",
  fontWeight: "600",
  borderRadius: theme.shape.borderRadius,
  "&:hover": {
    backgroundColor: "#e0e0e0",
    color: "#000",
  },
  marginRight: theme.spacing(1),
}));

const PrimaryButton = styled(Button)(({ theme, color }) => ({
  flex: "1",
  padding: theme.spacing(1.5),
  textAlign: "center",
  fontWeight: "600",
  borderRadius: theme.shape.borderRadius,
}));

const shadeColor = (color, percent) => {
  if (!color || color === "undefined") {
    console.error("Invalid color:", color);
    return "#da2424"; // Fallback color
  }

  // Convert hex to RGB
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);

  // Calculate new RGB values
  r = Math.min(255, Math.max(0, Math.floor(r + (r * percent) / 100)));
  g = Math.min(255, Math.max(0, Math.floor(g + (g * percent) / 100)));
  b = Math.min(255, Math.max(0, Math.floor(b + (b * percent) / 100)));

  // Convert RGB back to hex
  const rHex = r.toString(16).padStart(2, "0");
  const gHex = g.toString(16).padStart(2, "0");
  const bHex = b.toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
};

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

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Calculate hover color
  const hoverColor = shadeColor(color, -10);

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
            <PrimaryButton
              style={{ backgroundColor: isHovered ? hoverColor : color }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Button
                onClick={primaryButtonFn || onConfirm}
                style={{ color: "white" }}
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
