import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import LogoHeader from "../components/LogoHeader";
import RegistrationProcess from "../components/RegistrationProcess";

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "90vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  content: {
    textAlign: "center",
  },
  title: {
    fontWeight: "bold",
    marginBottom: theme.spacing(4),
  },
  logoContainer: {
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(2),
    },
  },
  logo: {
    height: "50px",
  },
}));

const SignupPage = () => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.container}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <div className={classes.content}>
              <LogoHeader />
              <RegistrationProcess />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default SignupPage;
