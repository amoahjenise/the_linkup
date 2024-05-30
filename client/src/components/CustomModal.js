import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useColorMode, Heading, Text, Box } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    overflowY: "auto",
    transition: "opacity 0.3s ease",
    "&:enter": {
      opacity: 0,
    },
    "&:enter-active": {
      opacity: 1,
    },
    "&:leave": {
      opacity: 1,
    },
    "&:leave-active": {
      opacity: 0,
    },
  },
  modalContent: {
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    position: "relative",
    width: "90%",
    maxWidth: "500px",
    margin: "1.5rem auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb",
    padding: theme.spacing(2),
  },
  closeButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  main: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2),
    borderTop: "1px solid #e5e7eb",
  },
  button: {
    margin: theme.spacing(1),
    padding: theme.spacing(1, 2),
    width: "120px",
    borderRadius: "9999px",
    textTransform: "none",
    "&.primary": {
      backgroundColor: "#3b82f6",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#2563eb",
      },
    },
    "&.secondary": {
      backgroundColor: "#ef4444",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#dc2626",
      },
    },
  },
}));

const CustomModal = ({
  showModal,
  setShowModal,
  title,
  content,
  primaryAction,
  primaryActionLabel,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const classes = useStyles();
  const { colorMode } = useColorMode();

  const modalBackgroundColor = colorMode === "dark" ? "#1F1F1F" : "white";
  const modalCloseButtonColor = colorMode === "dark" ? "white" : "black";

  const handleClose = () => setShowModal(false);

  return (
    <>
      {showModal && (
        <div
          className={`${classes.modal} ${
            showModal ? "enterActive" : "leaveActive"
          }`}
          onClick={handleClose}
        >
          <div
            className={classes.modalContent}
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: modalBackgroundColor }}
          >
            <header className={classes.header}>
              <Heading as="h2" size="md">
                {title}
              </Heading>

              <button className={classes.closeButton} onClick={handleClose}>
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  style={{ fill: modalCloseButtonColor }}
                >
                  <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                </svg>
              </button>
            </header>
            <main className={classes.main}>
              <Box padding="2" textAlign="center">
                <Text>{content}</Text>
              </Box>
            </main>
            <footer className={classes.footer}>
              <Button
                className={`${classes.button} secondary`}
                onClick={secondaryAction}
              >
                {secondaryActionLabel}
              </Button>
              <Button
                className={`${classes.button} primary`}
                onClick={primaryAction}
              >
                {primaryActionLabel}
              </Button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomModal;
