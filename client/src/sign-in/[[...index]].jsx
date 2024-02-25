import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  section: {
    paddingTop: theme.spacing(6),
  },
  container: {
    display: "flex",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function ClerkCustomSignIn() {
  const classes = useStyles();

  return (
    <section className={classes.section}>
      <div className={classes.container}>
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          redirectUrl={"/home"}
        />
      </div>
    </section>
  );
}
