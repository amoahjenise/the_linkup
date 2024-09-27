import React, { useState, useEffect } from "react";
import {
  Modal,
  styled,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import AvatarUpdate from "../components/AvatarUpdate";
import { useColorMode } from "@chakra-ui/react";

// StyledPaper for the modal container
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
  color: colorMode === "dark" ? "#E0E0E0" : "#333333", //  dark mode text color
  backgroundColor: colorMode === "dark" ? "#181818" : "#F2F2F2", //  dark/light mode background color
  [theme.breakpoints.down("sm")]: {
    width: "90%",
    maxWidth: "90%",
    padding: theme.spacing(2),
  },
}));

// DialogContent for the content inside the modal
const DialogContent = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

// AvatarContainer for the avatar section
const AvatarContainer = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

// BioTextField for the editable bio input
const BioTextField = styled(TextField)(({ theme, colorMode }) => ({
  marginTop: theme.spacing(2),
  width: "100%",
  "& .MuiInputBase-input": {
    color: colorMode === "dark" ? "#E0E0E0" : "#333333", // Input text color
  },
  "& .MuiInputLabel-root": {
    color: colorMode === "dark" ? "#B0B0B0" : "#333333", // Label color
  },
}));

// CharCount for character count display
const CharCount = styled(Typography)(({ theme, charsRemaining }) => ({
  marginTop: theme.spacing(1),
  color: charsRemaining <= 10 ? "#FF5252" : "inherit",
  alignSelf: "flex-end",
}));

// ButtonGroup for Save and Cancel buttons
const ButtonGroup = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginTop: theme.spacing(3),
  width: "100%",
}));

// StyledButton for Save and Cancel buttons
const StyledButton = styled(Button)(({ theme, colorMode, isCancel }) => ({
  flex: 1,
  "&:first-of-type": {
    marginRight: theme.spacing(2),
  },
  backgroundColor: isCancel
    ? colorMode === "dark"
      ? "#B0B0B0" // Gray for Cancel in dark mode
      : "#B0B0B0" // Gray for Cancel in light mode
    : "#0097A7", // Color for Save
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: isCancel
      ? colorMode === "dark"
        ? "#9E9E9E" // Darker gray for Cancel hover in dark mode
        : "#9E9E9E" // Darker gray for Cancel hover in light mode
      : "#007b86", // Darker color for Save hover
  },
}));

// MAX_BIO_LENGTH and MIN_CHARS_REMAINING_TO_DISPLAY for bio text area
const MAX_BIO_LENGTH = 160;
const MIN_CHARS_REMAINING_TO_DISPLAY = 10;

const UserProfileEditModal = ({ isOpen, onClose, userData, onSave }) => {
  const [editedBio, setEditedBio] = useState(userData.bio || "");
  const [updatedAvatar, setUpdatedAvatar] = useState(userData.avatar || null);
  const [editedName, setEditedName] = useState(userData.name || "");
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (isOpen) {
      // Reset the state with userData values when the modal is opened
      setEditedBio(userData.bio || "");
      setUpdatedAvatar(userData.avatar || null);
      setEditedName(userData.name || "");
    }
  }, [isOpen, userData]);

  const handleSave = () => {
    onSave(editedBio, updatedAvatar, editedName);
  };

  // Format the date of birth using Intl.DateTimeFormat
  const formattedDOB = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(userData.date_of_birth));

  return (
    <Modal open={isOpen} onClose={onClose}>
      <StyledPaper colorMode={colorMode}>
        <Typography variant="h6">Edit Profile</Typography>
        <DialogContent>
          <AvatarContainer>
            <AvatarUpdate
              userId={userData.id}
              currentAvatarUrl={userData.avatar}
              isLoggedUserProfile={true}
              onUpdateAvatar={setUpdatedAvatar}
            />
          </AvatarContainer>

          <TextField
            label="Name"
            variant="outlined"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            InputProps={{
              readOnly: true,
              style: {
                color: colorMode === "dark" ? "#E0E0E0" : "#333333", //  text color
                backgroundColor: colorMode === "dark" ? "#424242" : "#F2F2F2", //  background color for inputs
              },
            }}
            InputLabelProps={{
              style: { color: colorMode === "dark" ? "#B0B0B0" : "#333333" },
            }}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Date of Birth"
            variant="outlined"
            value={formattedDOB}
            InputProps={{
              readOnly: true,
              style: {
                color: colorMode === "dark" ? "#E0E0E0" : "#333333", //  text color
                backgroundColor: colorMode === "dark" ? "#424242" : "#F2F2F2", //  background color for inputs
              },
            }}
            InputLabelProps={{
              style: { color: colorMode === "dark" ? "#B0B0B0" : "#333333" },
            }}
            fullWidth
            margin="normal"
          />

          <BioTextField
            label="Bio"
            multiline
            minRows={6}
            variant="outlined"
            value={editedBio}
            onChange={(e) => {
              const newBio = e.target.value;
              if (newBio.length <= MAX_BIO_LENGTH) {
                setEditedBio(newBio);
              }
            }}
            colorMode={colorMode} // Pass colorMode prop
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
            isCancel={false} // Not the cancel button
          >
            Save
          </StyledButton>
          <StyledButton
            onClick={onClose}
            colorMode={colorMode}
            isCancel={true} // This is the cancel button
          >
            Cancel
          </StyledButton>
        </ButtonGroup>
      </StyledPaper>
    </Modal>
  );
};

export default UserProfileEditModal;
