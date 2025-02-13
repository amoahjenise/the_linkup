import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import {
  Button,
  Slider,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
} from "@mui/material";
import { useSnackbar } from "../contexts/SnackbarContext";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SaveIcon from "@mui/icons-material/Save";
import { useColorMode } from "@chakra-ui/react";

// Styled Components
const Container = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  margin: "auto",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
}));

const SectionTitle = styled(Typography)(({ colorMode }) => ({
  fontSize: "1.25rem",
  fontWeight: 600,
  marginBottom: 8,
  color: colorMode === "light" ? "black" : "white",
}));

const StyledButton = styled(Button)(({ colorMode }) => ({
  marginTop: 16,
  padding: "10px 32px",
  fontSize: "0.95rem",
  borderRadius: 8,
  backgroundColor: colorMode === "light" ? "#1976d2" : "#90caf9",
  color: colorMode === "light" ? "white" : "black",
  "&:hover": {
    backgroundColor: colorMode === "light" ? "#1565c0" : "#64b5f6",
  },
}));

const UserSettings = () => {
  const dispatch = useDispatch();
  const { addSnackbar } = useSnackbar();
  const { settings, user } = useSelector((state) => state.loggedUser);
  const [distanceRange, setDistanceRange] = useState(50);
  const [ageRange, setAgeRange] = useState([18, 99]);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (settings) {
      setDistanceRange(settings.distanceRange ? settings.distanceRange[1] : 50);
      setAgeRange(settings.ageRange || [18, 99]);
    }
  }, [settings]);

  const handleSaveSettings = () => {
    const updatedSettings = {
      distanceRange: [0, distanceRange],
      ageRange,
    };

    dispatch({ type: "SAVE_SETTINGS", payload: updatedSettings });
    addSnackbar("Settings saved successfully.", "success");
  };

  const profileUrl = `${window.location.origin}/profile/${user.id}`;

  const handleCopyProfileUrl = () => {
    navigator.clipboard
      .writeText(profileUrl)
      .then(() => addSnackbar("Profile URL copied!"))
      .catch(() => addSnackbar("Failed to copy URL.", "error"));
  };

  return (
    <Container
      sx={{ backgroundColor: colorMode === "light" ? "white" : "#1a1a1a" }}
    >
      <CardContent>
        <SectionTitle colorMode={colorMode} variant="h6">
          User Settings
        </SectionTitle>

        {/* Profile URL Section */}
        <Typography
          variant="body2"
          color={colorMode === "light" ? "black" : "white"}
          gutterBottom
        >
          Share your profile URL on other platforms.
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={profileUrl}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Copy to clipboard">
                  <IconButton
                    onClick={handleCopyProfileUrl}
                    size="small"
                    sx={{ color: colorMode === "light" ? "black" : "white" }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            input: { color: colorMode === "light" ? "gray" : "white" },
            fieldset: {
              borderColor: colorMode === "light" ? "gray" : "white",
            },
          }}
        />

        {/* Distance Range */}
        <Typography color={colorMode === "light" ? "black" : "white"}>
          Distance Range: {distanceRange} {distanceRange > 100 ? "miles" : "km"}
        </Typography>
        <Slider
          value={distanceRange}
          onChange={(e, newValue) => setDistanceRange(newValue)}
          valueLabelDisplay="auto"
          min={0}
          max={100}
          sx={{ mb: 2, color: colorMode === "light" ? "#1976d2" : "#90caf9" }}
        />

        {/* Age Range */}
        <Typography color={colorMode === "light" ? "black" : "white"}>
          Age Range: {ageRange[0]} - {ageRange[1]}
        </Typography>
        <Slider
          value={ageRange}
          onChange={(e, newValue) => setAgeRange(newValue)}
          valueLabelDisplay="auto"
          min={18}
          max={80}
          sx={{ mb: 2, color: colorMode === "light" ? "#1976d2" : "#90caf9" }}
        />

        {/* Save Button */}
        <StyledButton
          colorMode={colorMode}
          onClick={handleSaveSettings}
          fullWidth
        >
          Save Settings
        </StyledButton>
      </CardContent>
    </Container>
  );
};

export default UserSettings;
