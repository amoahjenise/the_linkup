import React, { useState, useEffect } from "react";
import CustomModal from "./CustomModal"; // Make sure this component is correctly implemented
import EnableLocation from "./EnableLocation";
import { styled } from "@mui/material/styles";
import useLocationUpdate from "../utils/useLocationUpdate";

const FeedSection = styled("div")(({ theme }) => ({
  flex: "2",
  overflowY: "hidden",
  marginLeft: "auto",
  marginRight: "auto",
  borderRight: "0.1px solid #D3D3D3",
  height: "100%",
}));

const WidgetSection = styled("div")({
  flex: "1",
  overflowY: "auto",
  overflowX: "hidden",
  marginLeft: "auto",
  marginRight: "auto",
});

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

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location fetched:", position);
          // Handle location data
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert(
              "Location access was denied. Please enable it in your settings."
            );
          } else {
            alert("Error fetching location.");
          }
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (!modalOpen) {
      getLocation();
    }
  }, [modalOpen]);

  return (
    <>
      {modalOpen ? (
        <CustomModal
          showModal={modalOpen}
          setShowModal={setModalOpen}
          title="Enable Location Service"
          content="For an optimal experience, please enable location access on your device."
          primaryAction={handleAllow}
          primaryActionLabel="Allow"
          secondaryAction={handleDeny}
          secondaryActionLabel="Deny"
        />
      ) : (
        <div>
          <FeedSection>
            <EnableLocation />
          </FeedSection>
          <WidgetSection />
        </div>
      )}
    </>
  );
};

export default Geolocation;
