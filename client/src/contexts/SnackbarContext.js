import React, { createContext, useContext, useState, useCallback } from "react";
import { styled } from "@mui/material/styles";

// Define styles for light and dark modes
const SnackbarContainer = styled("div")(({ theme }) => ({
  position: "fixed",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  flexDirection: "column-reverse", // Display new snackbars at the top
  alignItems: "center",
  zIndex: 4000, // Ensure snackbar is above other content
}));

const SnackbarItem = styled("div")(({ theme }) => ({
  backgroundColor: "#323232",
  color: "#fff",
  textAlign: "center",
  fontSize: "14px",
  borderRadius: "8px",
  padding: "12px 16px",
  minWidth: "240px",
  margin: "8px",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0px 4px 8px rgba(0, 0, 0, 0.5)" // Dark mode shadow
      : "0px 4px 8px rgba(0, 0, 0, 0.2)", // Light mode shadow
  display: "flex",
  flexDirection: "column",
  justifyContent: "center", // Center text vertically
}));

const RetryButton = styled("button")(({ theme }) => ({
  backgroundColor: "transparent",
  border: "none",
  color: theme.palette.primary.main, // Use primary color from theme
  cursor: "pointer",
  fontSize: "14px",
  marginTop: "8px",
  padding: "0",
  outline: "none",
  transition: "color 0.3s",
  "&:hover": {
    color: theme.palette.primary.dark, // Darker shade on hover
  },
}));

const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
  const [snackbars, setSnackbars] = useState([]);

  const removeSnackbar = useCallback(
    (id) => {
      setSnackbars((prevSnackbars) =>
        prevSnackbars.filter((snackbar) => snackbar.id !== id)
      );
    },
    [setSnackbars]
  );

  const addSnackbar = useCallback(
    (message, options = {}) => {
      const { timeout = 3000, onRetry } = options;

      const newSnackbar = { message, id: Date.now(), timeout, onRetry };
      setSnackbars((prevSnackbars) => [...prevSnackbars, newSnackbar]);

      if (timeout > 0) {
        setTimeout(() => removeSnackbar(newSnackbar.id), timeout);
      }
    },
    [setSnackbars, removeSnackbar]
  );

  return (
    <SnackbarContext.Provider value={{ addSnackbar }}>
      {children}
      <SnackbarContainer>
        {snackbars.map((snackbar) => (
          <SnackbarItem key={snackbar.id}>
            <div>{snackbar.message}</div>
            {snackbar.onRetry && (
              <RetryButton onClick={snackbar.onRetry}>Retry</RetryButton>
            )}
          </SnackbarItem>
        ))}
      </SnackbarContainer>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}
