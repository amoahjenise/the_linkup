import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import LogoHeader from "../components/LogoHeader";
import RegistrationProcess from "../components/RegistrationProcess";

const useStyles = makeStyles((theme) => ({
  container: {
    flex: "2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflowY: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    minHeight: "100vh", // Set the minimum height of the container to cover the entire viewport height
    padding: theme.spacing(2),
  },
}));

const SignupPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <div>
            <LogoHeader />
            <RegistrationProcess />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default SignupPage;
