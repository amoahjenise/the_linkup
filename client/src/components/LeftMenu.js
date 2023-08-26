import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../logo.png";
import Badge from "@material-ui/core/Badge";
import HomeIcon from "@material-ui/icons/Home";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import HistoryIcon from "@material-ui/icons/History";
import MessageIcon from "@material-ui/icons/Message";
import SettingsIcon from "@material-ui/icons/Settings";
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
  badge: {
    marginLeft: theme.spacing(2),
  },
}));

const LeftMenu = () => {
  const classes = useStyles();
  const [activeSection, setActiveSection] = useState("account");
  const unreadNotificationsCount = useSelector(
    (state) => state.notifications.unreadCount
  );

  useEffect(() => {
    // This effect will run whenever the unreadNotificationsCount prop changes
    console.log(
      "Unread notifications count changed:",
      unreadNotificationsCount
    );
  }, [unreadNotificationsCount]);

  const handleMenuItemClick = (section) => {
    setActiveSection(section); // Set the active section when a menu item is clicked
  };

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
              {/* Display the Badge component with the unreadNotificationsCount */}
              <Badge
                className={classes.badge}
                badgeContent={parseInt(unreadNotificationsCount)}
                color="secondary"
              ></Badge>
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
          <li
            className={`${classes.menuItem} ${classes.menuItemHover}`}
            onClick={() => handleMenuItemClick("account")} // Set activeSection to "account" on click
          >
            <Link to="/settings" className={classes.menuItemLink}>
              <SettingsIcon /> Settings
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
