// LogoutButton.js
import React from "react";
import { useDispatch } from "react-redux";
import { logout as logoutReducerFunction } from "../redux/reducers/authReducer";
import { logout } from "../api/authenticationAPI";
import { makeStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Link } from "react-router-dom"; // Import the Link component

const useStyles = makeStyles((theme) => ({
  logoutLink: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  logoutIcon: {
    marginRight: theme.spacing(1),
  },
}));

const LogoutButton = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Call the logout endpoint to clear the access token cookie
      const response = await logout();
      if (response.succes) {
        // Dispatch the logout action to update the Redux state
        dispatch(logoutReducerFunction());
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className={classes.logoutLink} onClick={handleLogout}>
      <ExitToAppIcon className={classes.logoutIcon} />
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        Logout
      </Link>
    </div>
  );
};

export default LogoutButton;
