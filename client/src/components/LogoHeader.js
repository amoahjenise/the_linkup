import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import logo from "../logo.png";

const useStyles = makeStyles((theme) => ({
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

const LogoHeader = () => {
  const classes = useStyles();

  return (
    <div>
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
