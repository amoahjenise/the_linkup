import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, updateDeactivatedUser } from "../redux/actions/authActions";
import { setCurrentUser } from "../redux/actions/userActions";
import { authenticateUser } from "../api/authenticationAPI";
import { setUserStatusActive } from "../api/usersAPI";
import {
  Button,
  TextField,
  Typography,
  Container,
  Avatar,
} from "@material-ui/core";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";
import AuthService from "../AuthService";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  errorMessage: {
    color: "red",
    marginBottom: theme.spacing(1),
  },
  successMessage: {
    color: "green",
    marginBottom: theme.spacing(1),
  },
}));

const UserAuthentication = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  // Retrieve phone number and country code from the Redux store
  const phoneNumber = useSelector((state) => state.auth.phoneNumber);
  const deactivatedUser = useSelector((state) => state.auth.deactivatedUser);

  const name = deactivatedUser?.name;

  // State variables for managing error and success messages
  const [errorMessage, setErrorMessage] = useState("");

  // Function to clear messages
  const clearMessages = () => {
    setErrorMessage("");
  };

  // Handle input change for password
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle setting the password and user authentication
  const handleSendPassword = async () => {
    try {
      const result = await authenticateUser(phoneNumber, password);
      if (result.success) {
        // Save the access token in an HttpOnly cookie
        AuthService.setAccessToken(result.accessToken);
        AuthService.setRefreshToken(result.refreshToken);
        dispatch(login());
        dispatch(setCurrentUser(result.user));
        if (deactivatedUser) {
          setUserStatusActive(result.user.id);
          dispatch(updateDeactivatedUser(null)); // Clear deactivatedUser when the user authenticates
        }
        navigate("/home");
      } else {
        setErrorMessage("Authentication failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during user authentication:", error);
      setErrorMessage("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    clearMessages(); // Clear the messages
    setLoading(true);
    handleSendPassword(); // Manually handle the form submission
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        {name && (
          <Typography component="h1" variant="h3">
            Welcome back {name}!
          </Typography>
        )}
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Enter Your Password
        </Typography>
        <form className={classes.form} onSubmit={handleFormSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={handlePasswordChange}
          />
          {errorMessage && (
            <div className={classes.errorMessage}>{errorMessage}</div>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login
          </Button>
          <Link to="/forgot-password" variant="body2">
            Forgot Password?
          </Link>
          {/* Render the LoadingSpinner component */}
          {loading && <LoadingSpinner />}{" "}
        </form>
      </div>
    </Container>
  );
};

export default UserAuthentication;
