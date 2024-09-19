import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";
import UserAvatar from "./UserAvatar";
import { useColorMode } from "@chakra-ui/react";
import {
  getUserMedia,
  postInstagramAccessToken,
  getAccessToken,
} from "../api/instagramAPI";
import banner from "../assets/Banner.jpg"; // Import the local banner image

// Styled components
const Container = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  borderBottom: `1px solid ${theme.palette.divider}`,
  textAlign: "center",
  color: theme.palette.text.primary,
  position: "relative",
}));

const PromoSection = styled(Box)(({ theme, colorMode, promoHeight }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  alignItems: "center",
  padding: theme.spacing(6),
  height: promoHeight, // Control height dynamically
  color: theme.palette.text.primary,
  position: "relative",
  background:
    colorMode === "light"
      ? `linear-gradient(to right, rgba(0, 0, 0, 1) 45%, transparent 70%), url(${banner})`
      : `linear-gradient(to right, rgba(0, 0, 0, 0.98) 46%, transparent 70%), url(${banner})`,
  backgroundSize: "cover",
  backgroundPosition: "center top",
  transition: "height 0.5s ease-out", // Smooth collapse
}));

const TextContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
  zIndex: 1, // Ensure text is above the background image
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  border: "2px solid white",
  marginRight: theme.spacing(3),
}));

const InnerHeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "left",
}));

const ProfileContent = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}));

const ProfileContentContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: "rgba(255,255,255,0.1)",
}));

const ProfileHeaderCard = ({
  userData,
  userLocation,
  renderEditButton,
  calculateAge,
  setProfileImages,
  promoHeight,
  promoRef,
}) => {
  const { colorMode } = useColorMode();
  const textColor = colorMode === "dark" ? "white" : "#333333"; // Adjusted text color

  useEffect(() => {
    const fetchInstagramMedia = async (code) => {
      try {
        const accessToken = await getAccessToken(code);
        await postInstagramAccessToken(userData.id, accessToken); // Save the access token to the backend
        const instagramMediaResponse = await getUserMedia(accessToken);

        if (instagramMediaResponse.success) {
          const instagramImageUrls = instagramMediaResponse.data.data.map(
            (imageObj) => imageObj.media_url
          );
          setProfileImages(instagramImageUrls); // Update profile images
        }
      } catch (error) {
        console.error("Error fetching Instagram media:", error);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      fetchInstagramMedia(code);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [userData, setProfileImages]);

  return (
    <Container>
      <PromoSection colorMode={colorMode}>
        <TextContainer>
          <Typography
            variant="body1"
            sx={{
              color: "white",
              marginBottom: "1.5rem",
              fontWeight: "500",
            }}
          >
            {userData?.name}, {calculateAge(userData?.date_of_birth)} •{" "}
            {userLocation}
            {/* • Online 6 days ago */}
          </Typography>
          <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
            {userData?.bio}
          </Typography>
        </TextContainer>
      </PromoSection>
      <ProfileContentContainer>
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
          <Box sx={{ marginLeft: "auto" }}>{renderEditButton()}</Box>
        </ProfileContent>
      </ProfileContentContainer>
    </Container>
  );
};

export default ProfileHeaderCard;
