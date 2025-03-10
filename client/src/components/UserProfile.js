import React, { useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { FaEllipsisH, FaShare } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { Button, Divider, Menu, MenuItem, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import LinkupsModal from "./LinkupsModal";
import SocialMediaLinks from "../components/SocialMediaLinks";
import UserProfileEditModal from "./UserProfileEditModal";

// Container
const UserProfileContainer = styled("div")(({ isMobile }) => ({
  position: "relative",
  width: "100%",
  height: isMobile ? "calc(100vh - 110px)" : "91vh", // Adjust height for mobile
  overflow: "hidden",
  color: "#fff",
  paddingTop: isMobile ? "60px" : "0", // Add padding to avoid overlapping with the top navbar
}));

// Background Image with Gradient Overlay
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
      "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 110%)",
  },
}));

// Header
const Header = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  padding: "1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  zIndex: 2,
});

const HeaderLeft = styled("div")({
  display: "flex",
  alignItems: "center",
});

const HeaderCenter = styled("div")({
  display: "flex",
  alignItems: "center",
});

const HeaderRight = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

// Circular Icon Button with transparent blur effect
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

// Bottom Section
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
  padding: "1.5rem",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "background 0.5s ease-in-out",
  marginTop: isMobile ? "60px" : "0", // Add margin to avoid overlapping with the header
}));

// Title & Subtitle
const Title = styled("h2")({
  margin: 0,
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#fff",
});

const Subtitle = styled("p")({
  margin: "0.25rem 0 1rem",
  fontSize: "1rem",
  color: "#ccc",
});

// Layout Row
const ProfileRow = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
});

const LeftSide = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
});

const RightSide = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

// Username + Verified Icon
const UserNameRow = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
  fontWeight: 600,
});

// Online Status Dot (optional)
const OnlineStatus = styled("div")({
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  backgroundColor: "#31A24C",
});

// Edit Profile Button with blur
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
});

// Time Ago Styling
const OnlineStatusContainer = styled("p")({
  display: "flex",
  alignItems: "center",
  margin: "4px 0 0",
  fontSize: "0.75rem",
  color: "#aaa",
  fontStyle: "italic",
});

// Styled Menu for Social Media Links
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

  return (
    <UserProfileContainer isMobile={isMobile}>
      <BackgroundImage userData={userData} />
      <Header>
        <HeaderLeft></HeaderLeft>
        <HeaderCenter></HeaderCenter>
        <HeaderRight>
          <IconButton onClick={handleShare} aria-label="Share profile">
            <FaShare />
          </IconButton>
          <IconButton onClick={handleMenuOpen} aria-label="More options">
            <FaEllipsisH />
          </IconButton>
        </HeaderRight>
      </Header>
      <BottomSection>
        <div>
          <Title>{userData?.bio}</Title>
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
        </div>

        <Divider
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            margin: "1rem 0",
          }}
        />

        <ProfileRow>
          <LeftSide>
            <Avatar
              alt="User Name"
              src={userData?.avatar}
              sx={{ width: 56, height: 56 }}
            />
            <div>
              <UserNameRow>
                <span>@{userData?.name}</span>
                <MdVerified />
              </UserNameRow>

              <OnlineStatusContainer>
                <OnlineStatus />
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

UserProfile.propTypes = {
  isMobile: PropTypes.bool,
  userData: PropTypes.object.isRequired,
  calculateAge: PropTypes.func.isRequired,
  userLocation: PropTypes.string,
  toggleEditModal: PropTypes.func.isRequired,
  handleSaveSocialMediaLinks: PropTypes.func.isRequired,
  isLoggedUserProfile: PropTypes.bool.isRequired,
  isEditModalOpen: PropTypes.bool.isRequired,
  handleSaveChanges: PropTypes.func.isRequired,
  isSocialMediaModalOpen: PropTypes.bool.isRequired,
  toggleSocialMediaModal: PropTypes.func.isRequired,
  isLinkupsModalOpen: PropTypes.bool.isRequired,
  toggleLinkupsModal: PropTypes.func.isRequired,
  addSnackbar: PropTypes.func.isRequired,
};

export default React.memo(UserProfile);
