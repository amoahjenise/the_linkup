import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    padding: theme.spacing(2),
    width: "100%",
  },
  message: {
    fontSize: "1.5rem",
    margin: theme.spacing(2, 0),
  },
}));

const LastStep = ({ clerkUser }) => {
  const classes = useStyles();

  const name = clerkUser.firstName;
  const formattedName =
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const welcomeMessage = `Let's get started, ${formattedName}!`;

  return (
    <div className={classes.root}>
      <h2 className={classes.message}>{welcomeMessage}</h2>
    </div>
  );
};

export default LastStep;
