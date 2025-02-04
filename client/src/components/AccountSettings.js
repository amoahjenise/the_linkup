import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import {
  Button,
  Slider,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useSnackbar } from "../contexts/SnackbarContext";

// Styled components
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

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: "1rem",
  borderRadius: "10px",
  backgroundColor: "#AD1C4F",
  color: "white",
  "&:hover": {
    backgroundColor: "#B71C1C",
  },
}));

const AccountSettings = ({ colorMode }) => {
  const [distanceRange, setDistanceRange] = useState([10, 50]); // Default range in km
  const [ageRange, setAgeRange] = useState([25, 35]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { addSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleSaveSettings = () => {
    // Example action: save settings to the Redux store
    dispatch({
      type: "SAVE_SETTINGS",
      payload: { distanceRange, ageRange, notificationsEnabled },
    });
    addSnackbar("Settings saved successfully.");
  };

  return (
    <Section>
      <SectionTitle>User Settings</SectionTitle>

      <Typography variant="h6" gutterBottom>
        Distance Range ({distanceRange[0]} - {distanceRange[1]}{" "}
        {distanceRange[1] > 100 ? "miles" : "km"})
      </Typography>
      <Slider
        value={distanceRange}
        onChange={(e, newValue) => setDistanceRange(newValue)}
        valueLabelDisplay="auto"
        min={1}
        max={100}
      />

      <Typography variant="h6" gutterBottom>
        Age Range ({ageRange[0]} - {ageRange[1]})
      </Typography>
      <Slider
        value={ageRange}
        onChange={(e, newValue) => setAgeRange(newValue)}
        valueLabelDisplay="auto"
        min={18}
        max={80}
      />

      <FormControlLabel
        control={
          <Switch
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            color="primary"
          />
        }
        label="Enable Notifications"
      />

      <StyledButton variant="contained" onClick={handleSaveSettings}>
        Save Settings
      </StyledButton>
    </Section>
  );
};

export default AccountSettings;
