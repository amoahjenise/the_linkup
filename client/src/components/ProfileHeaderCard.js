import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Typography, IconButton, CardHeader, Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import UserAvatar from "./UserAvatar";
import { useColorMode } from "@chakra-ui/react";
import {
  getUserMedia,
  redirectToInstagramLogin,
  postInstagramAccessToken,
  getAccessToken,
} from "../api/instagramAPI";

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "sticky",
  top: 0,
  borderBottom: "1px solid #e7e6e6", // Light peach color for border
}));

const Card = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  borderRadius: "8px",
  // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for a floating effect
}));

const AvatarSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  flex: 1,
}));

const SocialButtons = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const EditButton = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  marginLeft: "-5rem",
}));

const StatisticsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const StatisticsItem = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginRight: theme.spacing(2),
}));

const Icon = styled("p")(({ color }) => ({
  fontSize: "1.5rem",
  color: color,
}));

const LocationSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const LocationText = styled(Typography)(({ theme }) => ({
  fontWeight: "normal",
  color: "#FF6F61", // Warm coral color for location text
}));

const ProfileHeaderCard = ({
  isMobile,
  userData,
  userLocation,
  renderEditButton,
  calculateAge,
  setProfileImages,
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
      <Card>
        <AvatarSection>
          <CardHeader
            title={
              <>
                <Typography
                  variant="h5"
                  sx={{ color: textColor, fontWeight: "bold" }}
                >
                  {userData?.name}, {calculateAge(userData?.date_of_birth)}
                </Typography>
                <LocationSection>
                  <LocationOnIcon sx={{ color: "#FF6F61" }} />
                  <LocationText sx={{ color: textColor }}>
                    {userLocation}
                  </LocationText>
                </LocationSection>
              </>
            }
            subheader={
              <Typography
                variant="body2"
                sx={{ color: textColor, fontWeight: "bold" }}
                gutterBottom
              >
                {userData?.bio}
              </Typography>
            }
            avatar={
              <UserAvatar userData={userData} width="100px" height="100px" />
            }
          />
          <StatisticsContainer>
            <StatisticsItem>
              <Icon color="#F2A900">{userData.total_linkups}</Icon>{" "}
              {/* Sun yellow for statistics */}
              <Typography
                variant="body2"
                align="center"
                sx={{ color: textColor }}
              >
                Created Linkups
              </Typography>
            </StatisticsItem>
            <StatisticsItem>
              <Icon color="#FF6F61">{userData.completed_linkups}</Icon>{" "}
              {/* Coral for statistics */}
              <Typography
                variant="body2"
                align="center"
                sx={{ color: textColor }}
              >
                Completed Linkups
              </Typography>
            </StatisticsItem>
            <StatisticsItem>
              {/* <Icon color="#F2A900">★★★★★</Icon>{" "} */}
              <Icon color="#F2A900">...</Icon> {/* Sun yellow for statistics */}
              {/* Bright yellow for statistics */}
              <Typography
                variant="body2"
                align="center"
                sx={{ color: textColor }}
              >
                Linkup Rating Score
              </Typography>
            </StatisticsItem>
          </StatisticsContainer>
          <SocialButtons>
            <IconButton size="large">
              <FacebookIcon sx={{ color: "#3b5998" }} />
            </IconButton>
            <IconButton size="large" onClick={redirectToInstagramLogin}>
              <InstagramIcon sx={{ color: "#C13584" }} />
            </IconButton>
            <IconButton size="large">
              <TwitterIcon sx={{ color: "#1DA1F2" }} />
            </IconButton>
          </SocialButtons>
        </AvatarSection>
        <EditButton>{renderEditButton && renderEditButton()}</EditButton>
      </Card>
    </Container>
  );
};

export default ProfileHeaderCard;
