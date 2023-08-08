import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import axios from "axios";
const userServiceUrl = process.env.REACT_APP_USER_SERVICE_URL;

const useStyles = makeStyles((theme) => ({
  avatarUpdate: {
    position: "relative",
    display: "inline-block",
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    border: `2px solid ${theme.palette.background.default}`,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    background: "#fff",
    borderRadius: "50%",
    padding: theme.spacing(0.5),
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    display: ({ isLoggedUserProfile }) =>
      isLoggedUserProfile ? "block" : "none",
  },
  input: {
    display: "none",
  },
}));

const AvatarUpdate = ({ userId, currentAvatarUrl, isLoggedUserProfile }) => {
  const classes = useStyles({ isLoggedUserProfile });
  const [previewImage, setPreviewImage] = useState(currentAvatarUrl);
  const inputRef = useRef(null);

  useEffect(() => {
    setPreviewImage(currentAvatarUrl); // Update previewImage when currentAvatarUrl changes
  }, [currentAvatarUrl]);

  const updateAvatar = async (imageUrl) => {
    try {
      await axios.post(`${userServiceUrl}/upload-avatar`, {
        userId: userId,
        imageUrl: imageUrl,
      });
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        // Update user's avatar in database
        updateAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <div className={classes.avatarUpdate}>
      <Avatar
        src={previewImage}
        alt="Profile Avatar"
        className={classes.avatar}
        onClick={handleClick}
      />
      {isLoggedUserProfile && (
        <>
          <input
            type="file"
            ref={inputRef}
            accept="image/*"
            className={classes.input}
            onChange={handleImageChange}
          />
          <IconButton
            className={classes.cameraIcon}
            component="span"
            aria-label="Upload Avatar"
            onClick={handleClick}
          >
            <PhotoCameraIcon />
          </IconButton>
        </>
      )}
    </div>
  );
};

export default AvatarUpdate;
