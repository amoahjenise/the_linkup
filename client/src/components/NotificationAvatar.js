import React from "react";
import { styled } from "@mui/material/styles";
import { Avatar, Tooltip } from "@mui/material";
import { useColorMode } from "@chakra-ui/react";

const AvatarWrapper = styled("div")({
  position: "relative",
  display: "inline-block",
  marginRight: "1.25rem",
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(6),
  height: theme.spacing(6),
  border: `2px solid ${theme.palette.primary.main}`,
}));

const OnlineIndicator = styled("span")(({ theme, isOnline, colorMode }) => ({
  position: "absolute",
  bottom: 0,
  right: 0,
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: isOnline ? "#4CAF50" : "#B0B0B0",
  border: `2px solid ${colorMode === "dark" ? "black" : "white"}`,
  zIndex: 1,
  transition: "background-color 0.3s ease",
}));

const NotificationAvatar = ({ src, alt, isOnline }) => {
  const { colorMode } = useColorMode();

  return (
    <Tooltip title={isOnline ? "Online" : "Offline"} arrow>
      <AvatarWrapper>
        <StyledAvatar src={src} alt={alt} />
        <OnlineIndicator isOnline={isOnline} colorMode={colorMode} />
      </AvatarWrapper>
    </Tooltip>
  );
};

export default NotificationAvatar;
