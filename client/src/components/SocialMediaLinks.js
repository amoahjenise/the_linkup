import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  styled,
  Link,
  Switch,
} from "@mui/material";
import { Instagram, Facebook, Twitter } from "@mui/icons-material";
import { useColorMode } from "@chakra-ui/react";

// Styled components
const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledTypography = styled(Typography)(({ textColor }) => ({
  color: textColor,
}));

const StyledTextField = styled(TextField)(({ textColor, isReadOnly }) => ({
  "& .MuiInputBase-root": {
    color: textColor,
    pointerEvents: isReadOnly ? "none" : "auto", // Disable input in read-only mode
  },
  "& .MuiInputLabel-root": {
    color: textColor,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: textColor,
    },
    "&:hover fieldset": {
      borderColor: textColor,
    },
  },
}));

const StyledButton = styled(Button)({
  marginTop: 16,
  backgroundColor: "#C13584",
  "&:hover": {
    backgroundColor: "#C11884",
  },
  display: "block", // Center the button
  marginLeft: "auto",
  marginRight: "auto",
});

const SocialMediaLinks = ({ userData, onSave, isLoggedUserProfile }) => {
  const { colorMode } = useColorMode();
  const [instagramUrl, setInstagramUrl] = useState(
    userData?.instagram_url || ""
  );
  const [facebookUrl, setFacebookUrl] = useState(userData?.facebook_url || "");
  const [twitterUrl, setTwitterUrl] = useState(userData?.twitter_url || "");
  const [previewMode, setPreviewMode] = useState(false); // Toggle preview mode

  const handleSave = () => {
    onSave({
      instagram_url: instagramUrl,
      facebook_url: facebookUrl,
      twitter_url: twitterUrl,
    });
  };

  const formatUrl = (url) => {
    if (!url) return null; // Return null if there's no URL
    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  };

  // Define colors for light and dark modes
  const textColor = colorMode === "light" ? "black" : "white";
  const iconColor = colorMode === "light" ? "black" : "white";

  return (
    <StyledBox>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <StyledTypography variant="h6" gutterBottom textColor={textColor}>
          Social Media Links
        </StyledTypography>
        {isLoggedUserProfile && (
          <Box display="flex" alignItems="center">
            <Typography
              variant="body2"
              sx={{ color: textColor, marginRight: 1 }}
            >
              {previewMode ? "Edit" : "Preview"}
            </Typography>
            <Switch
              checked={previewMode}
              onChange={() => setPreviewMode(!previewMode)}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Instagram */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Instagram sx={{ color: iconColor }} />
          {previewMode || !isLoggedUserProfile ? (
            instagramUrl ? (
              <Link
                href={formatUrl(instagramUrl)}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                {instagramUrl}
              </Link>
            ) : (
              <Typography color="gray">No Instagram link</Typography>
            )
          ) : (
            <StyledTextField
              fullWidth
              label="Instagram URL"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              textColor={textColor}
              isReadOnly={!isLoggedUserProfile}
              InputProps={{ readOnly: !isLoggedUserProfile }}
            />
          )}
        </Box>

        {/* Facebook */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Facebook sx={{ color: iconColor }} />
          {previewMode || !isLoggedUserProfile ? (
            facebookUrl ? (
              <Link
                href={formatUrl(facebookUrl)}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                {facebookUrl}
              </Link>
            ) : (
              <Typography color="gray">No Facebook link</Typography>
            )
          ) : (
            <StyledTextField
              fullWidth
              label="Facebook URL"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              textColor={textColor}
              isReadOnly={!isLoggedUserProfile}
              InputProps={{ readOnly: !isLoggedUserProfile }}
            />
          )}
        </Box>

        {/* Twitter */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Twitter sx={{ color: iconColor }} />
          {previewMode || !isLoggedUserProfile ? (
            twitterUrl ? (
              <Link
                href={formatUrl(twitterUrl)}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                {twitterUrl}
              </Link>
            ) : (
              <Typography color="gray">No Twitter link</Typography>
            )
          ) : (
            <StyledTextField
              fullWidth
              label="Twitter URL"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              textColor={textColor}
              isReadOnly={!isLoggedUserProfile}
              InputProps={{ readOnly: !isLoggedUserProfile }}
            />
          )}
        </Box>
      </Box>

      {/* Save Button (only show if editable) */}
      {isLoggedUserProfile && !previewMode && (
        <StyledButton variant="contained" onClick={handleSave}>
          Save Links
        </StyledButton>
      )}
    </StyledBox>
  );
};

export default SocialMediaLinks;
