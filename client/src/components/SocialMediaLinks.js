import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  styled,
  Link,
  Switch,
  Modal,
  Paper,
  IconButton,
} from "@mui/material";
import { FaXTwitter } from "react-icons/fa6";
import { Instagram, Facebook, Close } from "@mui/icons-material";
import { useColorMode } from "@chakra-ui/react";

// Styled components
const StyledPaper = styled(Paper)(({ theme, colorMode }) => ({
  borderRadius: 16, // Increased border radius for a modern look
  position: "absolute",
  width: "100%",
  maxWidth: 440, // Slightly wider for better spacing
  boxShadow: theme.shadows[10], // Deeper shadow for a "floating" effect
  padding: theme.spacing(3), // Reduced padding
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: colorMode === "dark" ? "#E0E0E0" : "#333333",
  backgroundColor: colorMode === "dark" ? "#1E1E1E" : "#FFFFFF", // Darker dark mode, pure white light mode
  [theme.breakpoints.down("sm")]: {
    width: "90%",
    maxWidth: "90%",
    padding: theme.spacing(2),
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledTypography = styled(Typography)(({ textColor }) => ({
  color: textColor,
  fontWeight: 700, // Bold title
  fontSize: "1.25rem", // Larger font size for the title
}));

const StyledTextField = styled(TextField)(({ textColor, isReadOnly }) => ({
  "& .MuiInputBase-root": {
    color: textColor,
    pointerEvents: isReadOnly ? "none" : "auto",
    borderRadius: 8, // Rounded corners for inputs
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
    "&.Mui-focused fieldset": {
      borderColor: textColor,
      borderWidth: 2, // Thicker border on focus
    },
  },
}));

const SocialMediaField = ({
  icon,
  label,
  url,
  setUrl,
  isEditable,
  textColor,
}) => (
  <Box
    sx={{ display: "flex", alignItems: "center", gap: 1.5, marginBottom: 2 }}
  >
    {icon}
    {isEditable ? (
      <StyledTextField
        fullWidth
        label={label}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        InputProps={{ readOnly: !isEditable }}
        textColor={textColor}
      />
    ) : url ? (
      <Link
        href={url.startsWith("http") ? url : `https://${url}`}
        target="_blank"
        rel="noopener noreferrer"
        color="inherit"
        sx={{
          textDecoration: "none",
          whiteSpace: "nowrap", // Prevent overflow
          overflow: "hidden", // Ensure no overflow
          textOverflow: "ellipsis", // Truncate long URLs
          "&:hover": { textDecoration: "underline", color: textColor },
        }}
      >
        {url}
      </Link>
    ) : (
      <Typography>No {label} link</Typography>
    )}
  </Box>
);

const SocialMediaLinks = ({
  userData,
  onSave,
  isLoggedUserProfile,
  open,
  onClose,
}) => {
  const { colorMode } = useColorMode();
  const [socialLinks, setSocialLinks] = useState({
    instagram: userData?.instagram_url || "",
    facebook: userData?.facebook_url || "",
    twitter: userData?.twitter_url || "",
  });
  const [isEditable, setIsEditable] = useState(false);

  // Update socialLinks when userData changes
  useEffect(() => {
    setSocialLinks({
      instagram: userData?.instagram_url || "",
      facebook: userData?.facebook_url || "",
      twitter: userData?.twitter_url || "",
    });
  }, [userData]);

  const handleSave = () => {
    onSave({
      instagram_url: socialLinks.instagram,
      facebook_url: socialLinks.facebook,
      twitter_url: socialLinks.twitter,
    });
  };

  const textColor = colorMode === "light" ? "#333333" : "#E0E0E0";

  return (
    <Modal open={open} onClose={onClose}>
      <StyledPaper colorMode={colorMode}>
        <StyledBox>
          {/* Header with title, close button, and edit toggle */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={3} // Reduced margin for better spacing
          >
            <StyledTypography variant="h6" textColor={textColor}>
              Social Media Links
            </StyledTypography>
            <Box display="flex" alignItems="center" gap={2}>
              {isLoggedUserProfile && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" sx={{ color: textColor }}>
                    {isEditable ? "Save" : "Edit"}
                  </Typography>
                  <Switch
                    checked={isEditable}
                    onChange={() => {
                      if (isEditable) handleSave();
                      setIsEditable(!isEditable);
                    }}
                    sx={{
                      "& .MuiSwitch-thumb": {
                        backgroundColor:
                          colorMode === "light" ? "#333333" : "#E0E0E0",
                      },
                      "& .MuiSwitch-track": {
                        backgroundColor:
                          colorMode === "light" ? "#B0B0B0" : "#555555",
                      },
                    }}
                  />
                </Box>
              )}
              <IconButton
                onClick={onClose}
                size="small"
                sx={{ color: textColor }}
              >
                <Close sx={{ fontSize: "1.5rem" }} /> {/* Larger close icon */}
              </IconButton>
            </Box>
          </Box>

          {/* Social media links */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <SocialMediaField
              icon={
                <Instagram sx={{ color: "#E1306C", fontSize: "1.75rem" }} />
              }
              label="Instagram"
              url={socialLinks.instagram}
              setUrl={(value) =>
                setSocialLinks((prev) => ({ ...prev, instagram: value }))
              }
              isEditable={isEditable && isLoggedUserProfile}
              textColor={textColor}
            />
            <SocialMediaField
              icon={<Facebook sx={{ color: "#1877F2", fontSize: "1.75rem" }} />}
              label="Facebook"
              url={socialLinks.facebook}
              setUrl={(value) =>
                setSocialLinks((prev) => ({ ...prev, facebook: value }))
              }
              isEditable={isEditable && isLoggedUserProfile}
              textColor={textColor}
            />
            <SocialMediaField
              icon={
                <FaXTwitter
                  size={24}
                  color={colorMode === "light" ? "#000000" : "#E0E0E0"}
                />
              }
              label="X (Twitter)"
              url={socialLinks.twitter}
              setUrl={(value) =>
                setSocialLinks((prev) => ({ ...prev, twitter: value }))
              }
              isEditable={isEditable && isLoggedUserProfile}
              textColor={textColor}
            />
          </Box>
        </StyledBox>
      </StyledPaper>
    </Modal>
  );
};

export default SocialMediaLinks;
