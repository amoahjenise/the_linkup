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
    listStyleType: "none",
  },
  menuItemLink: {
    color: "black",
    textDecoration: "none",
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
    alignItems: "center",
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

// MenuItem component to simplify menu item rendering
const MenuItem = ({ to, icon, text, badgeContent, location }) => {
  const classes = useStyles();

  return (
    <li
      className={`${classes.menuItem} ${classes.menuItemHover} ${
        location.startsWith(to) ? classes.active : ""
      }`}
    >
      <Link to={to} className={classes.menuItemLink}>
        {icon} {text}
        {badgeContent && (
          <Badge
            className={classes.badge}
            badgeContent={parseInt(badgeContent)}
            color="secondary"
          ></Badge>
        )}
      </Link>
    </li>
  );
};

export default LeftMenu;
