import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Logo from "../logo.png"; // Import the logo image
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Center horizontally
    justifyContent: "center", // Center vertically
    minHeight: "100vh", // Ensure the container takes full height of the viewport
    textAlign: "center", // Center text horizontally
  },
  logo: {
    width: 80,
    marginBottom: 20,
  },
  errorMessage: {
    fontSize: 24,
    color: theme.palette.primary.main,
  },
  errorDescription: {
    color: theme.palette.text.secondary,
  },
  retryButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: 20,
    padding: "10px 20px",
    marginTop: 20,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const ErrorPage = ({ onRetry }) => {
  const classes = useStyles();
  const { colorMode } = useColorMode();
  const filterStyle =
    colorMode === "dark" ? "invert(0.879) grayscale(70%)" : "none"; // Set filter style based on colorMode

  return (
    <div className={classes.errorContainer}>
      <img
        src={Logo}
        alt="LUUL Logo"
        className={classes.logo}
        style={{ filter: filterStyle }}
      />
      <h1 className={classes.errorMessage}>Oops! Something went wrong.</h1>
      <p className={classes.errorDescription}>
        We're sorry, but we couldn't fetch the data from our servers.
      </p>
      <Button
        variant="contained"
        className={classes.retryButton}
        onClick={onRetry}
      >
        Retry
      </Button>
      <p className={classes.errorDescription}>
        If the problem persists, please contact support.
      </p>
    </div>
  );
};

export default ErrorPage;
