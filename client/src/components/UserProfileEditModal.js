import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  makeStyles,
} from "@material-ui/core";
import AvatarUpdate from "../components/AvatarUpdate";

const useStyles = makeStyles((theme) => ({
  // Remove rounded corners
  paper: {
    borderRadius: 0,
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
}));

const UserProfileEditModal = ({ isOpen, onClose, userData, onSave }) => {
  const classes = useStyles();
  const [editedBio, setEditedBio] = useState(userData.bio || "");
  const [updatedAvatar, setUpdatedAvatar] = useState(userData.avatar || null); // Initialize with the current avatar

  const handleSave = () => {
    onSave(editedBio, updatedAvatar);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} classes={{ paper: classes.paper }}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent className={classes.dialogContent}>
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
        <div className={classes.readOnlyField}>
          <strong>Name:</strong> {userData.name}
        </div>

        {/* Geolocation (Read-only) */}
        <div className={classes.readOnlyField}>
          <strong>Geolocation:</strong>{" "}
          {userData.geolocation || "Unknown Location"}
        </div>

        {/* Bio (Editable) */}
        <TextField
          className={classes.bio}
          label="Bio"
          multiline
          rows={4}
          variant="outlined"
          value={editedBio}
          onChange={(e) => setEditedBio(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfileEditModal;
