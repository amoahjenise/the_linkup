import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { logout } from "../redux/actions/authActions";
import { loggingOut } from "../redux/actions/logoutActions";

import { useSnackbar } from "../contexts/SnackbarContext";

const CustomUserButton = () => {
  const dispatch = useDispatch();
  const { signOut } = useClerk(); // Clerk's signOut function to log out the current user
  const { isSignedIn } = useUser(); // Boolean indicating if the user is signed in
  const navigate = useNavigate(); // Function to navigate to different routes
  const { addSnackbar } = useSnackbar();

  // Function to handle sign-out process
  const handleSignOut = async () => {
    if (isSignedIn) {
      try {
        // Perform the actual sign-out using Clerk's signOut function
        signOut();

        // Dispatch redux action logout to clear redux states
        dispatch(logout());

        // Dispatch redux action loggingOut to prevent fetching user data and logging in again in App.js
        dispatch(loggingOut());

        // Navigate to the root page after successful sign-out
        navigate("/");
      } catch (error) {
        // If an error occurs during sign-out, log the error and set the error state
        console.error("Error signing out:", error);
        addSnackbar(
          "An error occurred while signing out. Please try again later."
        );
      }
    }
  };

  return (
    <div>
      {/* Button to trigger the sign-out process */}
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default CustomUserButton;
