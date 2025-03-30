import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { FaEllipsisH, FaShare } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { Button, Divider, Menu, MenuItem, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import LinkupsModal from "./LinkupsModal";
import SocialMediaLinks from "../components/SocialMediaLinks";
import UserProfileEditModal from "./UserProfileEditModal";
import { keyframes } from "@mui/system";
import { Box } from "@mui/material";
import LoadingSpinner from "./LoadingSpinner";

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const BouncingNotifier = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "100%",
  right: "-10px",
  backgroundColor: "#0097A7",
  color: "#fff",
  padding: "4px 8px",
  borderRadius: "12px",
  fontSize: "0.75rem",
  whiteSpace: "nowrap",
  boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
  animation: `${bounce} 1.5s infinite`,
  zIndex: 10,
  cursor: "default",
}));

const MoreButtonWrapper = styled("div")({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const UserProfileContainer = styled("div")(({ isMobile }) => ({
  position: "relative",
  width: "100%",
  height: isMobile ? "calc(100dvh - 110px)" : "calc(100% - 60px)", // Reduced height
  overflow: "hidden",
  color: "#fff",
  paddingTop: isMobile ? "60px" : "0",
}));

const BackgroundImage = styled("div")(({ userData }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: `url(${userData?.avatar})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: 1,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backdropFilter: "blur(35px)",
    WebkitBackdropFilter: "blur(35px)",
    background:
      "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 100%)", // Adjusted gradient
  },
}));

const Header = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  padding: "1rem",
  display: "flex",
  justifyContent: "flex-end", // Align buttons to the right
  alignItems: "center",
  zIndex: 2,
  gap: "0.5rem", // Add gap between buttons
});

const IconButton = styled("button")({
  width: "40px",
  height: "40px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "50%",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  color: "#fff",
  fontSize: "1.2rem",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
  },
});

const BottomSection = styled("div")(({ isMobile }) => ({
  position: "absolute",
  bottom: 0,
  width: "100%",
  backdropFilter: "blur(2px)",
  WebkitBackdropFilter: "blur(2px)",
  background: `linear-gradient(
        to top,
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0.3) 10%,
        rgba(0, 0, 0, 0) 100%
      )`,
  padding: isMobile ? "1rem" : "1.5rem", // Reduced padding for mobile
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  gap: "1rem", // Add gap between elements
}));

const Title = styled("h2")({
  margin: 0,
  fontSize: "1.25rem", // Smaller font size
  fontWeight: "bold",
  color: "#fff",
});

const Subtitle = styled("p")({
  margin: "0.25rem 0",
  fontSize: "1rem", // Smaller font size
  color: "#ccc",
});

const ProfileRow = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  flexWrap: "wrap",
});

const RightSide = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

const LeftSide = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
});

const UserNameRow = styled("div")({
  display: "inline-flex", // This keeps items together inline
  alignItems: "center",
  gap: "0.25rem",
  fontWeight: 600,
  fontSize: "1rem",
  whiteSpace: "nowrap", // Prevents wrapping
  overflow: "hidden", // Hides overflow
  textOverflow: "ellipsis", // Adds ellipsis when too long
  cursor: "default",
});

const OnlineStatus = styled("div")(({ isOnline }) => ({
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  backgroundColor: isOnline ? "#31A24C" : "#B0B3B8",
}));

const OnlineStatusContainer = styled("p")({
  display: "flex",
  alignItems: "center",
  margin: "4px 0 0",
  fontSize: "0.875rem",
  color: "#aaa",
  fontStyle: "italic",
});

const TransparentButton = styled(Button)({
  color: "#fff",
  borderColor: "#fff",
  textTransform: "none",
  borderRadius: "24px",
  padding: "0.25rem 1rem",
  fontSize: "0.85rem",
  backdropFilter: "blur(10px)",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  marginTop: "12px",
});

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    padding: "0.5rem 0",
    minWidth: "200px",
  },
  "& .MuiMenuItem-root": {
    color: "#fff",
    fontSize: "0.9rem",
    padding: "0.75rem 1.5rem",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
}));

const UserProfile = ({
  isMobile,
  userData,
  calculateAge,
  userLocation,
  toggleEditModal,
  handleSaveSocialMediaLinks,
  isLoggedUserProfile,
  isEditModalOpen,
  handleSaveChanges,
  isSocialMediaModalOpen,
  toggleSocialMediaModal,
  isLinkupsModalOpen,
  toggleLinkupsModal,
  addSnackbar,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/profile/${userData?.id}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      addSnackbar("Profile URL copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy profile URL:", error);
    }
  };

  const handleSocialMediaClick = () => {
    toggleSocialMediaModal();
    handleMenuClose();
  };

  // Conditionally render the loading spinner until the userData is available
  if (!userData) {
    return <LoadingSpinner />;
  }

  return (
    <UserProfileContainer isMobile={isMobile}>
      <BackgroundImage userData={userData} />
      <Header>
        <IconButton onClick={handleShare} aria-label="Share profile">
          <FaShare />
        </IconButton>
        <MoreButtonWrapper>
          {isLoggedUserProfile &&
            userData &&
            !userData.instagram_url &&
            !userData.facebook_url &&
            !userData.twitter_url && (
              <BouncingNotifier>Link your socials!</BouncingNotifier>
            )}
          <IconButton onClick={handleMenuOpen} aria-label="More options">
            <FaEllipsisH />
          </IconButton>
        </MoreButtonWrapper>
      </Header>
      <BottomSection isMobile={isMobile}>
        <div>
          <Title>{userData?.bio}</Title>
          <Box display="flex" flexDirection="column" gap="0.8rem">
            <Subtitle>
              {userData?.name}, {calculateAge(userData?.date_of_birth)} •{" "}
              {userLocation}
            </Subtitle>
            <Typography
              variant="body2"
              sx={{
                color: "#fff",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={toggleLinkupsModal}
            >
              {userData?.total_linkups} Created Linkups
            </Typography>
          </Box>
        </div>

        <Divider
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            margin: "1rem 0",
          }}
        />

        <ProfileRow isMobile={isMobile}>
          <LeftSide>
            <Avatar
              alt="User Name"
              src={userData?.avatar}
              sx={{ width: isMobile ? 80 : 100, height: isMobile ? 80 : 100 }} // Smaller avatar on mobile
            />
            <div>
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <UserNameRow>
                  <span>@{userData?.name}</span>
                  <MdVerified />
                </UserNameRow>
              </Box>

              <OnlineStatusContainer>
                <OnlineStatus isOnline={userData?.is_online} />
                <p style={{ marginLeft: 4 }}>
                  {userData?.is_online ? "Online" : "Offline"}
                </p>
              </OnlineStatusContainer>
            </div>
          </LeftSide>

          <RightSide>
            {isLoggedUserProfile && (
              <TransparentButton onClick={toggleEditModal} variant="outlined">
                Edit
              </TransparentButton>
            )}
          </RightSide>
        </ProfileRow>
      </BottomSection>
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "more-button",
        }}
      >
        <MenuItem onClick={handleSocialMediaClick}>Social Media Links</MenuItem>
      </StyledMenu>
      <UserProfileEditModal
        isOpen={isEditModalOpen}
        onClose={toggleEditModal}
        userData={userData}
        onSave={handleSaveChanges}
      />
      <LinkupsModal
        userId={userData?.id}
        open={isLinkupsModalOpen}
        onClose={toggleLinkupsModal}
      />
      <SocialMediaLinks
        userData={userData}
        onSave={handleSaveSocialMediaLinks}
        isLoggedUserProfile={isLoggedUserProfile}
        open={isSocialMediaModalOpen}
        onClose={toggleSocialMediaModal}
      />
    </UserProfileContainer>
  );
};

export default React.memo(UserProfile);
