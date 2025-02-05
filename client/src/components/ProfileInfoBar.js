// components/ProfileInfoBar.js
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";
import UserAvatar from "./UserAvatar";
import LinkupsModal from "./LinkupsModal"; // Import the modal

const ProfileContentContainer = styled(Box)(({ theme, colorMode }) => ({
  top: 49,
  position: "sticky",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderTop: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${
    colorMode === "dark" ? "white" : theme.palette.divider
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
    justifyContent: "flex-start",
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
    textAlign: "left",
  },
}));

const EditButtonContainer = styled(Box)(({ theme }) => ({
  marginLeft: "auto",
  [theme.breakpoints.down("sm")]: {
    marginLeft: "auto",
  },
}));

const ProfileInfoBar = ({ userData, renderEditButton, colorMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const textColor = colorMode === "dark" ? "white" : "#333333";

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
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
              {userData?.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: textColor,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={handleOpenModal}
            >
              {userData?.total_linkups} Created Linkups
            </Typography>
          </InnerHeaderContainer>
          <EditButtonContainer>{renderEditButton()}</EditButtonContainer>
        </ProfileContent>
      </ProfileContentContainer>

      {/* Linkups Modal */}
      <LinkupsModal
        userId={userData?.id}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ProfileInfoBar;
