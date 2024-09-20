import React from "react";
import { styled } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";
import UserAvatar from "./UserAvatar";

// Styled components
const ProfileContentContainer = styled(Box)(({ theme, colorMode }) => ({
  top: 49,
  position: "sticky", // Stick to the top
  zIndex: 1, // Ensure it stays above the content
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between", // Ensure even spacing
  borderTop: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${
    colorMode === "dark" ? "white" : `${theme.palette.divider}`
  }`,
  backgroundColor: colorMode === "dark" ? "#333333" : "white",
  width: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}));

const ProfileContent = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  marginTop: theme.spacing(1),

  [theme.breakpoints.down("sm")]: {
    justifyContent: "flex-start", // Align everything to the left on small screens
    flexDirection: "row",
  },
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  position: "relative",
}));

const InnerHeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "left",
  [theme.breakpoints.down("sm")]: {
    textAlign: "left", // Keep left-aligned on mobile
  },
}));

const EditButtonContainer = styled(Box)(({ theme }) => ({
  marginLeft: "auto",
  [theme.breakpoints.down("sm")]: {
    marginLeft: "auto", // Keep the button on the right side
  },
}));

const ProfileInfoBar = ({
  userData,
  renderEditButton,
  calculateAge,
  colorMode,
}) => {
  const textColor = colorMode === "dark" ? "white" : "#333333";

  return (
    <ProfileContentContainer colorMode={colorMode}>
      <ProfileContent>
        <AvatarContainer>
          <UserAvatar userData={userData} width="100px" height="100px" />
        </AvatarContainer>
        <InnerHeaderContainer>
          <Typography
            variant="h6"
            sx={{ color: textColor, fontWeight: "bold" }}
          >
            {userData?.name}, {calculateAge(userData?.date_of_birth)}
          </Typography>
          <Typography variant="body2" sx={{ color: textColor }}>
            {userData?.total_linkups} Created Linkups
          </Typography>
        </InnerHeaderContainer>
        <EditButtonContainer>{renderEditButton()}</EditButtonContainer>
      </ProfileContent>
    </ProfileContentContainer>
  );
};

export default ProfileInfoBar;
