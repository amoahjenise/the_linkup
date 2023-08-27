import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import HomeIcon from "@material-ui/icons/Home";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import HistoryIcon from "@material-ui/icons/History";
import MessageIcon from "@material-ui/icons/Message";
import SettingsIcon from "@material-ui/icons/Settings";
import LogoutButton from "./LogoutButton";
import logo from "../logo.png";

const drawerWidth = "20%";

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
    marginLeft: theme.spacing(16),
  },
  menuList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  menuItem: {
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

  mobileMenuContainer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#fff",
    boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  },
  mobileMenu: {
    display: "flex",
    justifyContent: "space-around",
    padding: theme.spacing(1),
  },
  mobileMenuItem: {
    fontSize: "1.5rem",
    padding: theme.spacing(1),
    color: "black",
    textDecoration: "none",
  },
  active: {
    backgroundColor: "#F5F8FA",
    borderRadius: "100px",
  },
}));

const LeftMenu = ({ isMobile, activeSection, setActiveSection }) => {
  const classes = useStyles();
  const unreadNotificationsCount = useSelector(
    (state) => state.notifications.unreadCount
  );

  const handleMenuItemClick = (section) => {
    setActiveSection(section);
  };

  if (isMobile) {
    return (
      <div className={classes.mobileMenuContainer}>
        <div className={classes.mobileMenu}>
          <Link
            to="/home"
            className={`${classes.mobileMenuItem} ${
              classes.mobileMenuItemHover
            } ${activeSection === "home" ? classes.active : ""}`}
            onClick={() => handleMenuItemClick("home")}
          >
            <HomeIcon />
          </Link>
          <Link
            to="/notifications"
            className={`${classes.mobileMenuItem} ${
              classes.mobileMenuItemHover
            } ${activeSection === "notifications" ? classes.active : ""}`}
            onClick={() => handleMenuItemClick("notifications")}
          >
            <Badge badgeContent={unreadNotificationsCount} color="secondary">
              <NotificationsIcon />
            </Badge>
          </Link>
          <Link
            to="/profile/me"
            className={`${classes.mobileMenuItem} ${
              classes.mobileMenuItemHover
            } ${activeSection === "profile" ? classes.active : ""}`}
            onClick={() => handleMenuItemClick("profile")}
          >
            <AccountCircleIcon />
          </Link>
          <Link
            to="/history"
            className={`${classes.mobileMenuItem} ${
              classes.mobileMenuItemHover
            } ${activeSection === "history" ? classes.active : ""}`}
            onClick={() => handleMenuItemClick("history")}
          >
            <HistoryIcon />
          </Link>
          <Link
            to="/messages"
            className={`${classes.mobileMenuItem} ${
              classes.mobileMenuItemHover
            } ${activeSection === "messages" ? classes.active : ""}`}
            onClick={() => handleMenuItemClick("messages")}
          >
            <MessageIcon />
          </Link>
          <div
            className={`${classes.mobileMenuItem} ${
              classes.mobileMenuItemHover
            } ${activeSection === "settings" ? classes.active : ""}`}
            onClick={() => handleMenuItemClick("settings")}
          >
            <Link to="/settings" className={classes.mobileMenuItemLink}>
              <SettingsIcon />
            </Link>
          </div>
          <LogoutButton />
        </div>
      </div>
    );
  }

  return (
    <div className={classes.main}>
      <div className={classes.menu}>
        <ul className={classes.menuList}>
          <div className={classes.logoContainer}>
            <img src={logo} alt="Logo" className={classes.logo} />
          </div>
          <li
            className={`${classes.menuItem} ${classes.menuItemHover} ${
              activeSection === "home" ? classes.active : ""
            }`}
            onClick={() => handleMenuItemClick("home")}
          >
            <Link to="/home" className={classes.menuItemLink}>
              <HomeIcon /> Home
            </Link>
          </li>
          <li
            className={`${classes.menuItem} ${classes.menuItemHover} ${
              activeSection === "notifications" ? classes.active : ""
            }`}
            onClick={() => handleMenuItemClick("notifications")}
          >
            <Link to="/notifications" className={classes.menuItemLink}>
              <NotificationsIcon /> Notifications
              <Badge
                className={classes.badge}
                badgeContent={parseInt(unreadNotificationsCount)}
                color="secondary"
              ></Badge>
            </Link>
          </li>
          <li
            className={`${classes.menuItem} ${classes.menuItemHover} ${
              activeSection === "profile" ? classes.active : ""
            }`}
            onClick={() => handleMenuItemClick("profile")}
          >
            <Link to="/profile/me" className={classes.menuItemLink}>
              <AccountCircleIcon /> Profile
            </Link>
          </li>
          <li
            className={`${classes.menuItem} ${classes.menuItemHover} ${
              activeSection === "history" ? classes.active : ""
            }`}
            onClick={() => handleMenuItemClick("history")}
          >
            <Link to="/history" className={classes.menuItemLink}>
              <HistoryIcon /> Link Ups
            </Link>
          </li>
          <li
            className={`${classes.menuItem} ${classes.menuItemHover} ${
              activeSection === "messages" ? classes.active : ""
            }`}
            onClick={() => handleMenuItemClick("messages")}
          >
            <Link to="/messages" className={classes.menuItemLink}>
              <MessageIcon /> Messages
            </Link>
          </li>
          <li
            className={`${classes.menuItem} ${classes.menuItemHover} ${
              activeSection === "settings" ? classes.active : ""
            }`}
            onClick={() => handleMenuItemClick("settings")}
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
