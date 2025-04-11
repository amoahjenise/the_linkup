import React, { useState, useEffect } from "react";
import {
  Modal,
  styled,
  Button,
  TextField,
  Typography,
  Paper,
  useMediaQuery,
} from "@mui/material";
import AvatarUpdate from "../components/AvatarUpdate";
import { useColorMode } from "@chakra-ui/react";

// StyledPaper for the modal container with improved responsiveness
const StyledPaper = styled(Paper)(({ theme, colorMode, fullScreen }) => ({
  borderRadius: fullScreen ? 0 : 16,
  position: "absolute",
  width: "100%",
  maxWidth: 600,
  maxHeight: "90vh",
  boxShadow: theme.shadows[5],
  padding: theme.spacing(3),
  top: fullScreen ? 0 : "50%",
  left: fullScreen ? 0 : "50%",
  transform: fullScreen ? "none" : "translate(-50%, -50%)",
  color: colorMode === "dark" ? "#E0E0E0" : "#333333",
  backgroundColor: colorMode === "dark" ? "#1E1E1E" : "#FFFFFF",
  display: "flex",
  flexDirection: "column",
  outline: "none",
  overflowY: "auto",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    maxWidth: "100%",
    maxHeight: "100vh",
    borderRadius: 0,
    padding: theme.spacing(2),
  },
}));

// Styled TextField with fixed label positioning
const StyledTextField = styled(TextField)(({ theme, colorMode }) => ({
  marginTop: theme.spacing(2),
  width: "100%",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: colorMode === "dark" ? "#424242" : "#E0E0E0",
      transition: "border-color 0.2s ease",
    },
    "&:hover fieldset": {
      borderColor: colorMode === "dark" ? "#616161" : "#BDBDBD",
    },
    "&.Mui-focused fieldset": {
      borderColor: colorMode === "dark" ? "#90CAF9" : "#2196F3",
      borderWidth: 1,
    },
  },
  "& .MuiInputBase-input": {
    color: colorMode === "dark" ? "#FFFFFF" : "#333333",
    padding: "12px 14px",
  },
  "& .MuiInputLabel-root": {
    color: colorMode === "dark" ? "#B0B0B0" : "#666666",
    "&.Mui-focused": {
      color: colorMode === "dark" ? "#90CAF9" : "#2196F3",
    },
  },
  "& .MuiFormLabel-filled": {
    transform: "translate(14px, -9px) scale(0.75)",
  },
}));

// DialogContent with improved spacing
const DialogContent = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  overflowY: "auto",
  padding: theme.spacing(0, 1),
}));

// AvatarContainer with better touch targets
const AvatarContainer = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(3),
  cursor: "pointer",
  width: "100%",
  display: "flex",
  justifyContent: "center",
}));

// BioTextField with proper sizing and label positioning
const BioTextField = styled(TextField)(({ theme, colorMode }) => ({
  marginTop: theme.spacing(3),
  backgroundColor: colorMode === "dark" ? "#252525" : "#FAFAFA",
  width: "100%",
  borderRadius: 8,
  "& .MuiInputBase-inputMultiline": {
    padding: "12px 14px",
    minHeight: "80px", // Reduced from 120px
  },
  "& .MuiInputBase-input": {
    color: colorMode === "dark" ? "#E0E0E0" : "#333333",
  },
  "& .MuiInputLabel-root": {
    color: colorMode === "dark" ? "#B0B0B0" : "#666666",
    "&.Mui-focused": {
      color: colorMode === "dark" ? "#90CAF9" : "#2196F3",
    },
  },
  "& .MuiFormLabel-filled": {
    transform: "translate(14px, -9px) scale(0.75)",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: colorMode === "dark" ? "#424242" : "#E0E0E0",
    },
    "&:hover fieldset": {
      borderColor: colorMode === "dark" ? "#616161" : "#BDBDBD",
    },
    "&.Mui-focused fieldset": {
      borderColor: colorMode === "dark" ? "#90CAF9" : "#2196F3",
      borderWidth: 1,
    },
  },
}));

// CharCount with better visibility
const CharCount = styled(Typography)(({ theme, charsRemaining }) => ({
  marginTop: theme.spacing(1),
  color: charsRemaining <= 10 ? "#FF5252" : theme.palette.text.secondary,
  alignSelf: "flex-end",
  fontSize: "0.75rem",
  fontWeight: 500,
}));

