import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import logo from "../logo.png";

const useStyles = makeStyles((theme) => ({
  main: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  },
  title: {
    fontWeight: "bold",
  },
  logoContainer: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(0),
    },
  },
  logo: {
    height: "40px",
  },
}));

const LogoHeader = () => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <div className={classes.logoContainer}>
        <img src={logo} alt="Logo" className={classes.logo} />
      </div>
      <Typography variant="h4" component="h1" className={classes.title}>
        LUUL
      </Typography>
    </div>
  );
};

export default LogoHeader;
