// LogoutButton.js
import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducers/authReducer";
import { makeStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Link } from "react-router-dom"; // Import the Link component

const authServiceUrl = process.env.REACT_APP_AUTH_SERVICE_URL;

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
      const response = await fetch(`${authServiceUrl}/api/logout`);
      if (response.ok) {
        // Dispatch the logout action to update the Redux state
        dispatch(logout());
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
