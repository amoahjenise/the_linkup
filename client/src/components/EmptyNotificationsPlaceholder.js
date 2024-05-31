import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(6),
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
      padding: theme.spacing(10),
      gap: theme.spacing(7),
    },
  },
  textContainer: {
    textAlign: "center",
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      marginBottom: 0,
      paddingRight: theme.spacing(6),
    },
  },
  heading: {
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
  },
  subtext: {
    marginBottom: theme.spacing(3),
  },
  button: {
    backgroundColor: "#0097A7",
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: "#007b86",
    },
  },
  image: {
    maxWidth: "100%",
    height: "auto",
  },
  imageContainer: {
    textAlign: "center",
  },
}));

const EmptyNotificationsPlaceholder = () => {
  const classes = useStyles();

  const goToHomePage = () => {
    window.location.href = "/home";
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.textContainer}>
        <Typography variant="h4" className={classes.heading}>
          You have no notifications
        </Typography>
        <Typography variant="body1" className={classes.subtext}>
          Visit the feed to link up with others and stay connected.
        </Typography>
        <Button
          variant="contained"
          className={classes.button}
          onClick={goToHomePage}
        >
          Go to Feed
        </Button>
      </Box>
    </Box>
  );
};

export default EmptyNotificationsPlaceholder;
