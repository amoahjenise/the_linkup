import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { logout } from "../redux/actions/authActions";
import { loggingOut } from "../redux/actions/logoutActions";
import { useSnackbar } from "../contexts/SnackbarContext";
import { Button, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CustomUserButton = () => {
  const dispatch = useDispatch();
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const { addSnackbar } = useSnackbar();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    if (isSignedIn) {
      setLoading(true);
      try {
        await signOut();

        dispatch(logout());
        dispatch(loggingOut());

        navigate("/");
        addSnackbar("Signed out successfully.", "success");
      } catch (error) {
        console.error("Error signing out:", error);
        addSnackbar(
          "An error occurred while signing out. Please try again.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="contained"
      color="primary"
      disabled={loading}
      sx={{
        width: "100%",
        maxWidth: "180px",
        borderRadius: "999px",
        padding: "10px 20px",
        textTransform: "none",
        fontWeight: 600,
        fontSize: "16px",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0px 4px 10px rgba(255, 255, 255, 0.1)"
            : "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: theme.palette.mode === "dark" ? "#FF5252" : "#D32F2F",
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#FF1744" : "#B71C1C",
        },
      }}
      startIcon={
        loading ? <CircularProgress size={20} color="inherit" /> : null
      }
    >
      {loading ? "Signing Out..." : "Sign Out"}
    </Button>
  );
};

export default CustomUserButton;
