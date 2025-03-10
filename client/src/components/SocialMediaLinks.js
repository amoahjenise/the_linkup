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
} from "@mui/material";
import { FaXTwitter } from "react-icons/fa6";
import { Instagram, Facebook } from "@mui/icons-material";
import { useColorMode } from "@chakra-ui/react";

// Styled components
const StyledPaper = styled(Paper)(({ theme, colorMode }) => ({
  borderRadius: 12,
  position: "absolute",
  width: "100%",
  maxWidth: 400,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(3),
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: colorMode === "dark" ? "#E0E0E0" : "#333333",
  backgroundColor: colorMode === "dark" ? "#181818" : "#F2F2F2",
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
}));

const StyledTextField = styled(TextField)(({ textColor, isReadOnly }) => ({
  "& .MuiInputBase-root": {
    color: textColor,
    pointerEvents: isReadOnly ? "none" : "auto",
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
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
      >
        {url}
      </Link>
    ) : (
      <Typography color="gray">No {label} link</Typography>
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

  const textColor = colorMode === "light" ? "black" : "white";

  return (
    <Modal open={open} onClose={onClose}>
      <StyledPaper colorMode={colorMode}>
        <StyledBox>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <StyledTypography variant="h6" gutterBottom textColor={textColor}>
              Social Media Links
            </StyledTypography>
            {isLoggedUserProfile && (
              <Box display="flex" alignItems="center">
                <Typography variant="body2" sx={{ marginRight: 1 }}>
                  {isEditable ? "Save" : "Edit"}
                </Typography>
                <Switch
                  checked={isEditable}
                  onChange={() => {
                    if (isEditable) handleSave();
                    setIsEditable(!isEditable);
                  }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <SocialMediaField
              icon={<Instagram sx={{ color: "purple" }} />}
              label="Instagram"
              url={socialLinks.instagram}
              setUrl={(value) =>
                setSocialLinks((prev) => ({ ...prev, instagram: value }))
              }
              isEditable={isEditable && isLoggedUserProfile}
              textColor={textColor}
            />
            <SocialMediaField
              icon={<Facebook sx={{ color: "blue" }} />}
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
                  color={colorMode === "light" ? "black" : "white"}
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
