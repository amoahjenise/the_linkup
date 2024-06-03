import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button, Container, Box } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";
import TopNavBar from "./TopNavBar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    textAlign: "center",
    marginTop: theme.spacing(8),
  },
  container: {
    padding: theme.spacing(4),
  },
  icon: {
    fontSize: "3rem",
    color: "#0097A7",
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: "#0097A7",
    color: "white",
    "&:hover": {
      backgroundColor: "#007b86", // Slightly darker color on hover
    },
  },
}));

const EnableLocation = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const secondaryTextColor =
    colorMode === "dark"
      ? "white" // Dark mode background color with no transparency
      : "textSecondary";

  const handleSettingsClick = () => {
    navigate("/settings"); // Redirect to settings page
  };

  return (
    <div>
      <TopNavBar title="Home" />

      <Box className={classes.root}>
        <Container className={classes.container}>
          <SettingsIcon className={classes.icon} />
          <Typography variant="h5" gutterBottom>
            In order to use Link-Up, please enable location sharing via
            Settings.
          </Typography>
          <Typography variant="body1" color={secondaryTextColor}>
            Location sharing allows us to provide you with the best experience
            by connecting you with nearby people and events.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleSettingsClick}
            startIcon={<SettingsIcon />}
          >
            Go to Settings
          </Button>
        </Container>
      </Box>
    </div>
  );
};

export default EnableLocation;
