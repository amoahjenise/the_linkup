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
  height: isMobile ? "calc(100dvh - 110px)" : "calc(100% - 64px)", // Changed to full viewport height
  overflow: "auto",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
}));

const BackgroundImage = styled("div")(({ userData, isMobile }) => ({
  position: isMobile ? "absolute" : "fixed",
  top: 0,
  width: isMobile ? "100%" : "calc(100% - 100px)", // Subtract left menu width
  height: "100dvh", // Use viewport height instead of 100%
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
      "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 100%)",
  },
}));

const ContentWrapper = styled("div")(({ isMobile }) => ({
  position: "relative",
  zIndex: 2,
  flex: 1,
  display: "flex",
  flexDirection: "column",
}));

const Header = styled("div")({
  position: "sticky",
  top: 0,
  left: 0,
  width: "100%",
  padding: "1rem",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  zIndex: 10,
  gap: "0.5rem",
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
  width: "100%",
  padding: isMobile ? "1rem" : "1.5rem",
  marginTop: "auto",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(2px)",
    background: `linear-gradient(
      to top,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.3) 10%,
      rgba(0, 0, 0, 0) 100%
    )`,
    zIndex: -1,
  },
}));

const Title = styled("h2")(({ isMobile }) => ({
  margin: 0,
  fontSize: "1.25rem",
  fontWeight: "bold",
  color: "#fff",
  marginBottom: "1rem",
  wordBreak: "break-word",
}));

const Subtitle = styled("p")(({ isMobile }) => ({
  margin: "0.25rem 0",
  fontSize: isMobile ? "1.1rem" : "1.25rem",
  color: "#ccc",
  wordBreak: "break-word",
}));

const ProfileRow = styled("div")(({ isMobile }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  flexWrap: "wrap",
  gap: isMobile ? "1rem" : "0",
}));

const RightSide = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

const LeftSide = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  flexWrap: "wrap",
});

const UserNameRow = styled("div")(({ isMobile }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.25rem",
  fontWeight: 600,
  fontSize: isMobile ? "1rem" : "1.25rem",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  cursor: "default",
}));

const OnlineStatus = styled("div")(({ isOnline }) => ({
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  backgroundColor: isOnline ? "#31A24C" : "#B0B3B8",
}));

const OnlineStatusContainer = styled("p")(({ isMobile }) => ({
  display: "flex",
  alignItems: "center",
  margin: "4px 0 0",
  fontSize: isMobile ? "0.875rem" : "1rem",
  color: "#aaa",
  fontStyle: "italic",
}));

const TransparentButton = styled(Button)(({ isMobile }) => ({
  color: "#fff",
  borderColor: "#fff",
  textTransform: "none",
  borderRadius: "24px",
  padding: isMobile ? "0.25rem 1rem" : "0.5rem 1.5rem",
  fontSize: isMobile ? "0.85rem" : "1rem",
  backdropFilter: "blur(10px)",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  marginTop: isMobile ? "8px" : "0",
}));

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

  if (!userData) {
    return <LoadingSpinner />;
  }

  return (
    <UserProfileContainer isMobile={isMobile}>
      <BackgroundImage userData={userData} isMobile={isMobile} />

      <ContentWrapper isMobile={isMobile}>
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

        <Box flex={1} />

        <BottomSection isMobile={isMobile}>
          <div>
            <Title isMobile={isMobile}>{userData?.bio}</Title>
            <Box display="flex" flexDirection="column" gap="0.8rem">
              <Subtitle isMobile={isMobile}>
                {userData?.name}, {calculateAge(userData?.date_of_birth)} •{" "}
                {userLocation}
              </Subtitle>
              <Typography
                variant="body2"
                sx={{
                  color: "#fff",
                  fontSize: isMobile ? "0.95rem" : "1rem",
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
                sx={{
                  width: isMobile ? 80 : 100,
                  height: isMobile ? 80 : 100,
                  flexShrink: 0,
                }}
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
                  <UserNameRow isMobile={isMobile}>
                    <span>@{userData?.name}</span>
                    <MdVerified />
                  </UserNameRow>
                </Box>

                <OnlineStatusContainer isMobile={isMobile}>
                  <OnlineStatus isOnline={userData?.is_online} />
                  <p style={{ marginLeft: 4 }}>
                    {userData?.is_online ? "Online" : "Offline"}
                  </p>
                </OnlineStatusContainer>
              </div>
            </LeftSide>

            <RightSide>
              {isLoggedUserProfile && (
                <TransparentButton
                  isMobile={isMobile}
                  onClick={toggleEditModal}
                  variant="outlined"
                >
                  Edit
                </TransparentButton>
              )}
            </RightSide>
          </ProfileRow>
        </BottomSection>
      </ContentWrapper>

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
        isMobile={isMobile}
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