// ButtonGroup with improved button sizing
const ButtonGroup = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(4),
  width: "100%",
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    position: "sticky",
    bottom: 0,
    padding: theme.spacing(2, 0),
    backgroundColor: "inherit",
    zIndex: 1,
  },
}));

// StyledButton with better visual hierarchy
const StyledButton = styled(Button)(({ theme, colorMode, isCancel }) => ({
  minWidth: 100,
  padding: theme.spacing(1.5, 2),
  borderRadius: 9999,
  fontWeight: 700,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    boxShadow: "none",
  },
  ...(isCancel
    ? {
        color: colorMode === "dark" ? "#E0E0E0" : "#333333",
        backgroundColor: colorMode === "dark" ? "#333333" : "#F0F0F0",
        "&:hover": {
          backgroundColor: colorMode === "dark" ? "#424242" : "#E0E0E0",
        },
      }
    : {
        backgroundColor: colorMode === "dark" ? "#0097A7" : "#1DA1F2",
        color: "#FFFFFF",
        "&:hover": {
          backgroundColor: colorMode === "dark" ? "#007b86" : "#1991DB",
        },
      }),
}));

const MAX_BIO_LENGTH = 160;
const MIN_CHARS_REMAINING_TO_DISPLAY = 10;

const UserProfileEditModal = ({ isOpen, onClose, userData, onSave }) => {
  const { colorMode } = useColorMode();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [editedBio, setEditedBio] = useState(userData?.bio || "");
  const [updatedAvatar, setUpdatedAvatar] = useState(userData?.avatar || null);
  const [editedName, setEditedName] = useState(userData?.name || "");

  useEffect(() => {
    if (isOpen && userData) {
      setEditedBio(userData.bio || "");
      setUpdatedAvatar(userData.avatar || null);
      setEditedName(userData.name || "");
    }
  }, [isOpen, userData]);

  const handleSave = () => {
    onSave(editedBio, updatedAvatar, editedName);
  };

  const formattedDOB = userData?.date_of_birth
    ? new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(userData.date_of_birth))
    : "";

  if (!userData) {
    return null;
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
      }}
      disableScrollLock={false}
    >
      <StyledPaper colorMode={colorMode} fullScreen={isMobile}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Edit Profile
        </Typography>

        <DialogContent>
          <AvatarContainer>
            <AvatarUpdate
              userId={userData.id}
              currentAvatarUrl={userData.avatar}
              isLoggedUserProfile={true}
              onUpdateAvatar={setUpdatedAvatar}
            />
          </AvatarContainer>

          <StyledTextField
            label="Name"
            variant="outlined"
            value={editedName}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            margin="normal"
            colorMode={colorMode}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <StyledTextField
            label="Date of Birth"
            variant="outlined"
            value={formattedDOB}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            margin="normal"
            colorMode={colorMode}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <BioTextField
            label="Bio"
            multiline
            minRows={1} // Reduced from minRows={4}
            maxRows={5} // Reduced from maxRows={8}
            variant="outlined"
            value={editedBio}
            onChange={(e) => {
              const newBio = e.target.value;
              if (newBio.length <= MAX_BIO_LENGTH) {
                setEditedBio(newBio);
              }
            }}
            colorMode={colorMode}
            inputProps={{
              maxLength: MAX_BIO_LENGTH,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {MAX_BIO_LENGTH - editedBio.length <=
            MIN_CHARS_REMAINING_TO_DISPLAY && (
            <CharCount charsRemaining={MAX_BIO_LENGTH - editedBio.length}>
              {MAX_BIO_LENGTH - editedBio.length} characters remaining
            </CharCount>
          )}
        </DialogContent>

        <ButtonGroup>
          <StyledButton
            onClick={handleSave}
            colorMode={colorMode}
            isCancel={false}
            disabled={!editedName.trim()}
          >
            Save
          </StyledButton>
          <StyledButton onClick={onClose} colorMode={colorMode} isCancel={true}>
            Cancel
          </StyledButton>
        </ButtonGroup>
      </StyledPaper>
    </Modal>
  );
};

export default UserProfileEditModal;
