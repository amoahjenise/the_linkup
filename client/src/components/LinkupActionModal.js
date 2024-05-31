import React from "react";
import { Button, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useColorMode } from "@chakra-ui/react";
import logo from "../logo.png";
import Color from "color";

const useStyles = makeStyles((theme) => ({
  screen: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
  },
  logoContainer: {
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(2),
    },
  },
  logo: {
    height: "50px",
    marginBottom: theme.spacing(2),
    backgroundColor: "#000", // Set the background color to black
  },
  modalHeader: {
    width: "24rem",
    borderRadius: theme.shape.borderRadius,
    display: "flex",
  },
  iconContainer: {
    width: "33%",
    paddingTop: theme.spacing(6),
    display: "flex",
    justifyContent: "center",
  },
  icon: (props) => ({
    width: theme.spacing(8),
    height: theme.spacing(8),
    backgroundColor: props.color,
    color: "white",
    padding: theme.spacing(2),
    borderRadius: "50%",
  }),
  contentContainer: {
    width: "100%",
    paddingTop: theme.spacing(3),
    paddingRight: theme.spacing(2),
  },
  title: (props) => ({
    fontWeight: "bold",
    color: props.color,
  }),
  description: {
    paddingTop: theme.spacing(1),
    fontSize: "0.875rem",
    color: "#9e9e9e",
  },
  buttonContainer: {
    padding: theme.spacing(2),
    display: "flex",
    gap: theme.spacing(2),
  },
  cancelButton: {
    width: "50%",
    padding: theme.spacing(1.5),
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    color: "#9e9e9e",
    fontWeight: "bold",
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      backgroundColor: "#e0e0e0",
      color: "#000",
    },
  },
  primaryButton: {
    width: "50%",
    padding: theme.spacing(1.5),
    textAlign: "center",
    // backgroundColor: props.color,
    color: "#fff",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#e0e0e0",
      color: "#000",
    },
  },
}));

const LinkupActionModal = ({
  open,
  onClose,
  onConfirm,
  color,
  modalTitle,
  modalContentText,
  primaryButtonText,
  primaryButtonFn,
  secondaryButtonText,
  secondaryButtonFn,
}) => {
  const classes = useStyles({ color });
  const { colorMode } = useColorMode();

  const modalBackgroundColor = colorMode === "dark" ? "#1e1e1e" : "white";

  const filterStyle =
    colorMode === "dark" ? "invert(0.879) grayscale(70%)" : "none"; // Set filter style based on colorMode

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <div className={classes.screen}>
        <div
          className={classes.modalContainer}
          style={{ backgroundColor: modalBackgroundColor }}
        >
          <div
            className={classes.modalHeader}
            style={{ borderTop: `8px solid ${color}` }}
          >
            <div className={classes.iconContainer}>
              <div className={classes.logoContainer}>
                <img
                  src={logo}
                  alt="Logo"
                  className={classes.logo}
                  style={{ filter: filterStyle }}
                />
              </div>
            </div>
            <div className={classes.contentContainer}>
              <h3 className={classes.title}>{modalTitle}</h3>
              <p className={classes.description}>{modalContentText}</p>
            </div>
          </div>
          <div className={classes.buttonContainer}>
            <Button
              className={classes.cancelButton}
              onClick={secondaryButtonFn || onClose}
            >
              {secondaryButtonText}
            </Button>
            <Button
              className={classes.primaryButton}
              onClick={primaryButtonFn || onConfirm}
              style={{ backgroundColor: color }}
            >
              {primaryButtonText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LinkupActionModal;
