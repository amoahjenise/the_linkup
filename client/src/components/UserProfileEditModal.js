import React, { useState } from "react";
import {
  Modal,
  makeStyles,
  Button,
  TextField,
  Typography,
  Paper,
} from "@material-ui/core";
import AvatarUpdate from "../components/AvatarUpdate";

const useStyles = makeStyles((theme) => ({
  // Remove rounded corners
  paper: {
    borderRadius: 0,
    position: "absolute",
    width: 400,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Center content horizontally
  },
  avatarContainer: {
    marginBottom: theme.spacing(2),
  },
  bio: {
    marginTop: theme.spacing(2),
  },
  charCount: {
    marginTop: theme.spacing(1),
    color: ({ charsRemaining }) => (charsRemaining <= 10 ? "red" : "inherit"),
  },
  button: {
    width: "120px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(3),
  },
}));

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
  const [updatedAvatar, setUpdatedAvatar] = useState(userData.avatar || null); // Initialize with the current avatar

  const classes = useStyles({
    charsRemaining: MAX_BIO_LENGTH - editedBio.length,
  });

  const handleSave = () => {
    onSave(editedBio, updatedAvatar);
  };

  // Define text and background color based on color mode
  const modalTextColor =
    colorMode === "dark"
      ? "white" // Dark mode background color with no transparency
      : "black";

  const modalBackgroundColor =
    colorMode === "dark"
      ? "#1e1e1e" // Dark mode background color with no transparency
      : "white";

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Paper
        className={classes.paper}
        style={{
          color: modalTextColor,
          backgroundColor: modalBackgroundColor,
        }}
      >
        <Typography variant="h6">Edit Profile</Typography>
        <div className={classes.dialogContent}>
          {/* Avatar (Editable using AvatarUpdate component) */}
          <div className={classes.avatarContainer}>
            <AvatarUpdate
              userId={userData.id}
              currentAvatarUrl={userData.avatar}
              isLoggedUserProfile={true}
              onUpdateAvatar={setUpdatedAvatar}
            />
          </div>

          {/* Name (Read-only) */}
          <Typography>
            <strong>Name:</strong> {userData.name}
          </Typography>

          {/* Geolocation (Read-only) */}
          <Typography>
            <strong>Geolocation:</strong>{" "}
            {userData.geolocation || "Unknown Location"}
          </Typography>

          {/* Bio (Editable) */}
          <TextField
            className={classes.bio}
            label="Bio"
            multiline
            minRows={6}
            variant="outlined"
            value={editedBio}
            InputProps={{ style: { color: modalTextColor } }}
            InputLabelProps={{ style: { color: modalTextColor } }}
            onChange={(e) => {
              const newBio = e.target.value;
              if (newBio.length <= MAX_BIO_LENGTH) {
                setEditedBio(newBio);
              }
            }}
          />
          {MAX_BIO_LENGTH - editedBio.length <=
            MIN_CHARS_REMAINING_TO_DISPLAY && (
            <Typography className={classes.charCount}>
              {MAX_BIO_LENGTH - editedBio.length} characters remaining
            </Typography>
          )}
        </div>
        <div className={classes.buttonGroup}>
          <Button
            className={classes.button}
            onClick={handleSave}
            color="primary"
            variant="contained" // Make buttons raised
            style={{ marginRight: "20px" }}
          >
            Save
          </Button>
          <Button
            className={classes.button}
            onClick={onClose}
            color="default"
            variant="contained" // Make buttons raised
          >
            Cancel
          </Button>
        </div>
      </Paper>
    </Modal>
  );
};

export default UserProfileEditModal;
