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

const StyledPaper = styled(Paper)(({ theme, colorMode }) => ({
  borderRadius: 0,
  position: "absolute",
  width: 400,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(3),
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: colorMode === "dark" ? "white" : "black",
  backgroundColor: colorMode === "dark" ? "#1e1e1e" : "white",
}));

const DialogContent = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const AvatarContainer = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const BioTextField = styled(TextField)(({ theme, colorMode }) => ({
  marginTop: theme.spacing(2),
  "& .MuiInputBase-root": {
    color: colorMode === "dark" ? "white" : "black",
  },
  "& .MuiInputLabel-root": {
    color: colorMode === "dark" ? "white" : "black",
  },
}));

const CharCount = styled(Typography)(({ theme, charsRemaining }) => ({
  marginTop: theme.spacing(1),
  color: charsRemaining <= 10 ? "red" : "inherit",
}));

const ButtonGroup = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: "120px",
  marginRight: theme.spacing(2),
}));

const MAX_BIO_LENGTH = 160;
const MIN_CHARS_REMAINING_TO_DISPLAY = 10;

const UserProfileEditModal = ({
  isOpen,
  onClose,
  userData,
  onSave,
  colorMode,
  userLocation,
}) => {
  const [editedBio, setEditedBio] = useState(userData.bio);
  const [updatedAvatar, setUpdatedAvatar] = useState(userData.avatar || null); // Initialize with the current avatar

  const handleSave = () => {
    onSave(editedBio, updatedAvatar);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <StyledPaper colorMode={colorMode}>
        <Typography variant="h6">Edit Profile</Typography>
        <DialogContent>
          {/* Avatar (Editable using AvatarUpdate component) */}
          <AvatarContainer>
            <AvatarUpdate
              userId={userData.id}
              currentAvatarUrl={userData.avatar}
              isLoggedUserProfile={true}
              onUpdateAvatar={setUpdatedAvatar}
            />
          </AvatarContainer>

          {/* Name (Read-only) */}
          <Typography>
            <strong>Name:</strong> {userData.name}
          </Typography>

          {/* Geolocation (Read-only) */}
          <Typography>
            <strong>Location:</strong> {userLocation || "Unknown Location"}
          </Typography>

          {/* Bio (Editable) */}
          <BioTextField
            label="Bio"
            multiline
            minRows={6}
            variant="outlined"
            value={editedBio}
            InputProps={{
              style: { color: colorMode === "dark" ? "white" : "black" },
            }}
            InputLabelProps={{
              style: { color: colorMode === "dark" ? "white" : "black" },
            }}
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
            color="primary"
            variant="contained"
          >
            Save
          </StyledButton>
          <StyledButton onClick={onClose} variant="contained">
            Cancel
          </StyledButton>
        </ButtonGroup>
      </StyledPaper>
    </Modal>
  );
};

export default UserProfileEditModal;
