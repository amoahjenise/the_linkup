import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import InstagramIcon from "@material-ui/icons/Instagram";
import UserAvatar from "./UserAvatar";
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "sticky",
    top: 0,
  },
  card: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  avatarSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(1),
    flex: 1,
    // borderRightWidth: "1px",
    // borderRightColor: "1px solid #D3D3D3",
  },
  detailsSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  socialButtons: {
    marginTop: theme.spacing(1),
  },
  editButton: {
    padding: theme.spacing(2),
    marginLeft: "-5rem",
  },
  button: {
    background: `rgba(0, 151, 167, 0.6)`,
    color: theme.palette.primary.contrastText,
    fontWeight: "bold",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#0099B7",
    },
  },
  statisticsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  statisticsItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginRight: theme.spacing(2),
  },
  icon: {
    fontSize: "1.5rem", // Adjust icon size as needed
  },
  locationSection: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  locationText: {
    fontWeight: "normal",
  },
  storiesContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: theme.spacing(2),
  },
  storyCircle: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    backgroundColor: "#D3D3D3",
    position: "relative",
    marginLeft: theme.spacing(4),
  },
  plusCircle: {
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
  },
  plusIcon: {
    fontSize: "1rem",
    color: "white",
  },
}));

const ProfileHeaderCard = ({
  userData,
  userLocation,
  calculateAge,
  renderEditButton,
}) => {
  const classes = useStyles();
  const { colorMode } = useColorMode();

  // Define text color based on color mode
  const textColor = colorMode === "dark" ? "#FFFFFF" : "#000000";

  // Define background color based on color mode
  const backgroundColor =
    colorMode === "dark"
      ? "rgba(18, 28, 38, 0.19)" // Dark mode background color with 90% transparency
      : "rgba(255, 255, 255, 0.99)"; // Light mode background color

  return (
    <div className={classes.container}>
      <Card className={classes.card} style={{ backgroundColor }}>
        <Box className={classes.avatarSection}>
          <CardHeader
            title={
              <>
                <Typography
                  variant="h5"
                  style={{ color: textColor, fontWeight: "bold" }}
                >
                  {userData?.name}, {calculateAge(userData?.date_of_birth)}
                </Typography>
                <Box className={classes.locationSection}>
                  <LocationOnIcon style={{ color: "#FF3348" }} />
                  <Typography
                    className={classes.locationText}
                    style={{ color: textColor }}
                  >
                    {userLocation}
                  </Typography>
                </Box>
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
          <Box className={classes.statisticsContainer}>
            <div className={classes.statisticsItem}>
              <p className={classes.icon} style={{ color: "#C13584" }}>
                ...
              </p>
              <Typography
                variant="body2"
                align="center"
                style={{ color: textColor }} // Set text color for statistics
              >
                Created Linkups
              </Typography>
            </div>
            <div className={classes.statisticsItem}>
              <p className={classes.icon} style={{ color: "#833AB4" }}>
                ...
              </p>
              <Typography
                variant="body2"
                align="center"
                style={{ color: textColor }} // Set text color for statistics
              >
                Completed Linkups
              </Typography>
            </div>
            <div className={classes.statisticsItem}>
              <p className={classes.icon} style={{ color: "#1DA1F2" }}>
                ...
              </p>
              <Typography
                variant="body2"
                align="center"
                style={{ color: textColor }} // Set text color for statistics
              >
                Linkup Rating Score
              </Typography>
            </div>
          </Box>
          <Box className={classes.socialButtons}>
            <IconButton>
              <FacebookIcon style={{ color: "#1877f2" }} />
            </IconButton>
            <IconButton>
              <TwitterIcon style={{ color: "#1da1f2" }} />
            </IconButton>
            <IconButton>
              <InstagramIcon style={{ color: "#c32aa3" }} />
            </IconButton>
          </Box>
        </Box>

        {/* <CardContent className={classes.detailsSection}>
          <Box className={classes.storiesContainer}>
            <div className={classes.storyCircle}>
              <div className={classes.plusCircle}>
                <Typography className={classes.plusIcon}>+</Typography>
              </div>
            </div>
            <div className={classes.storyCircle}>
              <div className={classes.plusCircle}>
                <Typography className={classes.plusIcon}>+</Typography>
              </div>
            </div>
            <div className={classes.storyCircle}>
              <div className={classes.plusCircle}>
                <Typography className={classes.plusIcon}>+</Typography>
              </div>
            </div>
            <div className={classes.storyCircle}>
              <div className={classes.plusCircle}>
                <Typography className={classes.plusIcon}>+</Typography>
              </div>
            </div>
            <div className={classes.storyCircle}>
              <div className={classes.plusCircle}>
                <Typography className={classes.plusIcon}>+</Typography>
              </div>
            </div>
          </Box>
        </CardContent> */}
        <div className={classes.editButton}>
          {renderEditButton && renderEditButton()}
        </div>
      </Card>
    </div>
  );
};

export default ProfileHeaderCard;
