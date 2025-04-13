import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import {
  Button,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Chip,
  Divider,
  Box,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  useTheme,
} from "@mui/material";
import { useSnackbar } from "../contexts/SnackbarContext";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useColorMode } from "@chakra-ui/react";
import { saveUserSettings as saveSettingsToRedux } from "../redux/actions/userSettingsActions";
import { saveUserSettings as saveSettingsToDB } from "../api/usersAPI";
import { customGenderOptions } from "../utils/customGenderOptions";

// Styled Components with proper colorMode integration
const Container = styled(Card)(({ theme, colormode }) => ({
  maxWidth: 600,
  margin: "auto",
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: theme.shadows[6],
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[8],
  },
  backgroundColor:
    colormode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.background.paper,
}));

const SectionTitle = styled(Typography)(({ theme, colormode }) => ({
  fontSize: "1.1rem",
  fontWeight: 600,
  marginTop: 30,
  marginBottom: 8,
  color:
    colormode === "dark"
      ? theme.palette.common.white
      : theme.palette.text.primary,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  padding: "8px 0",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const StyledButton = styled(Button)(({ theme, colormode }) => ({
  marginTop: 24,
  padding: "12px 32px",
  fontSize: "1rem",
  borderRadius: 12,
  fontWeight: 600,
  textTransform: "none",
  letterSpacing: 0.5,
  transition: "all 0.2s ease",
  boxShadow: "none",
  backgroundColor:
    colormode === "dark"
      ? theme.palette.primary.dark
      : theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[2],
    backgroundColor:
      colormode === "dark"
        ? theme.palette.primary.main
        : theme.palette.primary.dark,
  },
}));

const RangeInputContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 16,
  margin: "16px 0",
  flexDirection: "row",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
}));

const RangeInput = styled(TextField)(({ theme, colormode }) => ({
  width: 100,
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    color:
      colormode === "dark"
        ? theme.palette.common.white
        : theme.palette.text.primary,
    "& fieldset": {
      borderColor:
        colormode === "dark" ? theme.palette.grey[700] : theme.palette.divider,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.light,
    },
    backgroundColor:
      colormode === "dark"
        ? theme.palette.grey[800]
        : theme.palette.common.white,
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
  "& .MuiInputLabel-root": {
    color: colormode === "dark" ? theme.palette.common.white : undefined,
  },
  "& input[type=number]": {
    "-moz-appearance": "textfield", // Firefox
    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
      "-webkit-appearance": "none", // Safari and Chrome
      margin: 0,
    },
  },
}));

const GenderChip = styled(Chip)(({ theme, selected, colormode }) => ({
  margin: 4,
  borderRadius: 6,
  fontWeight: selected ? 600 : 400,
  transition: "all 0.2s ease",
  backgroundColor: selected ? theme.palette.primary.main : "transparent",
  color: selected
    ? theme.palette.primary.contrastText
    : colormode === "dark"
    ? theme.palette.common.white
    : theme.palette.text.primary,
  borderColor:
    colormode === "dark" ? theme.palette.grey[700] : "rgba(0, 0, 0, 0.23)",
  "&:hover": {
    transform: "scale(1.05)",
    backgroundColor: selected
      ? theme.palette.primary.dark
      : colormode === "dark"
      ? theme.palette.grey[700]
      : theme.palette.action.hover,
  },
}));

