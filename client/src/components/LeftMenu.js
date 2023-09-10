import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import HomeIcon from "@material-ui/icons/Home";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import HistoryIcon from "@material-ui/icons/History";
import MessageIcon from "@material-ui/icons/Message";
import SettingsIcon from "@material-ui/icons/Settings";
import LogoutButton from "./LogoutButton";
import { useColorMode } from "@chakra-ui/react";
import logo from "../logo.png";

const drawerWidth = "20%";

const useStyles = makeStyles((theme) => ({
  main: {
    flex: "0 0 " + drawerWidth,
    padding: theme.spacing(2),
    borderRight: "0.1px solid lightgrey",
  },
  menu: {
    flex: "0 0 " + drawerWidth,
    marginLeft: theme.spacing(12),
  },
  menuList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  menuItem: {
    padding: theme.spacing(2),
    listStyleType: "none",
  },
  menuItemLink: {
    textDecoration: "none",
  },
  mobileMenuContainer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  },
  mobileMenu: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: theme.spacing(1),
  },
  mobileMenuItem: {
    fontSize: "1.5rem",
    padding: theme.spacing(1),
    textDecoration: "none",
  },
  badge: {
    marginLeft: theme.spacing(2),
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
}));

const LeftMenu = ({ isMobile }) => {
  const classes = useStyles();
  const unreadNotificationsCount = useSelector(
    (state) => state.notifications.unreadCount
  );
  const location = useLocation(); // Get the current route location

  return (
    <div className={isMobile ? classes.mobileMenuContainer : classes.main}>
      {isMobile ? (
        <div className={classes.mobileMenuContainer}>
          <div className={classes.mobileMenu}>
            <MenuItem
              to="/home"
              icon={<HomeIcon />}
              location={location.pathname}
            />
            <MenuItem
              to="/notifications"
              icon={<NotificationsIcon />}
              badgeContent={unreadNotificationsCount}
              location={location.pathname}
            />
            <MenuItem
              to="/profile/me"
              icon={<AccountCircleIcon />}
              location={location.pathname}
            />
            <MenuItem
              to="/history"
              icon={<HistoryIcon />}
              location={location.pathname}
            />
            <MenuItem
              to="/messages"
              icon={<MessageIcon />}
              location={location.pathname}
            />
            <MenuItem
              to="/settings"
              icon={<SettingsIcon />}
              location={location.pathname}
            />
            <LogoutButton />
          </div>
        </div>
      ) : (
        <div className={classes.menu}>
          <ul className={classes.menuList}>
            <div className={classes.logoContainer}>
              <img src={logo} alt="Logo" className={classes.logo} />
            </div>
            <MenuItem
              to="/home"
              icon={<HomeIcon />}
              text="Home"
              location={location.pathname}
            />
            <MenuItem
              to="/notifications"
              icon={<NotificationsIcon />}
              text="Notifications"
              badgeContent={unreadNotificationsCount}
              location={location.pathname}
            />
            <MenuItem
              to="/profile/me"
              icon={<AccountCircleIcon />}
              text="Profile"
              location={location.pathname}
            />
            <MenuItem
              to="/history"
              icon={<HistoryIcon />}
              text="Link Ups"
              location={location.pathname}
            />
            <MenuItem
              to="/messages"
              icon={<MessageIcon />}
              text="Messages"
              location={location.pathname}
            />
            <MenuItem
              to="/settings"
              icon={<SettingsIcon />}
              text="Settings"
              location={location.pathname}
            />
            <li className={`${classes.menuItem} ${classes.menuItemHover}`}>
              <LogoutButton />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ to, icon, text, badgeContent, location }) => {
  const classes = useStyles();

  const { colorMode } = useColorMode(); // Get the current color mode

  // Define the background color and border color based on colorMode
  const activeTabBackgroundColor =
    colorMode === "dark" ? "rgba(18, 28, 38, 0.9)" : "#F5F8FA";
  const activeTabBorderColor = colorMode === "dark" ? "transparent" : "#F1F1FA";

  const isItemActive = location.startsWith(to);

  const menuItemStyle = {
    borderRadius: "100px",
    padding: "8px 16px",
    backgroundColor: isItemActive ? activeTabBackgroundColor : "transparent",
    display: "flex",
    alignItems: "center",
    border: isItemActive ? `2px solid ${activeTabBorderColor}` : "none",
  };

  return (
    <li
      className={`${classes.menuItem} ${classes.menuItemHover} ${
        isItemActive ? classes.active : ""
      }`}
    >
      <Link to={to} className={classes.menuItemLink} style={menuItemStyle}>
        {icon}
        <div style={{ marginLeft: "8px" }}>{text}</div>{" "}
        {badgeContent > 0 && (
          <Badge
            className={classes.badge}
            badgeContent={parseInt(badgeContent)}
            overlap="rectangular"
            color="secondary"
            style={{ marginLeft: "8px" }}
          ></Badge>
        )}
      </Link>
    </li>
  );
};

export default LeftMenu;
