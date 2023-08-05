import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../logo.png";
import HomeIcon from "@material-ui/icons/Home";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import HistoryIcon from "@material-ui/icons/History";
import MessageIcon from "@material-ui/icons/Message";
import LogoutButton from "./LogoutButton";

const drawerWidth = "24%";

const useStyles = makeStyles((theme) => ({
  main: {
    flex: "0 0 " + drawerWidth,
    color: "black",
    padding: theme.spacing(2),
    borderRight: "0.1px solid lightgrey",
  },
  menu: {
    flex: "0 0 " + drawerWidth,
    color: "black",
    marginLeft: theme.spacing(18),
  },
  menuList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  menuItem: {
    fontSize: "1.2rem",
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  menuItemLink: {
    color: "black",
    textDecoration: "none",
  },
  logoContainer: {
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(2),
    },
  },
  logo: {
    height: "50px",
    marginBottom: theme.spacing(2),
  },
  menuItemHover: {
    "&:hover": {
      backgroundColor: "#F5F8FA",
      borderRadius: "100px",
    },
  },
}));

const LeftMenu = () => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <div className={classes.menu}>
        <ul className={classes.menuList}>
          <div className={classes.logoContainer}>
            <img src={logo} alt="Logo" className={classes.logo} />
          </div>
          <li className={`${classes.menuItem} ${classes.menuItemHover}`}>
            <Link to="/home" className={classes.menuItemLink}>
              <HomeIcon /> Home
            </Link>
          </li>
          <li className={`${classes.menuItem} ${classes.menuItemHover}`}>
            <Link to="/notifications" className={classes.menuItemLink}>
              <NotificationsIcon /> Notifications
            </Link>
          </li>
          <li className={`${classes.menuItem} ${classes.menuItemHover}`}>
            <Link to="/profile/me" className={classes.menuItemLink}>
              <AccountCircleIcon /> Profile
            </Link>
          </li>
          <li className={`${classes.menuItem} ${classes.menuItemHover}`}>
            <Link to="/history" className={classes.menuItemLink}>
              <HistoryIcon /> Link Ups
            </Link>
          </li>
          <li className={`${classes.menuItem} ${classes.menuItemHover}`}>
            <Link to="/messages" className={classes.menuItemLink}>
              <MessageIcon /> Messages
            </Link>
          </li>
          <li className={`${classes.menuItem} ${classes.menuItemHover}`}>
            <LogoutButton />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftMenu;
