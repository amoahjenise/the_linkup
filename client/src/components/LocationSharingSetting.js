import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { updateLocationSharing } from "../redux/reducers/locationSlice";
import useLocationUpdate from "../utils/useLocationUpdate";

const useStyles = makeStyles((theme) => ({
  section: {
    flex: "1",
    padding: theme.spacing(2),
    flexDirection: "column",
    justifyContent: "center",
    position: "sticky",
    top: 0,
    overflowY: "auto",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
  },
  sectionContent: {
    fontSize: "1rem",
    marginBottom: theme.spacing(2),
  },
}));

const LocationSharingSetting = () => {
  const classes = useStyles();
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
    <div className={classes.section}>
      <h2 className={classes.sectionTitle}>Grant Access to Device Location</h2>
      <p className={classes.sectionContent}>
        To use Linkup, you'll need to grant access to your device's location:
      </p>
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
    </div>
  );
};

export default LocationSharingSetting;
