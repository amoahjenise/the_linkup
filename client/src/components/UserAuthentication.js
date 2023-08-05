import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/reducers/authReducer";
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
import axios from "axios";

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

const UserAuthentication = ({ password, setPassword }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authServiceUrl = process.env.REACT_APP_AUTH_SERVICE_URL;

  // Retrieve phone number and country code from the Redux store
  const phoneNumber = useSelector((state) => state.auth.phoneNumber);

  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const response = await axios.post(`${authServiceUrl}/api/login`, {
        phoneNumber: phoneNumber,
        password: password,
      });

      if (response.status === 200) {
        const authenticationResult = response.data;

        if (authenticationResult.success) {
          // Save the access token in an HttpOnly cookie
          document.cookie = `accessToken=${authenticationResult.token}; path=/; HttpOnly`;

          dispatch(login());
          setPassword();
          navigate("/home");
        } else {
          setErrorMessage("Authentication failed. Please try again.");
        }
      } else {
        console.error("Server error:", response.status);
        setErrorMessage("Server error. Please try again later.");
      }
    } catch (error) {
      console.error("Error during user authentication:", error);
      setErrorMessage("Authentication failed. Please try again.");
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    clearMessages(); // Clear the messages
    handleSendPassword(); // Manually handle the form submission
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
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
          {loading && <LoadingSpinner />}{" "}
          {/* Render the LoadingSpinner component */}
        </form>
      </div>
    </Container>
  );
};

export default UserAuthentication;
