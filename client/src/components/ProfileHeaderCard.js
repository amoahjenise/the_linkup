import React from "react";
import { styled } from "@mui/material/styles";
import { Typography, IconButton, CardHeader, Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import UserAvatar from "./UserAvatar";
import { useColorMode } from "@chakra-ui/react";

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "sticky",
  top: 0,
  borderBottom: "1px solid #D3D3D3",
}));

const Card = styled("div")(({ theme, backgroundColor }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  backgroundColor: backgroundColor,
}));

const AvatarSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1),
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
  fontSize: "1.5rem", // Adjust icon size as needed
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
}));

const StoriesContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  marginRight: theme.spacing(2),
}));

const StoryCircle = styled("div")(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: "50%",
  backgroundColor: "#D3D3D3",
  position: "relative",
  marginLeft: theme.spacing(4),
}));

const PlusCircle = styled("div")(({ theme }) => ({
  width: 25,
  height: 25,
  borderWidth: "2px",
  borderColor: "black",
  borderRadius: "50%",
  backgroundColor: "blue",
  position: "absolute",
  bottom: theme.spacing(1),
  left: theme.spacing(1),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const PlusIcon = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: "white",
}));

const ProfileHeaderCard = ({
  userData,
  userLocation,
  calculateAge,
  renderEditButton,
}) => {
  const { colorMode } = useColorMode();

  // Define text color based on color mode
  const textColor = colorMode === "dark" ? "#FFFFFF" : "#000000";

  // Define background color based on color mode
  const backgroundColor =
    colorMode === "dark"
      ? "rgba(18, 28, 38, 0.19)" // Dark mode background color with 90% transparency
      : "rgba(255, 255, 255, 0.99)"; // Light mode background color

  const capitalizeFirstLetter = (string) => {
    if (typeof string !== "string") return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <Container>
      <Card backgroundColor={backgroundColor}>
        <AvatarSection>
          <CardHeader
            title={
              <>
                <Typography
                  variant="h5"
                  style={{ color: textColor, fontWeight: "bold" }}
                >
                  {capitalizeFirstLetter(userData?.name)},{" "}
                  {calculateAge(userData?.date_of_birth)}
                </Typography>
                <LocationSection>
                  <LocationOnIcon style={{ color: "#FF3348" }} />
                  <LocationText style={{ color: textColor }}>
                    {userLocation}
                  </LocationText>
                </LocationSection>
              </>
            }
            subheader={
              <Typography
                variant="body2"
                style={{ color: textColor, fontWeight: "bold" }}
                gutterBottom
              >
                {userData?.bio}
              </Typography>
            }
            avatar={
              <UserAvatar userData={userData} width="100px" height="100px" />
            }
            style={{ color: textColor }} // Set text color for card header
          />
          <StatisticsContainer>
            <StatisticsItem>
              <Icon color="#C13584">...</Icon>
              <Typography
                variant="body2"
                align="center"
                style={{ color: textColor }} // Set text color for statistics
              >
                Created Linkups
              </Typography>
            </StatisticsItem>
            <StatisticsItem>
              <Icon color="#833AB4">...</Icon>
              <Typography
                variant="body2"
                align="center"
                style={{ color: textColor }} // Set text color for statistics
              >
                Completed Linkups
              </Typography>
            </StatisticsItem>
            <StatisticsItem>
              <Icon color="#1DA1F2">...</Icon>
              <Typography
                variant="body2"
                align="center"
                style={{ color: textColor }} // Set text color for statistics
              >
                Linkup Rating Score
              </Typography>
            </StatisticsItem>
          </StatisticsContainer>
          <SocialButtons>
            <IconButton size="large">
              <FacebookIcon style={{ color: "#1877f2" }} />
            </IconButton>
            <IconButton size="large">
              <TwitterIcon style={{ color: "#1da1f2" }} />
            </IconButton>
            <IconButton size="large">
              <InstagramIcon style={{ color: "#c32aa3" }} />
            </IconButton>
          </SocialButtons>
        </AvatarSection>

        {/* <CardContent className={classes.detailsSection}>
          <StoriesContainer>
            <StoryCircle>
              <PlusCircle>
                <PlusIcon>+</PlusIcon>
              </PlusCircle>
            </StoryCircle>
            <StoryCircle>
              <PlusCircle>
                <PlusIcon>+</PlusIcon>
              </PlusCircle>
            </StoryCircle>
            <StoryCircle>
              <PlusCircle>
                <PlusIcon>+</PlusIcon>
              </PlusCircle>
            </StoryCircle>
            <StoryCircle>
              <PlusCircle>
                <PlusIcon>+</PlusIcon>
              </PlusCircle>
            </StoryCircle>
            <StoryCircle>
              <PlusCircle>
                <PlusIcon>+</PlusIcon>
              </PlusCircle>
            </StoryCircle>
          </StoriesContainer>
        </CardContent> */}
        <EditButton>{renderEditButton && renderEditButton()}</EditButton>
      </Card>
    </Container>
  );
};

export default ProfileHeaderCard;
