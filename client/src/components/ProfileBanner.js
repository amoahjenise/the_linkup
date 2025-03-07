import React from "react";
import { styled } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";
import banner from "../assets/Image1.jpg"; // Import the local banner image
import banner2 from "../assets/Image3.png"; // Import the local banner image
import CircleIcon from "@mui/icons-material/Circle"; // Icon for online/offline status

// Styled ProfileBannerContainer with responsive design
const ProfileBannerContainer = styled(Box)(({ theme, colorMode }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  alignItems: "center",
  padding: theme.spacing(0, 6),
  height: "320px",
  background:
    colorMode === "light"
      ? `linear-gradient(to right, rgba(255, 255, 255, 0.5) 3%, transparent 55%), url(${banner2})`
      : `linear-gradient(to right, rgba(0, 0, 0, 0.88) 51%, transparent 95%), url(${banner})`,
  backgroundSize: "cover",
  backgroundPosition: "center top",
  overflow: "hidden",
  transition: "height 0.5s ease-out",

  // Responsive layout for smaller screens
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0, 2),
    height: "250px",
    gridTemplateColumns: "1fr",
  },
}));

// Styled TextContainer for text within the banner
const TextContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0),
  display: "-webkit-box",
  WebkitLineClamp: 6, // Limits the text to 6 lines
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

// Styled Typography for the user's name, age, and location
const UserInfoText = styled(Typography)(({ theme, colorMode }) => ({
  color: colorMode === "light" ? "black" : "white", // Dynamic text color
  marginBottom: "1.5rem",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  gap: "8px", // Space between elements

  // Responsive font size for smaller screens
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.9rem",
  },
}));

// Styled Typography for the user's bio
const UserBioText = styled(Typography)(({ theme, colorMode }) => ({
  color: colorMode === "light" ? "black" : "white", // Dynamic text color
  fontWeight: "bold",

  // Responsive font size for smaller screens
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.25rem",
  },
}));

// Styled Online/Offline Icon
const OnlineOfflineIcon = styled(CircleIcon)(({ theme, isOnline }) => ({
  fontSize: "0.75rem", // Small size for the icon
  color: isOnline ? "#4CAF50" : "#B0B0B0", // Green for online, gray for offline
  transition: "color 0.3s ease", // Smooth transition for color change
}));

const ProfileBanner = ({ userData, userLocation, calculateAge, colorMode }) => {
  return (
    <ProfileBannerContainer colorMode={colorMode}>
      <TextContainer>
        <UserInfoText variant="body1" colorMode={colorMode}>
          {userData?.name}, {calculateAge(userData?.date_of_birth)} •{" "}
          {userLocation}{" "}
          <Box
            component="span"
            display="flex"
            alignItems="center"
            gap="4px" // Space between icon and text
          >
            <OnlineOfflineIcon isOnline={userData?.is_online} />
            <Typography variant="body2" component="span">
              {userData?.is_online ? "Online" : "Offline"}
            </Typography>
          </Box>
        </UserInfoText>
        <UserBioText variant="h5" colorMode={colorMode}>
          {userData?.bio}
        </UserBioText>
      </TextContainer>
    </ProfileBannerContainer>
  );
};

export default ProfileBanner;
