import React from "react";
import { SignUp } from "@clerk/clerk-react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function ClerkCustomSignUp() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SignUp afterSignInUrl={"/home"} afterSignUpUrl={"/registration"} />
    </div>
  );
}
