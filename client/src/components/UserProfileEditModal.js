import React, { useState } from "react";
import {
  Modal,
  styled,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import AvatarUpdate from "../components/AvatarUpdate";

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
  color: colorMode === "dark" ? "#E0E0E0" : "#202124",
  backgroundColor: colorMode === "dark" ? "#2D2D2D" : "#FFFFFF",
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
      ? "#757575" // Gray for Cancel in dark mode
      : "#D32F2F" // Red for Cancel in light mode
    : "#0097A7", // Teal for Save
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: isCancel
      ? colorMode === "dark"
        ? "#616161" // Darker gray for Cancel hover in dark mode
        : "#C62828" // Darker red for Cancel hover in light mode
      : "#007b86", // Darker teal for Save hover
  },
}));

// MAX_BIO_LENGTH and MIN_CHARS_REMAINING_TO_DISPLAY for bio text area
const MAX_BIO_LENGTH = 160;
const MIN_CHARS_REMAINING_TO_DISPLAY = 10;

const UserProfileEditModal = ({
  isOpen,
  onClose,
  userData,
  onSave,
  colorMode,
}) => {
  const [editedBio, setEditedBio] = useState(userData.bio || "");
  const [updatedAvatar, setUpdatedAvatar] = useState(userData.avatar || null);
  const [editedName, setEditedName] = useState(userData.name || "");

  const handleSave = () => {
    onSave(editedBio, updatedAvatar, editedName);
  };

  // Format the date of birth
  const formattedDOB = new Date(userData.date_of_birth).toLocaleDateString();

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
                color: colorMode === "dark" ? "#B0B0B0" : "#909090",
                backgroundColor: colorMode === "dark" ? "#424242" : "#E0E0E0",
              },
              // style: {
              //   color: colorMode === "dark" ? "#E0E0E0" : "#202124",
              // },
            }}
            InputLabelProps={{
              style: { color: colorMode === "dark" ? "#B0B0B0" : "#606060" },
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
                color: colorMode === "dark" ? "#B0B0B0" : "#909090",
                backgroundColor: colorMode === "dark" ? "#424242" : "#E0E0E0",
              },
            }}
            InputLabelProps={{
              style: { color: colorMode === "dark" ? "#757575" : "#B0B0B0" },
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
