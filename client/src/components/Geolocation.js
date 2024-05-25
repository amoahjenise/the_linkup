import React, { useState } from "react";
import { Modal, Button, makeStyles, Typography } from "@material-ui/core";
import useLocationUpdate from "../utils/useLocationUpdate";
import EnableLocationPrompt from "./EnableLocationPrompt";
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    borderRadius: "8px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    textAlign: "center",
    outline: "none",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const Geolocation = () => {
  const [modalOpen, setModalOpen] = useState(true);
  const classes = useStyles();
  const { colorMode } = useColorMode();
  const { updateLocation } = useLocationUpdate();

  const modalBackgroundColor = colorMode === "dark" ? "#121212" : "white";

  const handleAllow = () => {
    setModalOpen(false);
    updateLocation(true);
  };

  const handleDeny = () => {
    setModalOpen(false);
  };

  return (
    <>
      {modalOpen ? (
        <Modal open={modalOpen} className={classes.modal}>
          <div
            className={classes.paper}
            style={{ backgroundColor: modalBackgroundColor }}
          >
            <Typography variant="h6" gutterBottom>
              To use Linkup, you'll need to grant access to your device's
              location.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleAllow}
            >
              Allow
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={handleDeny}
            >
              Deny
            </Button>
          </div>
        </Modal>
      ) : (
        <EnableLocationPrompt />
      )}
    </>
  );
};

export default Geolocation;
