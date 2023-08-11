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
          transform: "translateX(-50%)", // Center horizontally
        }}
      >
        {snackbars.map((snackbar) => (
          <div
            key={snackbar.id}
            style={{
              backgroundColor: "#f5f6f7", // Light gray background
              textAlign: "center",
              fontSize: "14px",
              borderRadius: "8px",
              padding: "8px 16px",
              minWidth: "200px",
              margin: "8px",
              boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)", // Light shadow
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>{snackbar.message}</div>
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