const UserSettings = () => {
  const dispatch = useDispatch();
  const { addSnackbar } = useSnackbar();
  const { user } = useSelector((state) => state.loggedUser);
  const { userSettings } = useSelector((state) => state.userSettings);
  const { colorMode } = useColorMode();
  const theme = useTheme();

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    discovery: true,
    privacy: false,
  });

  // User settings state - initialized from Redux store
  const [distanceRange, setDistanceRange] = useState(50);
  const [ageRange, setAgeRange] = useState([18, 99]);
  const [genderPreference, setGenderPreference] = useState([]);
  const [showExactLocation, setShowExactLocation] = useState(false);

  // Initialize state with user settings from Redux
  useEffect(() => {
    if (userSettings) {
      setDistanceRange(
        userSettings.distanceRange ? userSettings.distanceRange[1] : 50
      );
      setAgeRange(userSettings.ageRange || [18, 99]);
      // Convert stored genders to lowercase for consistent comparison
      setGenderPreference(
        (userSettings.genderPreferences || []).map((g) =>
          typeof g === "string" ? g.toLowerCase() : g
        )
      );
      setShowExactLocation(userSettings.showExactLocation || false);
    }
  }, [userSettings]);

  const genderOptions = [
    { key: "men", value: "Men" },
    { key: "women", value: "Women" },
    ...customGenderOptions.map((gender) => ({
      key: gender.toLowerCase(),
      value: gender,
    })),
  ];

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleGenderSelect = (gender) => {
    setGenderPreference((prev) =>
      prev.includes(gender)
        ? prev.filter((g) => g !== gender)
        : [...prev, gender]
    );
  };

  // Fixed distance input handler to remove leading zeros
  const handleDistanceChange = (e) => {
    const value = e.target.value;
    // Remove any non-numeric characters and leading zeros
    const numericValue = value.replace(/[^0-9]/g, "").replace(/^0+/, "");
    // Set to 0 if empty, otherwise parse the number
    const finalValue = numericValue === "" ? 0 : parseInt(numericValue, 10);
    // Apply min/max constraints
    setDistanceRange(Math.min(1000, Math.max(0, finalValue)));
  };

  // Improved age range handlers for manual input
  const handleAgeMinChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "").replace(/^0+/, "");
    const finalValue = numericValue === "" ? 18 : parseInt(numericValue, 10);
    const constrainedValue = Math.min(
      ageRange[1] - 1,
      Math.max(18, finalValue)
    );
    setAgeRange([constrainedValue, ageRange[1]]);
  };

  const handleAgeMaxChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "").replace(/^0+/, "");
    const finalValue = numericValue === "" ? 99 : parseInt(numericValue, 10);
    const constrainedValue = Math.min(
      80,
      Math.max(ageRange[0] + 1, finalValue)
    );
    setAgeRange([ageRange[0], constrainedValue]);
  };

  const handleSaveSettings = async () => {
    console.log("[DEBUG] Save function started");

    try {
      const updatedSettings = {
        distanceRange: [0, distanceRange],
        ageRange,
        genderPreferences: genderPreference.map((g) => g.toLowerCase()),
        showExactLocation,
        notificationEnabled: true, // Add if your backend expects this
      };

      const response = await saveSettingsToDB(user.id, updatedSettings);

      if (!response.success) {
        throw new Error(response.message || "Failed to save settings");
      }

      // Dispatch the actual settings data from response
      dispatch(saveSettingsToRedux(response.settings));

      addSnackbar("Settings saved successfully", "success", {
        autoHideDuration: 2000,
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    } catch (error) {
      addSnackbar(error.message || "Failed to save settings", "error");
    }
  };

  const profileUrl = `${window.location.origin}/profile/${user.id}`;

  const handleCopyProfileUrl = () => {
    navigator.clipboard
      .writeText(profileUrl)
      .then(() => addSnackbar("Profile URL copied to clipboard", "success"))
      .catch(() => addSnackbar("Failed to copy URL", "error"));
  };

  return (
    <Container colormode={colorMode} sx={{ p: { xs: 2, sm: 3 } }}>
      <CardContent>
        {/* Profile Section */}
        <SectionTitle
          colormode={colorMode}
          onClick={() => toggleSection("profile")}
        >
          Profile Sharing
          {expandedSections.profile ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </SectionTitle>

        <Collapse in={expandedSections.profile}>
          <Typography
            variant="body2"
            sx={{
              color:
                colorMode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "text.secondary",
              mb: 2,
            }}
          >
            Share your profile URL on other platforms
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              mb: 3,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              value={profileUrl}
              size="small"
              InputProps={{
                readOnly: true,
                sx: {
                  borderRadius: 2,
                  backgroundColor:
                    colorMode === "dark"
                      ? theme.palette.grey[800]
                      : "background.default",
                  color:
                    colorMode === "dark"
                      ? theme.palette.common.white
                      : "text.primary",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      colorMode === "dark"
                        ? theme.palette.grey[700]
                        : undefined,
                  },
                },
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{
                      color:
                        colorMode === "dark"
                          ? theme.palette.common.white
                          : undefined,
                    }}
                  ></InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleCopyProfileUrl}
              startIcon={<ContentCopyIcon />}
              sx={{
                borderRadius: 2,
                minWidth: 120,
                flexShrink: 0,
                backgroundColor:
                  colorMode === "dark"
                    ? theme.palette.primary.dark
                    : theme.palette.primary.main,
                color: theme.palette.common.white,
                "&:hover": {
                  backgroundColor:
                    colorMode === "dark"
                      ? theme.palette.primary.main
                      : theme.palette.primary.dark,
                },
              }}
            >
              Copy
            </Button>
          </Box>

          {/* <FormControlLabel
            control={
              <Switch
                checked={showExactLocation}
                onChange={(e) => setShowExactLocation(e.target.checked)}
                color="primary"
              />
            }
            label="Show exact location on profile"
            sx={{
              mb: 2,
              color:
                colorMode === "dark"
                  ? theme.palette.common.white
                  : "text.primary",
            }}
          /> */}
        </Collapse>

        <Divider
          sx={{
            my: 3,
            borderColor:
              colorMode === "dark" ? theme.palette.grey[700] : "divider",
          }}
        />

        {/* Feed Preferences */}
        <SectionTitle
          colormode={colorMode}
          onClick={() => toggleSection("discovery")}
        >
          Feed Preferences
          {expandedSections.discovery ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </SectionTitle>

        <Collapse in={expandedSections.discovery}>
          {/* Distance Preference */}
          <Typography
            variant="subtitle2"
            color={
              colorMode === "dark" ? theme.palette.common.white : "text.primary"
            }
            gutterBottom
            sx={{ mt: 1 }}
          >
            Maximum distance
          </Typography>
          <RangeInputContainer>
            <RangeInput
              colormode={colorMode}
              type="number"
              variant="outlined"
              value={distanceRange}
              onChange={handleDistanceChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{
                      "& .MuiTypography-root": {
                        color:
                          colorMode === "dark"
                            ? theme.palette.common.white
                            : undefined,
                      },
                      color:
                        colorMode === "dark"
                          ? theme.palette.common.white
                          : undefined,
                    }}
                  >
                    km
                  </InputAdornment>
                ),
              }}
            />
            <Slider
              value={distanceRange}
              onChange={(e, newValue) => setDistanceRange(newValue)}
              min={0}
              max={1000}
              step={10}
              sx={{
                flex: 1,
                color:
                  colorMode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
              }}
            />
          </RangeInputContainer>

          {/* Age Range */}
          <Typography
            variant="subtitle2"
            color={
              colorMode === "dark" ? theme.palette.common.white : "text.primary"
            }
            gutterBottom
            sx={{ mt: 3 }}
          >
            Age range
          </Typography>
          <RangeInputContainer>
            <RangeInput
              colormode={colorMode}
              type="number"
              variant="outlined"
              value={ageRange[0]}
              onChange={handleAgeMinChange}
              label="Min"
              InputLabelProps={{
                sx: {
                  color:
                    colorMode === "dark"
                      ? theme.palette.common.white
                      : undefined,
                },
              }}
            />
            <Slider
              value={ageRange}
              onChange={(e, newValue) => setAgeRange(newValue)}
              min={18}
              max={80}
              sx={{
                flex: 1,
                color:
                  colorMode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
              }}
            />
            <RangeInput
              colormode={colorMode}
              type="number"
              variant="outlined"
              value={ageRange[1]}
              onChange={handleAgeMaxChange}
              label="Max"
              InputLabelProps={{
                sx: {
                  color:
                    colorMode === "dark"
                      ? theme.palette.common.white
                      : undefined,
                },
              }}
            />
          </RangeInputContainer>

          {/* Gender Preference */}
          <Typography
            variant="subtitle2"
            color={
              colorMode === "dark" ? theme.palette.common.white : "text.primary"
            }
            gutterBottom
            sx={{ mt: 3 }}
          >
            Show me profiles of
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {genderOptions.map((gender) => (
              <GenderChip
                key={gender.key}
                colormode={colorMode}
                label={gender.value}
                onClick={() => handleGenderSelect(gender.key)}
                variant={
                  genderPreference.includes(gender.key) ? "filled" : "outlined"
                }
                color="primary"
                selected={genderPreference.includes(gender.key)}
              />
            ))}
          </Box>
        </Collapse>

        <Divider
          sx={{
            my: 3,
            borderColor:
              colorMode === "dark" ? theme.palette.grey[700] : "divider",
          }}
        />

        {/* Privacy Settings (Collapsed by default) */}
        {/* <SectionTitle
          colormode={colorMode}
          onClick={() => toggleSection("privacy")}
        >
          Privacy Settings
          {expandedSections.privacy ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </SectionTitle>

        <Collapse in={expandedSections.privacy}>
          <Typography
            variant="body2"
            sx={{
              color:
                colorMode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "text.secondary",
              mb: 2,
            }}
          >
            Control who can see your activity and profile
          </Typography>

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel
              sx={{
                color:
                  colorMode === "dark"
                    ? theme.palette.common.white
                    : "text.primary",
              }}
            >
              Profile Visibility
            </InputLabel>
            <Select
              value="public"
              label="Profile Visibility"
              sx={{
                borderRadius: 2,
                color:
                  colorMode === "dark"
                    ? theme.palette.common.white
                    : "text.primary",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor:
                    colorMode === "dark" ? theme.palette.grey[700] : undefined,
                },
              }}
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="friends">Friends Only</MenuItem>
              <MenuItem value="private">Private</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={<Switch color="primary" />}
            label="Allow profile to appear in search results"
            sx={{
              mb: 1,
              color:
                colorMode === "dark"
                  ? theme.palette.common.white
                  : "text.primary",
            }}
          />

          <FormControlLabel
            control={<Switch color="primary" />}
            label="Show online status"
            sx={{
              color:
                colorMode === "dark"
                  ? theme.palette.common.white
                  : "text.primary",
            }}
          />
        </Collapse> */}

        {/* Save Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <StyledButton
            colormode={colorMode}
            variant="contained"
            onClick={handleSaveSettings}
            sx={{
              background:
                colorMode === "dark"
                  ? "linear-gradient(45deg, #0d47a1 30%, #1565c0 90%)"
                  : "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
              color: "white",
            }}
          >
            Save Changes
          </StyledButton>
        </Box>
      </CardContent>
    </Container>
  );
};

export default UserSettings;
