import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Slider,
  useTheme,
} from "@mui/material";
import { useSnackbar } from "../contexts/SnackbarContext";
import { ContentCopy, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useColorMode } from "@chakra-ui/react";
import { saveUserSettings as saveSettingsToRedux } from "../redux/actions/userSettingsActions";
import { saveUserSettings as saveSettingsToDB } from "../api/usersAPI";
import { customGenderOptions } from "../utils/customGenderOptions";

// Constants
const MAX_DISTANCE = 1000;
const MIN_AGE = 18;
const MAX_AGE = 80;

// Styled components with proper dark mode support
const Container = styled(Card)(({ theme, colormode }) => ({
  maxWidth: 600,
  margin: "auto",
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: theme.shadows[6],
  transition: "all 0.3s ease",
  backgroundColor:
    colormode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.background.paper,
  "&:hover": { boxShadow: theme.shadows[8] },
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
    "-moz-appearance": "textfield",
    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
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

const UserSettings = ({ onClose, isMobile }) => {
  const dispatch = useDispatch();
  const { addSnackbar } = useSnackbar();
  const { user } = useSelector((state) => state.loggedUser);
  const { userSettings } = useSelector((state) => state.userSettings);
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    feed: true,
  });
  const [distanceRange, setDistanceRange] = useState(50);
  const [ageRange, setAgeRange] = useState([MIN_AGE, MAX_AGE]);
  const [genderPreference, setGenderPreference] = useState([]);

  // Memoized values
  const profileUrl = useMemo(
    () => `${window.location.origin}/profile/${user.id}`,
    [user.id]
  );

  const textColor = useMemo(
    () => (colorMode === "dark" ? theme.palette.common.white : "inherit"),
    [colorMode, theme]
  );

  const genderOptions = useMemo(
    () => [
      { key: "men", value: "Men" },
      { key: "women", value: "Women" },
      ...customGenderOptions.map((gender) => ({
        key: gender.toLowerCase(),
        value: gender,
      })),
    ],
    []
  );

  useEffect(() => {
    if (userSettings) {
      setDistanceRange(userSettings.distanceRange?.[1] ?? 50);
      setAgeRange(userSettings.ageRange ?? [MIN_AGE, MAX_AGE]);
      setGenderPreference(
        (userSettings.genderPreferences || []).map((g) =>
          typeof g === "string" ? g.toLowerCase() : g
        )
      );
    }
  }, [userSettings]);

  const toggleSection = useCallback((section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  // Distance handlers - matches old version behavior
  const handleDistanceChange = useCallback((e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "").replace(/^0+/, "");
    const finalValue = numericValue === "" ? 0 : parseInt(numericValue, 10);
    setDistanceRange(Math.min(MAX_DISTANCE, Math.max(0, finalValue)));
  }, []);

  // Age handlers - matches old version behavior
  const handleAgeMinChange = useCallback((e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "").replace(/^0+/, "");
    const finalValue =
      numericValue === "" ? MIN_AGE : parseInt(numericValue, 10);
    setAgeRange((prev) => [
      Math.min(prev[1] - 1, Math.max(MIN_AGE, finalValue)),
      prev[1],
    ]);
  }, []);

  const handleAgeMaxChange = useCallback((e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "").replace(/^0+/, "");
    const finalValue =
      numericValue === "" ? MAX_AGE : parseInt(numericValue, 10);
    setAgeRange((prev) => [
      prev[0],
      Math.min(MAX_AGE, Math.max(prev[0] + 1, finalValue)),
    ]);
  }, []);

  const handleGenderSelect = useCallback((gender) => {
    setGenderPreference((prev) =>
      prev.includes(gender)
        ? prev.filter((g) => g !== gender)
        : [...prev, gender]
    );
  }, []);

  const handleSelectAllGenders = useCallback(() => {
    setGenderPreference((prev) =>
      prev.length === genderOptions.length
        ? []
        : genderOptions.map((g) => g.key)
    );
  }, [genderOptions]);

  const handleCopyProfileUrl = useCallback(() => {
    navigator.clipboard
      .writeText(profileUrl)
      .then(() => addSnackbar("Profile URL copied to clipboard", "success"))
      .catch(() => addSnackbar("Failed to copy URL", "error"));
  }, [profileUrl, addSnackbar]);

  const handleSaveSettings = useCallback(async () => {
    try {
      const updatedSettings = {
        distanceRange: [0, distanceRange],
        ageRange,
        genderPreferences: genderPreference.map((g) => g.toLowerCase()),
      };

      const response = await saveSettingsToDB(user.id, updatedSettings);
      if (!response.success) throw new Error(response.message || "Save failed");

      dispatch(saveSettingsToRedux(response.settings));
      addSnackbar("Settings saved successfully", "success");
      // Only close if in mobile mode
      if (isMobile) {
        onClose?.();
      }
    } catch (error) {
      addSnackbar(error.message || "Failed to save settings", "error");
    }
  }, [
    distanceRange,
    ageRange,
    genderPreference,
    user.id,
    dispatch,
    addSnackbar,
    onClose,
    isMobile,
  ]);

  return (
    <Container colormode={colorMode} sx={{ p: { xs: 2, sm: 3 } }}>
      <CardContent>
        {/* Profile Sharing Section */}
        <SectionTitle
          colormode={colorMode}
          onClick={() => toggleSection("profile")}
        >
          Profile Sharing
          {expandedSections.profile ? <ExpandLess /> : <ExpandMore />}
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
              }}
            />
            <Button
              variant="contained"
              onClick={handleCopyProfileUrl}
              startIcon={<ContentCopy />}
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
        </Collapse>

        <Divider
          sx={{
            my: 3,
            borderColor:
              colorMode === "dark" ? theme.palette.grey[700] : "divider",
          }}
        />

        {/* Feed Preferences Section */}
        <SectionTitle
          colormode={colorMode}
          onClick={() => toggleSection("feed")}
        >
          Feed Preferences
          {expandedSections.feed ? <ExpandLess /> : <ExpandMore />}
        </SectionTitle>

        <Collapse in={expandedSections.feed}>
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
                  <InputAdornment position="end">
                    <Typography
                      sx={{
                        color:
                          colorMode === "dark"
                            ? theme.palette.common.white
                            : "text.primary",
                      }}
                    >
                      km
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
            <Slider
              value={distanceRange}
              onChange={(e, newValue) => setDistanceRange(newValue)}
              min={0}
              max={MAX_DISTANCE}
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
              InputProps={{
                readOnly: true,
              }}
            />
            <Slider
              value={ageRange}
              onChange={(e, newValue) => setAgeRange(newValue)}
              min={MIN_AGE}
              max={MAX_AGE}
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
              InputProps={{
                readOnly: true,
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
          <Button
            onClick={handleSelectAllGenders}
            variant="outlined"
            sx={{
              color:
                colorMode === "dark" ? theme.palette.common.white : "inherit",
              borderColor:
                colorMode === "dark" ? theme.palette.grey[700] : undefined,
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor:
                  colorMode === "dark"
                    ? theme.palette.grey[800]
                    : theme.palette.grey[100],
              },
            }}
          >
            Select All
          </Button>
        </Collapse>

        {/* Save Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleSaveSettings}
            sx={{
              padding: "12px 32px",
              borderRadius: 12,
              fontWeight: 600,
              textTransform: "none",
              background:
                colorMode === "dark"
                  ? "linear-gradient(45deg, #0d47a1 30%, #1565c0 90%)"
                  : "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
              color: "white",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: theme.shadows[2],
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </CardContent>
    </Container>
  );
};

export default UserSettings;
