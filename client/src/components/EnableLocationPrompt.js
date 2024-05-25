import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button, Container, Box } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: theme.spacing(2),
    borderRightWidth: "1px",
    borderRightColor: "0.1px solid #D3D3D3",
  },
  container: {
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
  },
  icon: {
    fontSize: "3rem",
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const EnableLocationPrompt = () => {
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
    <div className={classes.root}>
      <Container className={classes.container}>
        <SettingsIcon className={classes.icon} />
        <Typography variant="h5" gutterBottom>
          In order to use Linkup, please enable location sharing via Settings.
        </Typography>
        <Typography variant="body1" color={secondaryTextColor}>
          Location sharing allows us to provide you with the best experience by
          connecting you with nearby people and events.
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
    </div>
  );
};

export default EnableLocationPrompt;
