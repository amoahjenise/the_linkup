import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { FormControlLabel, Switch } from "@mui/material";
import { updateLocationSharing } from "../redux/reducers/locationSlice";
import useLocationUpdate from "../utils/useLocationUpdate";

// Styled Components
const Section = styled("div")(({ theme }) => ({
  flex: "1",
  padding: theme.spacing(2),
  flexDirection: "column",
  justifyContent: "center",
  position: "sticky",
  top: 0,
  overflowY: "auto",
}));

const SectionTitle = styled("h2")(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const SectionContent = styled("p")(({ theme }) => ({
  fontSize: "1rem",
  marginBottom: theme.spacing(2),
}));

const LocationSharingSetting = () => {
  const locationState = useSelector((state) => state.location);
  const dispatch = useDispatch();

  const { updateLocation } = useLocationUpdate();

  const handleLocationToggle = async () => {
    const updatedAllowLocation = !locationState.allow_location;

    if (updatedAllowLocation) {
      // Check geolocation permission status
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "geolocation",
        });

        if (permissionStatus.state === "denied") {
          // Update the state to reflect that location sharing is blocked
          dispatch(updateLocationSharing(false));
          alert("Location sharing is blocked by the browser.");
        } else {
          // If permission is granted or prompt, proceed to fetch the location
          dispatch(updateLocationSharing(updatedAllowLocation));
          updateLocation(updatedAllowLocation);
        }
      } catch (error) {
        console.error("Error checking geolocation permission:", error);
      }
    } else {
      // If disabling location sharing, simply update the state
      dispatch(updateLocationSharing(updatedAllowLocation));
    }
  };

  return (
    <Section>
      <SectionTitle>Grant Access to Device Location</SectionTitle>
      <SectionContent>
        To use Linkup, you'll need to grant access to your device's location:
      </SectionContent>
      <FormControlLabel
        control={
          <Switch
            checked={locationState.allow_location}
            onChange={handleLocationToggle}
            color="primary"
          />
        }
        label="Allow Location Sharing"
      />
    </Section>
  );
};

export default LocationSharingSetting;
