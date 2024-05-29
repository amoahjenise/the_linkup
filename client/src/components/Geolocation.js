import React, { useState } from "react";
import useLocationUpdate from "../utils/useLocationUpdate";
import EnableLocationPrompt from "./EnableLocationPrompt";
import CustomModal from "./CustomModal";

const Geolocation = () => {
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
        <EnableLocationPrompt />
      )}
    </>
  );
};

export default Geolocation;
