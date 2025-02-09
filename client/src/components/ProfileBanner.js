import React from "react";
import { styled } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";
import banner from "../assets/Banner2.jpg"; // Import the local banner image

// Styled ProfileBannerContainer with responsive design
const ProfileBannerContainer = styled(Box)(({ theme, colorMode }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  alignItems: "center",
  padding: theme.spacing(0, 6),
  height: "360px",
  background:
    colorMode === "light"
      ? `linear-gradient(to right, rgba(0, 0, 0, 0.95) 49%, transparent 85%), url(${banner})`
      : `linear-gradient(to right, rgba(0, 0, 0, 0.98) 48%, transparent 70%), url(${banner})`,
  backgroundSize: "cover",
  backgroundPosition: "center top",
  overflow: "hidden",
  transition: "height 0.5s ease-out",

  // Responsive layout for smaller screens
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0, 2),
    height: "300px",
    gridTemplateColumns: "1fr",
  },
}));

// Styled TextContainer for text within the banner
const TextContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0),
  color: theme.palette.text.primary,
  display: "-webkit-box",
  WebkitLineClamp: 6, // Limits the text to 6 lines
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

// Styled Typography for the user's name, age, and location
const UserInfoText = styled(Typography)(({ theme }) => ({
  color: "white",
  marginBottom: "1.5rem",
  fontWeight: 500,

  // Responsive font size for smaller screens
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.9rem",
  },
}));

// Styled Typography for the user's bio
const UserBioText = styled(Typography)(({ theme }) => ({
  color: "white",
  fontWeight: "bold",

  // Responsive font size for smaller screens
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.25rem",
  },
}));

const ProfileBanner = ({ userData, userLocation, calculateAge, colorMode }) => (
  <ProfileBannerContainer colorMode={colorMode}>
    <TextContainer>
      <UserInfoText variant="body1">
        {userData?.name}, {calculateAge(userData?.date_of_birth)} •{" "}
        {userLocation}
      </UserInfoText>
      <UserBioText variant="h5">{userData?.bio}</UserBioText>
    </TextContainer>
  </ProfileBannerContainer>
);

export default ProfileBanner;
