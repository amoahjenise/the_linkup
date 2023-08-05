import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import UserAuthentication from "../components/UserAuthentication";
import PhoneVerification from "../components/PhoneVerification";
import LogoHeader from "../components/LogoHeader";

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

const LoginPage = () => {
  const classes = useStyles();
  const [isNavigateToUserAuthentication, setNavigateToUserAuthentication] =
    useState(false);
  const [password, setPassword] = useState("");

  const handleNavigateToUserAuthentication = () => {
    setTimeout(() => {
      setNavigateToUserAuthentication(true);
    }, 0);
  };

  return (
    <div className={classes.container}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <div className={classes.content}>
            <LogoHeader />
            {isNavigateToUserAuthentication ? (
              <UserAuthentication
                password={password}
                setPassword={setPassword}
              />
            ) : (
              <PhoneVerification
                action="LOGIN"
                setNavigateToUserAuthentication={
                  handleNavigateToUserAuthentication
                }
              />
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginPage;
