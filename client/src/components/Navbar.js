import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../logo.png";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(2),
    borderBottom: "1px solid lightgrey",
  },
  logo: {
    height: "50px",
  },
}));

const Navbar = ({ onLoginClick, buttonText }) => {
  const classes = useStyles();

  return (
    <nav className={classes.navbar}>
      <img src={logo} alt="Logo" className={classes.logo} />
      <div className="cta-buttons">
        <Button variant="outlined" color="primary" onClick={onLoginClick}>
          {buttonText}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
