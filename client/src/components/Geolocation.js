import React, { useState } from "react";
import useLocationUpdate from "../utils/useLocationUpdate";
import EnableLocation from "./EnableLocation";
import CustomModal from "./CustomModal";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  feedSection: {
    flex: "2",
    overflowY: "hidden",
    marginLeft: "auto",
    marginRight: "auto",
    borderRightWidth: "1px",
    borderRightColor: "0.1px solid #D3D3D3",
    height: "100%",
  },
  widgetSection: {
    flex: "1",
    overflowY: "auto",
    overflowX: "hidden",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const Geolocation = () => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(true);
  const { updateLocation } = useLocationUpdate();

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
        <CustomModal
          showModal={modalOpen}
          setShowModal={setModalOpen}
          title="Enable Location Service"
          content="To use LUUL, you'll need to grant access to your device's location."
          primaryAction={handleAllow}
          primaryActionLabel="Allow"
          secondaryAction={handleDeny}
          secondaryActionLabel="Deny"
        />
      ) : (
        <div>
          <div className={classes.feedSection}>
            <EnableLocation />
          </div>
          <div className={classes.widgetSection} />
        </div>
      )}
    </>
  );
};

export default Geolocation;
