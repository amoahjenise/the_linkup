import React, { createContext, useContext, useState, useCallback } from "react";

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
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column-reverse", // Display new snackbars at the top
          alignItems: "center",
        }}
      >
        {snackbars.map((snackbar) => (
          <div
            key={snackbar.id}
            style={{
              backgroundColor: "#323232", // Dark gray background
              color: "#FFFFFF", // White text color
              textAlign: "center",
              fontSize: "14px",
              borderRadius: "4px",
              padding: "8px 16px",
              minWidth: "200px",
              margin: "8px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Light shadow
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // Center text vertically
            }}
          >
            <div style={{ marginBottom: "4px" }}>{snackbar.message}</div>
            {snackbar.onRetry && (
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#318bfb", // Blue text color
                  cursor: "pointer",
                }}
                onClick={snackbar.onRetry}
              >
                Retry
              </button>
            )}
          </div>
        ))}
      </div>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}
